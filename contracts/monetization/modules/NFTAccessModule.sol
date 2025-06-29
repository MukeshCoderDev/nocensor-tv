// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../interfaces/IMonetizationModule.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTAccessModule is IMonetizationModule {
    mapping(uint256 => address) public nftContracts;

    function initialize(uint256 contentId, address, bytes calldata initData) external override {
        address nftContract = abi.decode(initData, (address));
        nftContracts[contentId] = nftContract;
    }

    function execute(uint256, bytes calldata) external payable override {
        revert("Access by NFT ownership only");
    }

    function canAccess(uint256 contentId, address user) external view override returns (bool) {
        address nftContract = nftContracts[contentId];
        if (nftContract == address(0)) return false;
        return IERC721(nftContract).balanceOf(user) > 0;
    }
}

