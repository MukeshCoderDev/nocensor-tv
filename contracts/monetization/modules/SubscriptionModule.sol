// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../interfaces/IMonetizationModule.sol";

contract SubscriptionModule is IMonetizationModule {
    struct Subscription {
        uint256 expiry;
        uint256 price;
    }

    mapping(uint256 => address) public contentCreators;
    mapping(uint256 => uint256) public subscriptionPrices;
    mapping(uint256 => mapping(address => uint256)) public subscriptions;

    function initialize(uint256 contentId, address creator, bytes calldata initData) external override {
        uint256 price = abi.decode(initData, (uint256));
        contentCreators[contentId] = creator;
        subscriptionPrices[contentId] = price;
    }

    function execute(uint256 contentId, bytes calldata) external payable override {
        require(msg.value >= subscriptionPrices[contentId], "Insufficient payment");

        uint256 duration = 30 days;
        uint256 currentExpiry = subscriptions[contentId][msg.sender];
        uint256 newExpiry = block.timestamp + duration;

        if (currentExpiry > block.timestamp) {
            newExpiry = currentExpiry + duration;
        }

        subscriptions[contentId][msg.sender] = newExpiry;
        payable(contentCreators[contentId]).transfer(msg.value);
    }

    function canAccess(uint256 contentId, address user) external view override returns (bool) {
        return subscriptions[contentId][user] > block.timestamp;
    }
}

