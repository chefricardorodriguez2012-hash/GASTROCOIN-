const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("GastroCoinVesting", function () {
    async function setup() {
        const [owner, beneficiary, outsider] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("GastroCoin");
        const token = await Token.deploy(owner.address);
        await token.waitForDeployment();

        const allocation = ethers.parseUnits("1000", 18);

        const Vesting = await ethers.getContractFactory("GastroCoinVesting");
        const vesting = await Vesting.deploy(
            await token.getAddress(),
            beneficiary.address,
            allocation
        );
        await vesting.waitForDeployment();

        await token.transfer(await vesting.getAddress(), allocation);

        return { token, vesting, owner, beneficiary, outsider, allocation };
    }

    it("bloquea los tokens durante los primeros 12 meses", async function () {
        const { vesting, allocation } = await setup();

        expect(await vesting.vestedAmount(await time.latest()))
            .to.equal(0n);

        expect(await vesting.releasable()).to.equal(0n);

        await expect(vesting.release())
            .to.be.revertedWith("No tokens available");
    });

    it("libera gradualmente después del bloqueo", async function () {
        const { vesting, beneficiary, allocation } = await setup();

        const cliff = await vesting.cliffEnd();
        const duration = await vesting.VESTING_DURATION();

        await time.increaseTo(cliff + duration / 2n);

        expect(await vesting.vestedAmount(await time.latest()))
            .to.be.closeTo(allocation / 2n, ethers.parseUnits("0.00002", 18));

        await vesting.release();

        expect(await vesting.released())
            .to.be.closeTo(allocation / 2n, ethers.parseUnits("0.00002", 18));

        expect(await vesting.token().then(async address => {
            const token = await ethers.getContractAt("GastroCoin", address);
            return token.balanceOf(beneficiary.address);
        })).to.be.closeTo(allocation / 2n, ethers.parseUnits("0.00002", 18));
    });

    it("libera el 100% al finalizar los 36 meses", async function () {
        const { vesting, beneficiary, allocation } = await setup();

        await time.increaseTo(await vesting.vestingEnd());

        await vesting.connect(beneficiary).release();

        const token = await ethers.getContractAt(
            "GastroCoin",
            await vesting.token()
        );

        expect(await token.balanceOf(beneficiary.address))
            .to.equal(allocation);

        expect(await vesting.released()).to.equal(allocation);
    });

    it("envía los tokens al beneficiario aunque otro ejecute release", async function () {
        const { vesting, outsider, beneficiary, allocation } = await setup();

        await time.increaseTo(await vesting.cliffEnd() + 86400n);

        await vesting.connect(outsider).release();

        const token = await ethers.getContractAt(
            "GastroCoin",
            await vesting.token()
        );

        expect(await token.balanceOf(beneficiary.address))
            .to.be.greaterThan(0n);

        expect(await vesting.released())
            .to.be.greaterThan(0n);
    });
});
