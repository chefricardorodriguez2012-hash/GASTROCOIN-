// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract GastroCoinVesting {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    address public immutable beneficiary;

    uint256 public immutable start;
    uint256 public immutable cliffEnd;
    uint256 public immutable vestingEnd;
    uint256 public immutable totalAllocation;

    uint256 public released;

    uint256 public constant CLIFF = 365 days;
    uint256 public constant VESTING_DURATION = 3 * 365 days;

    constructor(
        address tokenAddress,
        address beneficiaryAddress,
        uint256 allocation
    ) {
        require(tokenAddress != address(0), "Invalid token");
        require(beneficiaryAddress != address(0), "Invalid beneficiary");
        require(allocation > 0, "Invalid allocation");

        token = IERC20(tokenAddress);
        beneficiary = beneficiaryAddress;
        totalAllocation = allocation;

        start = block.timestamp;
        cliffEnd = start + CLIFF;
        vestingEnd = cliffEnd + VESTING_DURATION;
    }

    function vestedAmount(uint256 timestamp) public view returns (uint256) {
        if (timestamp < cliffEnd) return 0;
        if (timestamp >= vestingEnd) return totalAllocation;

        return totalAllocation * (timestamp - cliffEnd) / VESTING_DURATION;
    }

    function releasable() public view returns (uint256) {
        return vestedAmount(block.timestamp) - released;
    }

    function release() external {
        uint256 amount = releasable();
        require(amount > 0, "No tokens available");

        released += amount;
        token.safeTransfer(beneficiary, amount);
    }
}
