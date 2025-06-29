// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../token/LibertyToken.sol";
import "../identity/CreatorRegistry.sol";
import "../identity/ContentRegistry.sol";

contract RevenueSplitter is Ownable {
    LibertyToken public libertyToken;
    CreatorRegistry public creatorRegistry;
    ContentRegistry public contentRegistry;

    uint256 public platformFee = 1000; // 10% in basis points
    address public platformTreasury;

    event RevenueDistributed(uint256 contentId, uint256 creatorShare, uint256 platformShare);

    constructor(address _libertyToken, address _creatorRegistry, address _contentRegistry, address _treasury) {
        libertyToken = LibertyToken(_libertyToken);
        creatorRegistry = CreatorRegistry(_creatorRegistry);
        contentRegistry = ContentRegistry(_contentRegistry);
        platformTreasury = _treasury;
    }

    function distribute(uint256 contentId, uint256 amount) external {
        uint256 platformShare = (amount * platformFee) / 10000;
        uint256 creatorShare = amount - platformShare;

        libertyToken.transferFrom(msg.sender, address(this), amount);
        libertyToken.transfer(platformTreasury, platformShare);

        (, address vault) = getCreatorInfo(contentId);
        libertyToken.transfer(vault, creatorShare);

        emit RevenueDistributed(contentId, creatorShare, platformShare);
    }

    function getCreatorInfo(uint256 contentId) public view returns (uint256 creatorId, address vault) {
        (uint256 _creatorId, , ) = contentRegistry.contents(contentId);
        (address _vault, , ) = creatorRegistry.creators(_creatorId);
        return (_creatorId, _vault);
    }
}

