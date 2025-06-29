// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../access/ContentGate.sol";
import "../monetization/ModuleManager.sol";

contract WatchParty is ContentGate {
    struct Party {
        address host;
        uint256 contentId;
        address[] participants;
        uint256 startTime;
        bool isPrivate;
        uint256 entryFee;
    }

    ModuleManager public moduleManager;
    uint256 public partyCounter;
    mapping(uint256 => Party) public parties;

    event PartyCreated(uint256 partyId, address host, uint256 contentId);
    event PartyJoined(uint256 partyId, address participant);

    constructor(address _moduleManager, address _ageVerifier) ContentGate(_ageVerifier) {
        moduleManager = ModuleManager(_moduleManager);
    }

    function createParty(uint256 contentId, bool isPrivate, uint256 entryFee) external onlyVerified returns (uint256) {
        partyCounter++;
        parties[partyCounter] = Party({
            host: msg.sender,
            contentId: contentId,
            participants: new address[](0),
            startTime: block.timestamp,
            isPrivate: isPrivate,
            entryFee: entryFee
        });

        emit PartyCreated(partyCounter, msg.sender, contentId);
        return partyCounter;
    }

    function joinParty(uint256 partyId) external payable onlyVerified {
        Party storage party = parties[partyId];
        require(party.host != address(0), "Party doesn't exist");

        if (party.isPrivate) {
            require(msg.sender == party.host, "Private party");
        }

        if (party.entryFee > 0) {
            require(msg.value >= party.entryFee, "Insufficient fee");
            payable(party.host).transfer(msg.value);
        }

        party.participants.push(msg.sender);
        emit PartyJoined(partyId, msg.sender);
    }
}

