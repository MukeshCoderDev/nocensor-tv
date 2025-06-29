// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMonetizationModule {
    function canAccess(uint256 contentId, address user) external view returns (bool);
    function execute(uint256 contentId, bytes calldata data) external payable;
    function initialize(uint256 contentId, address creator, bytes calldata initializationData) external;
}

