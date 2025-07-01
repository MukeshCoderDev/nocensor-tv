// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";

contract ContentDAO is Governor, GovernorSettings {
    mapping(address => bool) public creatorRegistry;
    mapping(bytes32 => bool) public flaggedContent;
    event ContentFlagged(bytes32 indexed cid, address indexed flagger, string reason);

    constructor()
        Governor("ContentDAO")
        GovernorSettings(1 /* 1 block */, 50400 /* 1 week */, 0)
    {}

    // --- Required overrides for OpenZeppelin Governor ---



    function votingDelay() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }

    // --- Governor required overrides ---
    function quorum(uint256 blockNumber) public pure override returns (uint256) {
        return 1;
    }

    function getVotes(address, uint256) public pure override returns (uint256) {
        return 1;
    }

    function hasVoted(uint256, address) public pure override returns (bool) {
        return false;
    }

    function clock() public view override returns (uint48) {
        return uint48(block.number);
    }

    function COUNTING_MODE() public pure override returns (string memory) {
        return "simple";
    }

    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=blocknumber";
    }

    // --- Internal Governor hooks ---
    function _quorumReached(uint256 proposalId) internal view override(Governor) returns (bool) {
        // For demo: always true
        return true;
    }

    function _voteSucceeded(uint256 proposalId) internal view override(Governor) returns (bool) {
        // For demo: always true
        return true;
    }

    function _getVotes(address account, uint256 blockNumber, bytes memory params) internal view override(Governor) returns (uint256) {
        // For demo: 1 vote per address
        return 1;
    }

    function _countVote(uint256 proposalId, address account, uint8 support, uint256 weight, bytes memory params) internal override(Governor) {
        // No-op for demo
    }

    // --- Custom logic ---
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public virtual override returns (uint256) {
        require(creatorRegistry[msg.sender], "Only creators can propose");
        return super.propose(targets, values, calldatas, description);
    }

    function flagContent(bytes32 cid, string memory reason) public {
        flaggedContent[cid] = true;
        emit ContentFlagged(cid, msg.sender, reason);
    }
}
