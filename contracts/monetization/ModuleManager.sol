// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IMonetizationModule.sol";
import "../identity/ContentRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ModuleManager is Ownable, ReentrancyGuard {
    ContentRegistry public contentRegistry;

    mapping(uint256 => address) public contentModules;
    mapping(address => bool) public whitelistedModules;

    event ModuleAttached(uint256 contentId, address module);
    event ModuleWhitelisted(address module, bool status);

    constructor(address _contentRegistry) {
        contentRegistry = ContentRegistry(_contentRegistry);
    }

    function whitelistModule(address module, bool status) external onlyOwner {
        whitelistedModules[module] = status;
        emit ModuleWhitelisted(module, status);
    }

    function attachModule(uint256 contentId, address module, bytes calldata initData) external {
        // Verify content ownership
        require(whitelistedModules[module], "Module not whitelisted");
        contentModules[contentId] = module;
        IMonetizationModule(module).initialize(contentId, msg.sender, initData);
        emit ModuleAttached(contentId, module);
    }

    function execute(uint256 contentId, bytes calldata data) external payable nonReentrant {
        address module = contentModules[contentId];
        require(module != address(0), "No module attached");
        IMonetizationModule(module).execute{value: msg.value}(contentId, data);
    }
}

