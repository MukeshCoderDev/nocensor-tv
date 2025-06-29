// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../interfaces/IMonetizationModule.sol";

contract SessionModule is IMonetizationModule {
    struct Session {
        uint256 startTime;
        uint256 accumulatedCost;
    }

    struct Config {
        uint256 pricePerSecond;
        address paymentToken;
    }

    mapping(uint256 => Config) public configs;
    mapping(uint256 => mapping(address => Session)) public activeSessions;

    function initialize(uint256 contentId, address, bytes calldata initData) external override {
        (uint256 pricePerMinute, address paymentToken) = abi.decode(initData, (uint256, address));
        configs[contentId] = Config(pricePerMinute / 60, paymentToken);
    }

    function startSession(uint256 contentId) external {
        activeSessions[contentId][msg.sender] = Session(block.timestamp, 0);
    }

    function endSession(uint256 contentId) external {
        Session storage session = activeSessions[contentId][msg.sender];
        require(session.startTime > 0, "No active session");

        uint256 duration = block.timestamp - session.startTime;
        uint256 cost = duration * configs[contentId].pricePerSecond;

        session.accumulatedCost += cost;
        delete activeSessions[contentId][msg.sender];
    }

    function execute(uint256, bytes calldata) external payable override {
        // Session-based access doesn't require upfront payment
    }

    function canAccess(uint256 contentId, address user) external view override returns (bool) {
        return activeSessions[contentId][user].startTime > 0;
    }
}

