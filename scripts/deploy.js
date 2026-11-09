const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const recipient = process.env.GASTROCOIN_RECIPIENT;

  if (!recipient || !hre.ethers.isAddress(recipient)) {
    throw new Error("Direccion receptora invalida");
  }

  const network = await hre.ethers.provider.getNetwork();

  if (network.chainId !== 80002n) {
    throw new Error("Red incorrecta: se requiere Polygon Amoy Testnet");
  }

  const [deployer] = await hre.ethers.getSigners();

  if (!deployer) {
    throw new Error("Falta configurar la billetera desplegadora");
  }

  console.log("Desplegador:", deployer.address);
  console.log("Receptor:", recipient);
  console.log("Red:", network.name);

  const GastroCoin = await hre.ethers.getContractFactory("GastroCoin");

  const token = await GastroCoin.deploy(recipient);

  await token.waitForDeployment();

  console.log("Contrato:", await token.getAddress());
  console.log("Receptor inicial:", recipient);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
