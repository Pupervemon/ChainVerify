import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { network } from "hardhat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Address = `0x${string}`;
type Hex = `0x${string}`;

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

async function main() {
  const connection = await network.connect();
  const { viem } = connection;

  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  if (!deployer) {
    throw new Error("No deployer account found");
  }

  const deployerAddress = deployer.account.address;
  const finalOwner = optionalAddress(process.env.PASSPORT_FINAL_OWNER) ?? deployerAddress;
  const passportName = process.env.PASSPORT_NAME || "DeProof Asset Passport";
  const passportSymbol = process.env.PASSPORT_SYMBOL || "DPAP";
  const subjectAccountRegistry = optionalAddress(process.env.SUBJECT_ACCOUNT_REGISTRY);
  const subjectAccountImplementation = optionalAddress(
    process.env.SUBJECT_ACCOUNT_IMPLEMENTATION,
  );

  const deploymentDir = path.join(__dirname, "../deployments/passport");
  const deploymentFile = path.join(deploymentDir, `${connection.networkName}.json`);

  const waitForTx = async (hash: Hex) => {
    return publicClient.waitForTransactionReceipt({ hash });
  };

  console.log(`Starting passport suite deployment to ${connection.networkName}...`);
  console.log(`Deployer: ${deployerAddress}`);
  console.log(`Final owner: ${finalOwner}`);

  const balance = await publicClient.getBalance({ address: deployerAddress });
  console.log(`Deployer balance: ${balance.toString()}`);

  console.log("Deploying PassportAuthority...");
  const passportAuthority = await viem.deployContract("PassportAuthority", [deployerAddress]);
  console.log(`PassportAuthority: ${passportAuthority.address}`);

  console.log("Deploying AssetPassport...");
  const assetPassport = await viem.deployContract("AssetPassport", [
    deployerAddress,
    passportName,
    passportSymbol,
  ]);
  console.log(`AssetPassport: ${assetPassport.address}`);

  console.log("Deploying ChronicleStamp...");
  const chronicleStamp = await viem.deployContract("ChronicleStamp", [deployerAddress]);
  console.log(`ChronicleStamp: ${chronicleStamp.address}`);

  console.log("Deploying PassportFactory...");
  const passportFactory = await viem.deployContract("PassportFactory", [deployerAddress]);
  console.log(`PassportFactory: ${passportFactory.address}`);

  console.log("Wiring contract references...");

  await waitForTx(await assetPassport.write.setAuthority([passportAuthority.address]));
  await waitForTx(await assetPassport.write.setChronicle([chronicleStamp.address]));
  await waitForTx(await assetPassport.write.setFactory([passportFactory.address, true]));

  await waitForTx(await passportAuthority.write.setAssetPassport([assetPassport.address]));
  await waitForTx(await passportAuthority.write.setChronicle([chronicleStamp.address]));

  await waitForTx(await chronicleStamp.write.setAssetPassport([assetPassport.address]));
  await waitForTx(await chronicleStamp.write.setAuthority([passportAuthority.address]));

  await waitForTx(await passportFactory.write.setAssetPassport([assetPassport.address]));
  await waitForTx(await passportFactory.write.setAuthority([passportAuthority.address]));
  await waitForTx(await passportFactory.write.setChronicle([chronicleStamp.address]));

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

  if (finalOwner !== deployerAddress) {
    console.log("Transferring contract ownership to final owner...");
    await waitForTx(await assetPassport.write.transferOwnership([finalOwner]));
    await waitForTx(await passportAuthority.write.transferOwnership([finalOwner]));
    await waitForTx(await chronicleStamp.write.transferOwnership([finalOwner]));
    await waitForTx(await passportFactory.write.transferOwnership([finalOwner]));
  }

  const deployment = {
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

  console.log(`Passport deployment manifest written to ${deploymentFile}`);
  console.log("Deployment completed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
