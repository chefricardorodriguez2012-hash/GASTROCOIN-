const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GastroCoinTreasury", function () {
    async function setup() {
        const [admin, recipient, outsider] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("GastroCoin");
        const token = await Token.deploy(admin.address);
        await token.waitForDeployment();

        const Treasury = await ethers.getContractFactory("GastroCoinTreasury");
        const treasury = await Treasury.deploy(
            await token.getAddress(),
            admin.address
        );
        await treasury.waitForDeployment();

        const allocation = ethers.parseUnits("100", 18);

        await token.transfer(await treasury.getAddress(), allocation);

        return { token, treasury, admin, recipient, outsider, allocation };
    }

    it("permite retirar al administrador autorizado", async function () {
        const { token, treasury, recipient } = await setup();

        const amount = ethers.parseUnits("25", 18);

        await treasury.withdraw(recipient.address, amount);

        expect(await token.balanceOf(recipient.address)).to.equal(amount);
        expect(await treasury.treasuryBalance())
            .to.equal(ethers.parseUnits("75", 18));
    });

    it("rechaza retiros de otras billeteras", async function () {
        const { treasury, outsider } = await setup();

        await expect(
            treasury.connect(outsider).withdraw(
                outsider.address,
                1
            )
        ).to.be.revertedWithCustomError(
            treasury,
            "OwnableUnauthorizedAccount"
        ).withArgs(outsider.address);
    });

    it("rechaza direcciones receptoras inválidas", async function () {
        const { treasury } = await setup();

        await expect(
            treasury.withdraw(ethers.ZeroAddress, 1)
        ).to.be.revertedWith("Invalid recipient");
    });

    it("rechaza retiros de cantidad cero", async function () {
        const { treasury, recipient } = await setup();

        await expect(
            treasury.withdraw(recipient.address, 0)
        ).to.be.revertedWith("Invalid amount");
    });
});
