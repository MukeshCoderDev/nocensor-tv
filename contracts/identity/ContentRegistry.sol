// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CreatorRegistry.sol";
import "../access/ContentGate.sol";

contract ContentRegistry is ContentGate {
    CreatorRegistry public creatorRegistry;
    uint256 public contentCount;

    struct Content {
        uint256 creatorId;
        string dataCID;
        uint256 creationTime;
    }

    mapping(uint256 => Content) public contents;

    event ContentCreated(uint256 indexed contentId, uint256 indexed creatorId, string dataCID);

    constructor(address _creatorRegistry, address _ageVerifier) ContentGate(_ageVerifier) {
        creatorRegistry = CreatorRegistry(_creatorRegistry);
    }

    function createContent(string calldata dataCID) external onlyVerified returns (uint256) {
        uint256 creatorId = creatorRegistry.addressToCreatorId(msg.sender);
        require(creatorId != 0, "Not a registered creator");

        contentCount++;
        contents[contentCount] = Content(creatorId, dataCID, block.timestamp);

        emit ContentCreated(contentCount, creatorId, dataCID);
        return contentCount;
    }
}

