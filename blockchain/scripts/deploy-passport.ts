import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { network } from "hardhat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Address = `0x${string}`;
type Hex = `0x${string}`;
type AbiItem = Record<string, unknown>;

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

type PassportArtifactFile = {
  abi: AbiItem[];
  contractName: string;
  sourceName: string;
};

type SyncedPassportContractFile = {
  abi: AbiItem[];
  address: Address;
  chainId: number;
  contractName: string;
  deployedAt: string;
  network: string;
  sourceName: string;
};

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

function requireAddress(value: string, label: string): Address {
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    throw new Error(`Invalid ${label}: ${value}`);
  }

  return value as Address;
}

function optionalAddress(value: string | undefined): Address | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }

  return requireAddress(value, "address");
}

function readPassportArtifact(relativeArtifactPath: string): PassportArtifactFile {
  const artifactPath = path.join(__dirname, relativeArtifactPath);

  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Passport artifact not found: ${artifactPath}`);
  }

  return JSON.parse(fs.readFileSync(artifactPath, "utf8")) as PassportArtifactFile;
}

function writeJsonFile(targetPath: string, payload: unknown) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, JSON.stringify(payload, null, 2));
}

function syncPassportArtifacts(deployment: PassportDeployment) {
  console.log("Syncing passport ABI files to frontend and backend...");

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

    console.log(`Synced ${contractArtifact.name} ABI -> frontend + backend`);
  }

  writeJsonFile(FRONTEND_PASSPORT_DEPLOYMENT_FILE, deployment);
  writeJsonFile(BACKEND_PASSPORT_DEPLOYMENT_FILE, deployment);

  console.log(`Synced deployment manifest -> ${FRONTEND_PASSPORT_DEPLOYMENT_FILE}`);
  console.log(`Synced deployment manifest -> ${BACKEND_PASSPORT_DEPLOYMENT_FILE}`);
}

async function main() {
  // 获取网络连接信息
  const connection = await network.connect();
  const { viem } = connection;

  // 获取部署账户和公共客户端
  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  if (!deployer) {
    throw new Error("No deployer account found");
  }

  const deployerAddress = deployer.account.address;
  // 从环境变量读取配置，或使用默认值
  const finalOwner = optionalAddress(process.env.PASSPORT_FINAL_OWNER) ?? deployerAddress;
  const passportName = process.env.PASSPORT_NAME || "DeProof Asset Passport";
  const passportSymbol = process.env.PASSPORT_SYMBOL || "DPAP";
  const subjectAccountRegistry = optionalAddress(process.env.SUBJECT_ACCOUNT_REGISTRY);
  const subjectAccountImplementation = optionalAddress(
    process.env.SUBJECT_ACCOUNT_IMPLEMENTATION,
  );

  // 设置部署清单文件保存路径
  const deploymentDir = path.join(__dirname, "../deployments/passport");
  const deploymentFile = path.join(deploymentDir, `${connection.networkName}.json`);

  // 辅助函数：等待交易回执
  const waitForTx = async (hash: Hex) => {
    return publicClient.waitForTransactionReceipt({ hash });
  };

  console.log(`Starting passport suite deployment to ${connection.networkName}...`);
  console.log(`Deployer: ${deployerAddress}`);
  console.log(`Final owner: ${finalOwner}`);

  const balance = await publicClient.getBalance({ address: deployerAddress });
  console.log(`Deployer balance: ${balance.toString()}`);

  // 1. 部署权限管理合约 (PassportAuthority)
  console.log("Deploying PassportAuthority...");
  const passportAuthority = await viem.deployContract("PassportAuthority", [deployerAddress]);
  console.log(`PassportAuthority: ${passportAuthority.address}`);

  // 2. 部署核心资产通行证合约 (AssetPassport)
  console.log("Deploying AssetPassport...");
  const assetPassport = await viem.deployContract("AssetPassport", [
    deployerAddress,
    passportName,
    passportSymbol,
  ]);
  console.log(`AssetPassport: ${assetPassport.address}`);

  // 3. 部署存证/印章合约 (ChronicleStamp)
  console.log("Deploying ChronicleStamp...");
  const chronicleStamp = await viem.deployContract("ChronicleStamp", [deployerAddress]);
  console.log(`ChronicleStamp: ${chronicleStamp.address}`);

  // 4. 部署通行证工厂合约 (PassportFactory)
  console.log("Deploying PassportFactory...");
  const passportFactory = await viem.deployContract("PassportFactory", [deployerAddress]);
  console.log(`PassportFactory: ${passportFactory.address}`);

  console.log("Wiring contract references...");

  // 配置合约间的相互引用关系，构建完整的系统生态
  // 为 AssetPassport 设置权限中心、存证中心和工厂
  await waitForTx(await assetPassport.write.setAuthority([passportAuthority.address]));
  await waitForTx(await assetPassport.write.setChronicle([chronicleStamp.address]));
  await waitForTx(await assetPassport.write.setFactory([passportFactory.address, true]));

  // 为 PassportAuthority 设置核心合约引用
  await waitForTx(await passportAuthority.write.setAssetPassport([assetPassport.address]));
  await waitForTx(await passportAuthority.write.setChronicle([chronicleStamp.address]));

  // 为 ChronicleStamp 设置核心合约引用
  await waitForTx(await chronicleStamp.write.setAssetPassport([assetPassport.address]));
  await waitForTx(await chronicleStamp.write.setAuthority([passportAuthority.address]));

  // 为 PassportFactory 设置核心合约引用
  await waitForTx(await passportFactory.write.setAssetPassport([assetPassport.address]));
  await waitForTx(await passportFactory.write.setAuthority([passportAuthority.address]));
  await waitForTx(await passportFactory.write.setChronicle([chronicleStamp.address]));

  // 如果配置了 ERC6551 相关注册表和实现，则进行初始化
  if (subjectAccountRegistry !== undefined) {
    await waitForTx(
      await passportFactory.write.setSubjectAccountRegistry([subjectAccountRegistry]),
    );
  }

  if (subjectAccountImplementation !== undefined) {
    await waitForTx(
      await passportFactory.write.setSubjectAccountImplementation([
        subjectAccountImplementation,
      ]),
    );
  }

  // 如果最终所有者不是部署者，则将所有权转交给最终所有者
  if (finalOwner !== deployerAddress) {
    console.log("Transferring contract ownership to final owner...");
    await waitForTx(await assetPassport.write.transferOwnership([finalOwner]));
    await waitForTx(await passportAuthority.write.transferOwnership([finalOwner]));
    await waitForTx(await chronicleStamp.write.transferOwnership([finalOwner]));
    await waitForTx(await passportFactory.write.transferOwnership([finalOwner]));
  }

  // 构建并保存部署结果清单
  const deployment: PassportDeployment = {
    network: connection.networkName,
    chainId: await publicClient.getChainId(),
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

  fs.mkdirSync(deploymentDir, { recursive: true });
  fs.writeFileSync(deploymentFile, JSON.stringify(deployment, null, 2));
  syncPassportArtifacts(deployment);

  console.log(`Passport deployment manifest written to ${deploymentFile}`);
  console.log("Deployment completed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
