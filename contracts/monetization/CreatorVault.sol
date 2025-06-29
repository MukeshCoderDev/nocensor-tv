// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../token/LibertyToken.sol";
import "../interfaces/IVault.sol";

contract CreatorVault is ReentrancyGuard, IVault {
    address public immutable creator;
    LibertyToken public libertyToken;

    uint256 public totalEarnings;
    uint256 public collateral;

    event Deposited(uint256 amount);
    event Withdrawn(uint256 amount);
    event CollateralAdded(uint256 amount);
    event CollateralReleased(uint256 amount);

    constructor(address _creator, address _libertyToken) {
        creator = _creator;
        libertyToken = LibertyToken(_libertyToken);
    }

    function deposit(uint256 amount) external override {
        libertyToken.transferFrom(msg.sender, address(this), amount);
        totalEarnings += amount;
        emit Deposited(amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(msg.sender == creator, "Only creator");
        require(libertyToken.balanceOf(address(this)) - collateral >= amount, "Insufficient balance");
        libertyToken.transfer(creator, amount);
        emit Withdrawn(amount);
    }

    function addCollateral(uint256 amount) external {
        require(msg.sender == creator, "Only creator");
        libertyToken.transferFrom(creator, address(this), amount);
        collateral += amount;
        emit CollateralAdded(amount);
    }

    function releaseCollateral(uint256 amount) external nonReentrant {
        require(msg.sender == creator, "Only creator");
        require(collateral >= amount, "Insufficient collateral");
        collateral -= amount;
        libertyToken.transfer(creator, amount);
        emit CollateralReleased(amount);
    }
}

