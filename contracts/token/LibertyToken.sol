// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract LibertyToken is ERC20Votes {
    address public immutable treasury;

    constructor(address _treasury)
        ERC20("Liberty Token", "LIBERTY")
        ERC20Permit("Liberty Token")
    {
        treasury = _treasury;
        _mint(treasury, 10_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == treasury, "Only treasury");
        _mint(to, amount);
    }
}

