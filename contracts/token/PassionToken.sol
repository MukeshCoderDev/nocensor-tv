// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract PassionToken is ERC20Votes {
    address public immutable platform;

    constructor(address _platform)
        ERC20("Passion Token", "PASSION")
        ERC20Permit("Passion Token")
    {
        platform = _platform;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == platform, "Only platform");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == platform, "Only platform");
        _burn(from, amount);
    }
}

