// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../identity/CreatorRegistry.sol";

contract TipJar {
    CreatorRegistry public creatorRegistry;

    event Tipped(uint256 creatorId, address from, uint256 amount);

    constructor(address _creatorRegistry) {
        creatorRegistry = CreatorRegistry(_creatorRegistry);
    }

    function tip(uint256 creatorId) external payable {
        require(msg.value > 0, "Tip amount required");
        (, address vault) = getCreatorVault(creatorId);
        payable(vault).transfer(msg.value);
        emit Tipped(creatorId, msg.sender, msg.value);
    }

    function getCreatorVault(uint256 creatorId) private view returns (uint256, address) {
        (address vault, , ) = creatorRegistry.creators(creatorId);
        return (creatorId, vault);
    }
}

