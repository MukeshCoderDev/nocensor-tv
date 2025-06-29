// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../token/PassionToken.sol";

contract CurationPools is Ownable, ReentrancyGuard {
    PassionToken public passionToken;

    struct Stake {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => mapping(address => Stake)) public stakes;
    mapping(uint256 => uint256) public totalStaked;

    event Staked(uint256 contentId, address staker, uint256 amount);
    event Unstaked(uint256 contentId, address staker, uint256 amount);

    constructor(address _passionToken) {
        passionToken = PassionToken(_passionToken);
    }

    function stake(uint256 contentId, uint256 amount) external nonReentrant {
        passionToken.transferFrom(msg.sender, address(this), amount);
        stakes[contentId][msg.sender].amount += amount;
        stakes[contentId][msg.sender].timestamp = block.timestamp;
        totalStaked[contentId] += amount;
        emit Staked(contentId, msg.sender, amount);
    }

    function unstake(uint256 contentId, uint256 amount) external nonReentrant {
        require(stakes[contentId][msg.sender].amount >= amount, "Insufficient stake");
        stakes[contentId][msg.sender].amount -= amount;
        totalStaked[contentId] -= amount;
        passionToken.transfer(msg.sender, amount);
        emit Unstaked(contentId, msg.sender, amount);
    }

    function calculateRewards(uint256 contentId, address user) public view returns (uint256) {
        Stake memory stakeInfo = stakes[contentId][user];
        uint256 duration = block.timestamp - stakeInfo.timestamp;
        return (stakeInfo.amount * duration) / 1 days;
    }
}

