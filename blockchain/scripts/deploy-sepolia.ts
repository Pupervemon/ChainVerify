import hre from "hardhat";

async function main() {
  console.log("Starting deployment of ProofStore to Sepolia...");
  
  // Get wallet clients
  const [deployer] = await hre.viem.getWalletClients();
  const publicClient = await hre.viem.getPublicClient();

  if (!deployer) {
    throw new Error("No deployer account found");
  }

  console.log(`Deploying with the account: ${deployer.account.address}`);
  
  const balance = await publicClient.getBalance({ address: deployer.account.address });
  console.log(`Account balance: ${balance.toString()}`);

  // Deploy ProofStore
  const proofStore = await hre.viem.deployContract("ProofStore", []);

  console.log(`ProofStore deployed to: ${proofStore.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
