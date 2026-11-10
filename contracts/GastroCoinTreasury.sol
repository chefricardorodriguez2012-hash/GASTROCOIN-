// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract GastroCoinTreasury is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;

    event TreasuryWithdrawal(
        address indexed recipient,
        uint256 amount,
        address indexed administrator
    );

    constructor(
        address tokenAddress,
        address initialAdministrator
    ) Ownable(initialAdministrator) {
        require(tokenAddress != address(0), "Invalid token");
        token = IERC20(tokenAddress);
    }

    function withdraw(
        address recipient,
        uint256 amount
    ) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Invalid amount");

        token.safeTransfer(recipient, amount);

        emit TreasuryWithdrawal(
            recipient,
            amount,
            msg.sender
        );
    }

    function treasuryBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
