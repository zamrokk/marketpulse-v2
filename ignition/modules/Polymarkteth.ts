// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PolymarktethModule = buildModule("PolymarktethModule", (m) => {
  const PolymarktethContract = m.contract("Polymarkteth", []);

  m.call(PolymarktethContract, "ping", []);

  return { PolymarktethContract };
});

export default PolymarktethModule;
