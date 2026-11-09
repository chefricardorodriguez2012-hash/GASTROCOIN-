const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GastroCoin", function () {
  async function deployToken() {
    const [owner, recipient] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("GastroCoin");
    const token = await Token.deploy(owner.address);
    await token.waitForDeployment();
    return { token, owner, recipient };
  }

  it("has the expected name, symbol and decimals", async function () {
    const { token } = await deployToken();
    expect(await token.name()).to.equal("GASTROCOIN");
    expect(await token.symbol()).to.equal("GASTRO");
    expect(await token.decimals()).to.equal(18);
  });

  it("creates exactly one billion tokens for the initial holder", async function () {
    const { token, owner } = await deployToken();
    const expected = ethers.parseUnits("1000000000", 18);
    expect(await token.totalSupply()).to.equal(expected);
    expect(await token.balanceOf(owner.address)).to.equal(expected);
  });

  it("allows ordinary transfers", async function () {
    const { token, owner, recipient } = await deployToken();
    const amount = ethers.parseUnits("25", 18);
    await token.transfer(recipient.address, amount);
    expect(await token.balanceOf(recipient.address)).to.equal(amount);
  });

  it("rejects a zero initial holder", async function () {
    const Token = await ethers.getContractFactory("GastroCoin");
    await expect(Token.deploy(ethers.ZeroAddress)).to.be.revertedWith("Invalid initial holder");
  });
});
