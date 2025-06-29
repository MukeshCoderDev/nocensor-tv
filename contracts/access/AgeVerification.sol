// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgeVerification {
    mapping(address => bool) public isVerified;
    address private verifier;

    event AgeVerified(address indexed user);

    constructor(address _verifier) {
        verifier = _verifier;
    }

    function verifyAge() external {
        require(!isVerified[msg.sender], "Already verified");
        isVerified[msg.sender] = true;
        emit AgeVerified(msg.sender);
    }

    function canAccess(address user) external view returns (bool) {
        return isVerified[user];
    }
}

