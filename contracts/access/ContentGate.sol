// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AgeVerification.sol";

contract ContentGate {
    AgeVerification public ageVerifier;

    constructor(address _ageVerifier) {
        ageVerifier = AgeVerification(_ageVerifier);
    }

    modifier onlyVerified() {
        require(ageVerifier.canAccess(msg.sender), "Age verification required");
        _;
    }
}

