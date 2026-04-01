import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { network } from "hardhat";

// 在 ESM 模式下手动构造当前脚本所在目录，后续同步 ABI 和 deployment.json 时会用到。
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 统一约束地址、交易哈希等十六进制字符串的类型，减少脚本中误传字符串的风险。
type Address = `0x${string}`;
type Hex = `0x${string}`;
type AbiItem = Record<string, unknown>;

// 部署结果清单结构。
// 这个对象最终会被写入：
// 1. blockchain/deployments/passport/<network>.json
// 2. frontend/src/contracts/passport/deployment.json
// 3. backend/contracts/passport/deployment.json
type PassportDeployment = {
  network: string;
  chainId: number;
  deployedAt: string;
  deployer: Address;
  finalOwner: Address;
  config: {
    passportName: string;
    passportSymbol: string;
    subjectAccountRegistry: Address | null;
    subjectAccountImplementation: Address | null;
  };
  contracts: {
    assetPassport: Address;
    passportAuthority: Address;
    chronicleStamp: Address;
    passportFactory: Address;
  };
};

// 从 Hardhat artifact 中读取的最小必要字段。
type PassportArtifactFile = {
  abi: AbiItem[];
  contractName: string;
  sourceName: string;
};

// 同步给前后端消费的合约 JSON 结构。
// 和原始 artifact 不同，这里额外携带 address / chainId / deployedAt / network，
// 方便前后端直接根据同步后的文件完成读写调用，而不是再单独查部署记录。
type SyncedPassportContractFile = {
  abi: AbiItem[];
  address: Address;
  chainId: number;
  contractName: string;
  deployedAt: string;
  network: string;
  sourceName: string;
};

// 这里声明 passport 套件中需要同步的全部合约 artifact。
// 部署完成后会逐个读取 ABI，并把最新地址写回前端和后端目录。
const PASSPORT_CONTRACT_ARTIFACTS = [
  {
    artifactPath: "../artifacts/contracts/passport/AssetPassport.sol/AssetPassport.json",
    contractKey: "assetPassport" as const,
    name: "AssetPassport",
  },
  {
    artifactPath: "../artifacts/contracts/passport/ChronicleStamp.sol/ChronicleStamp.json",
    contractKey: "chronicleStamp" as const,
    name: "ChronicleStamp",
  },
  {
    artifactPath: "../artifacts/contracts/passport/PassportAuthority.sol/PassportAuthority.json",
    contractKey: "passportAuthority" as const,
    name: "PassportAuthority",
  },
  {
    artifactPath: "../artifacts/contracts/passport/PassportFactory.sol/PassportFactory.json",
    contractKey: "passportFactory" as const,
    name: "PassportFactory",
  },
] as const;

// 前端、后端消费 passport 合约配置的位置。
// 当前脚本部署完成后，会把最新 ABI 和地址直接覆盖到这里，
// 这样前后端不需要手工复制地址。
const FRONTEND_PASSPORT_CONTRACTS_DIR = path.join(
  __dirname,
  "../../frontend/src/contracts/passport",
);
const BACKEND_PASSPORT_CONTRACTS_DIR = path.join(__dirname, "../../backend/contracts/passport");
const FRONTEND_PASSPORT_DEPLOYMENT_FILE = path.join(
  FRONTEND_PASSPORT_CONTRACTS_DIR,
  "deployment.json",
);
const BACKEND_PASSPORT_DEPLOYMENT_FILE = path.join(
  BACKEND_PASSPORT_CONTRACTS_DIR,
  "deployment.json",
);

// 严格校验地址格式，避免把空字符串、短地址或其他无效值写进部署清单。
function requireAddress(value: string, label: string): Address {
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    throw new Error(`Invalid ${label}: ${value}`);
  }

  return value as Address;
}

// 从环境变量读取可选地址。
// 如果为空则返回 undefined，表示这项配置未启用。
function optionalAddress(value: string | undefined): Address | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }

  return requireAddress(value, "address");
}

// 读取某个 passport 合约的 Hardhat artifact。
// 如果 artifact 不存在，说明通常还没 compile，或者路径配置不对。
function readPassportArtifact(relativeArtifactPath: string): PassportArtifactFile {
  const artifactPath = path.join(__dirname, relativeArtifactPath);

  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Passport artifact not found: ${artifactPath}`);
  }

  return JSON.parse(fs.readFileSync(artifactPath, "utf8")) as PassportArtifactFile;
}

// 统一 JSON 写文件逻辑，确保目标目录存在。
function writeJsonFile(targetPath: string, payload: unknown) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, JSON.stringify(payload, null, 2));
}

// 把本次部署产物同步到前端和后端。
// 这是这个脚本最关键的附加价值之一：
// 不只是把合约部署到链上，还会把“链上结果”同步进应用代码。
function syncPassportArtifacts(deployment: PassportDeployment) {
  console.log(
    `Syncing passport ABI files to frontend and backend for network ${deployment.network}...`,
  );

  // 对 passport 套件中的每一个合约：
  // 1. 读取编译产物里的 ABI
  // 2. 组合当前部署出来的最新地址与网络信息
  // 3. 写入 frontend / backend 对应 JSON 文件
  for (const contractArtifact of PASSPORT_CONTRACT_ARTIFACTS) {
    const artifact = readPassportArtifact(contractArtifact.artifactPath);
    const syncedFile: SyncedPassportContractFile = {
      abi: artifact.abi,
      address: deployment.contracts[contractArtifact.contractKey],
      chainId: deployment.chainId,
      contractName: artifact.contractName,
      deployedAt: deployment.deployedAt,
      network: deployment.network,
      sourceName: artifact.sourceName,
    };

    const frontendOutput = path.join(
      FRONTEND_PASSPORT_CONTRACTS_DIR,
      `${contractArtifact.name}.json`,
    );
    const backendOutput = path.join(
      BACKEND_PASSPORT_CONTRACTS_DIR,
      `${contractArtifact.name}.json`,
    );

    writeJsonFile(frontendOutput, syncedFile);
    writeJsonFile(backendOutput, syncedFile);

    console.log(
      `Synced ${contractArtifact.name} ABI -> frontend + backend (${deployment.network})`,
    );
  }

  // 再额外同步一份 deployment.json，供前后端做整体网络识别和默认地址推断。
  writeJsonFile(FRONTEND_PASSPORT_DEPLOYMENT_FILE, deployment);
  writeJsonFile(BACKEND_PASSPORT_DEPLOYMENT_FILE, deployment);

  console.log(
    `Synced deployment manifest for ${deployment.network} -> ${FRONTEND_PASSPORT_DEPLOYMENT_FILE}`,
  );
  console.log(
    `Synced deployment manifest for ${deployment.network} -> ${BACKEND_PASSPORT_DEPLOYMENT_FILE}`,
  );
}

async function main() {
  // 连接到 Hardhat 当前选中的网络。
  // 如果命令没有显式传 --network，则这里通常拿到的是 Hardhat 默认网络 `default`，
  // 而不是你配置文件里的 `localhost`。
  const connection = await network.connect();
  const { viem } = connection;
  const activeNetworkName = connection.networkName;

  // 取出部署钱包和公共客户端。
  // wallet client 用来发交易，public client 用来查链和等待回执。
  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  const activeChainId = await publicClient.getChainId();

  if (!deployer) {
    throw new Error("No deployer account found");
  }

  // 部署者地址。
  const deployerAddress = deployer.account.address;

  // 支持通过环境变量指定最终 owner。
  // 如果没传，则默认部署者本人就是最终 owner。
  const finalOwner = optionalAddress(process.env.PASSPORT_FINAL_OWNER) ?? deployerAddress;

  // 通行证 NFT 的基础 metadata 配置。
  const passportName = process.env.PASSPORT_NAME || "DeProof Asset Passport";
  const passportSymbol = process.env.PASSPORT_SYMBOL || "DPAP";

  // 可选的 ERC-6551 相关配置。
  // 如果没配置，脚本不会报错，只是跳过对应初始化步骤。
  const subjectAccountRegistry = optionalAddress(process.env.SUBJECT_ACCOUNT_REGISTRY);
  const subjectAccountImplementation = optionalAddress(
    process.env.SUBJECT_ACCOUNT_IMPLEMENTATION,
  );

  // 本地部署记录文件按 networkName 分文件保存。
  // 例如：
  // - localhost.json
  // - sepolia.json
  // - default.json
  const deploymentDir = path.join(__dirname, "../deployments/passport");
  const deploymentFile = path.join(deploymentDir, `${activeNetworkName}.json`);

  // 等待交易打包确认，保证每一步 wiring 都真的上链成功后再继续。
  const waitForTx = async (hash: Hex) => {
    return publicClient.waitForTransactionReceipt({ hash });
  };

  // 这里显式打印 network + chainId，方便你第一眼确认“脚本到底部署到了哪里”。
  console.log(`Starting passport suite deployment on network: ${activeNetworkName}`);
  console.log(`Active chainId: ${activeChainId}`);
  console.log(`Deployer: ${deployerAddress}`);
  console.log(`Final owner: ${finalOwner}`);

  // 部署前先打印余额，余额不足时可以更快发现问题。
  const balance = await publicClient.getBalance({ address: deployerAddress });
  console.log(`Deployer balance: ${balance.toString()}`);

  // 1. 部署权限中心。
  // PassportAuthority 负责决定谁可以创建护照、签发印章、撤销印章等。
  console.log(`Deploying PassportAuthority on ${activeNetworkName}...`);
  const passportAuthority = await viem.deployContract("PassportAuthority", [deployerAddress]);
  console.log(`PassportAuthority: ${passportAuthority.address}`);

  // 2. 部署护照 NFT 主合约。
  // AssetPassport 负责护照本体的铸造和状态。
  console.log(`Deploying AssetPassport on ${activeNetworkName}...`);
  const assetPassport = await viem.deployContract("AssetPassport", [
    deployerAddress,
    passportName,
    passportSymbol,
  ]);
  console.log(`AssetPassport: ${assetPassport.address}`);

  // 3. 部署印章记录合约。
  // ChronicleStamp 负责给护照追加履历/印章记录。
  console.log(`Deploying ChronicleStamp on ${activeNetworkName}...`);
  const chronicleStamp = await viem.deployContract("ChronicleStamp", [deployerAddress]);
  console.log(`ChronicleStamp: ${chronicleStamp.address}`);

  // 4. 部署工厂合约。
  // PassportFactory 负责创建新的 passport，并在需要时创建 subject account。
  console.log(`Deploying PassportFactory on ${activeNetworkName}...`);
  const passportFactory = await viem.deployContract("PassportFactory", [deployerAddress]);
  console.log(`PassportFactory: ${passportFactory.address}`);

  // 部署完只是“单个合约已经存在”，还不是完整系统。
  // 接下来要把合约之间的引用全部互相注入，形成可工作的 passport 套件。
  console.log(`Wiring contract references on ${activeNetworkName}...`);

  // 让 AssetPassport 知道：
  // 1. 权限中心是谁
  // 2. 印章合约是谁
  // 3. 哪个工厂有权创建 passport
  await waitForTx(await assetPassport.write.setAuthority([passportAuthority.address]));
  await waitForTx(await assetPassport.write.setChronicle([chronicleStamp.address]));
  await waitForTx(await assetPassport.write.setFactory([passportFactory.address, true]));

  // 让 PassportAuthority 知道它所管理的核心业务合约。
  await waitForTx(await passportAuthority.write.setAssetPassport([assetPassport.address]));
  await waitForTx(await passportAuthority.write.setChronicle([chronicleStamp.address]));

  // 让 ChronicleStamp 回指到护照主合约和权限中心。
  await waitForTx(await chronicleStamp.write.setAssetPassport([assetPassport.address]));
  await waitForTx(await chronicleStamp.write.setAuthority([passportAuthority.address]));

  // 让工厂合约持有整套系统的核心引用。
  await waitForTx(await passportFactory.write.setAssetPassport([assetPassport.address]));
  await waitForTx(await passportFactory.write.setAuthority([passportAuthority.address]));
  await waitForTx(await passportFactory.write.setChronicle([chronicleStamp.address]));

  // 如果接入了 ERC-6551 registry，则把它注入工厂。
  if (subjectAccountRegistry !== undefined) {
    await waitForTx(
      await passportFactory.write.setSubjectAccountRegistry([subjectAccountRegistry]),
    );
  }

  // 如果接入了 ERC-6551 implementation，则把它注入工厂。
  if (subjectAccountImplementation !== undefined) {
    await waitForTx(
      await passportFactory.write.setSubjectAccountImplementation([
        subjectAccountImplementation,
      ]),
    );
  }

  // 如果最终 owner 不是部署者，则在最后统一转移所有权。
  // 这样部署过程仍然由部署钱包完成，但系统最终控制权交给目标账户。
  if (finalOwner !== deployerAddress) {
    console.log(`Transferring contract ownership to final owner on ${activeNetworkName}...`);
    await waitForTx(await assetPassport.write.transferOwnership([finalOwner]));
    await waitForTx(await passportAuthority.write.transferOwnership([finalOwner]));
    await waitForTx(await chronicleStamp.write.transferOwnership([finalOwner]));
    await waitForTx(await passportFactory.write.transferOwnership([finalOwner]));
  }

  // 组装最终部署清单。
  // 注意这里记录的是“本次实际连接到的网络”和“本次实际链 ID”，
  // 所以如果你忘记传 --network，这里也会忠实记录为 default。
  const deployment: PassportDeployment = {
    network: activeNetworkName,
    chainId: activeChainId,
    deployedAt: new Date().toISOString(),
    deployer: deployerAddress,
    finalOwner,
    config: {
      passportName,
      passportSymbol,
      subjectAccountRegistry: subjectAccountRegistry ?? null,
      subjectAccountImplementation: subjectAccountImplementation ?? null,
    },
    contracts: {
      assetPassport: assetPassport.address,
      passportAuthority: passportAuthority.address,
      chronicleStamp: chronicleStamp.address,
      passportFactory: passportFactory.address,
    },
  };

  // 先写 blockchain 目录下的原始部署清单，再同步到前后端目录。
  fs.mkdirSync(deploymentDir, { recursive: true });
  fs.writeFileSync(deploymentFile, JSON.stringify(deployment, null, 2));
  syncPassportArtifacts(deployment);

  console.log(`Passport deployment manifest written to ${deploymentFile}`);
  console.log(`Deployment completed on ${activeNetworkName} (chainId: ${activeChainId}).`);
}

// 以标准脚本入口方式运行，失败时把错误打印出来并返回非 0 退出码。
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
