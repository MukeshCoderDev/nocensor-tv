// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../monetization/CreatorVault.sol";
import "../token/LibertyToken.sol";

contract CreatorRegistry is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Creator {
        address vault;
        uint256 totalEarnings;
        string metadataCID;
    }

    mapping(uint256 => Creator) public creators;
    mapping(address => uint256) public addressToCreatorId;

    LibertyToken public libertyToken;

    event CreatorRegistered(uint256 indexed creatorId, address indexed creator, address vault);

    constructor(address _libertyToken) ERC721("NoCensor Creator", "NCC-ID") {
        libertyToken = LibertyToken(_libertyToken);
    }

    function register(string calldata metadataCID) external returns (uint256) {
        require(addressToCreatorId[msg.sender] == 0, "Already registered");

        _tokenIds.increment();
        uint256 newId = _tokenIds.current();

        CreatorVault vault = new CreatorVault(msg.sender, address(libertyToken));
        creators[newId] = Creator({
            vault: address(vault),
            totalEarnings: 0,
            metadataCID: metadataCID
        });

        _mint(msg.sender, newId);
        addressToCreatorId[msg.sender] = newId;

        emit CreatorRegistered(newId, msg.sender, address(vault));
        return newId;
    }
}

