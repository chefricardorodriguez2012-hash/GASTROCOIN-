// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title GastroCoin
 * @notice Testnet prototype. Fixed supply, no mint function, no transfer tax.
 * @dev Deploy ONLY to Polygon Amoy while testing. Not audited or production-ready.
 */
contract GastroCoin is ERC20 {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;

    constructor(address initialHolder) ERC20("GASTROCOIN", "GASTRO") {
        require(initialHolder != address(0), "Invalid initial holder");
        _mint(initialHolder, MAX_SUPPLY);
    }
}
