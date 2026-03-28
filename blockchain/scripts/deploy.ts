import { network } from "hardhat";

async function main() {
  const connection = await network.connect();
  const { viem } = connection;

  console.log(`Starting deployment of ProofStore to ${connection.networkName}...`);

  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  if (!deployer) {
    throw new Error("No deployer account found");
  }

  console.log(`Deploying with the account: ${deployer.account.address}`);
  
  const balance = await publicClient.getBalance({ address: deployer.account.address });
  console.log(`Account balance: ${balance.toString()}`);

  const proofStore = await viem.deployContract("ProofStore", []);

  console.log(`ProofStore deployed to: ${proofStore.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
