// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface INFTContract {
    function mint(address to, uint256 tokenId) external;
}

contract RewardTester {
    address public owner;
    INFTContract public nftContract;
    uint256 public constant BUG_REPORTER_NFT = 1;
    mapping(string => bool) public validBugs;

    event BugRewarded(address indexed reporter, string bug, uint256 tokenId, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _nftContract) {
        owner = msg.sender;
        nftContract = INFTContract(_nftContract);
    }

    function setValidBug(string memory bug, bool isValid) external onlyOwner {
        validBugs[bug] = isValid;
    }

    function rewardTester(address reporter, string memory bug) external onlyOwner {
        require(validBugs[bug], "Not eligible");
        nftContract.mint(reporter, BUG_REPORTER_NFT);
        (bool sent, ) = payable(reporter).call{value: 0.1 ether}("");
        require(sent, "ETH transfer failed");
        emit BugRewarded(reporter, bug, BUG_REPORTER_NFT, 0.1 ether);
    }

    // Allow contract to receive ETH
    receive() external payable {}
}
