// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../interfaces/IMonetizationModule.sol";

contract PayPerViewModule is IMonetizationModule {
    mapping(uint256 => uint256) public prices;
    mapping(uint256 => address) public creators;
    mapping(uint256 => mapping(address => bool)) public accessGranted;

    function initialize(uint256 contentId, address creator, bytes calldata initData) external override {
        uint256 price = abi.decode(initData, (uint256));
        creators[contentId] = creator;
        prices[contentId] = price;
    }

    function execute(uint256 contentId, bytes calldata) external payable override {
        require(msg.value >= prices[contentId], "Insufficient payment");
        accessGranted[contentId][msg.sender] = true;
        payable(creators[contentId]).transfer(msg.value);
    }

    function canAccess(uint256 contentId, address user) external view override returns (bool) {
        return accessGranted[contentId][user];
    }
}

