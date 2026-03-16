import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ProofStoreModule", (m) => {
  // Deploy the ProofStore contract
  const proofStore = m.contract("ProofStore", []);

  return { proofStore };
});
