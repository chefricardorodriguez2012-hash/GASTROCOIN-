require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const amoyRpcUrl =
  process.env.AMOY_RPC_URL || process.env.POLYGON_RPC_URL;

const accounts =
  privateKey && /^0x[0-9a-fA-F]{64}$/.test(privateKey)
    ? [privateKey]
    : [];

module.exports = {
  solidity: "0.8.24",
  networks: {
    polygon: {
      url: amoyRpcUrl || "https://rpc-amoy.polygon.technology/",
      chainId: 80002,
      accounts
    }
  }
};
