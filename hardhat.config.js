require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;

const accounts =
  privateKey && /^0x[0-9a-fA-F]{64}$/.test(privateKey)
    ? [privateKey]
    : [];

module.exports = {
  solidity: "0.8.24",
  networks: {
    polygon: {
      url: process.env.POLYGON_RPC_URL,
      chainId: 80002,
      accounts
    }
  }
};
