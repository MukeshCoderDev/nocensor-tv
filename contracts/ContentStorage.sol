// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ContentStorage is Ownable {
    // Mapping from videoId to Arweave Transaction ID
    mapping(uint256 => string) public videoArweaveTxIds;

    // Event to log when a new content ID is stored
    event ContentIdStored(uint256 indexed videoId, string arweaveTxId);

    constructor() Ownable() {}

    /**
     * @dev Stores the Arweave Transaction ID for a given video ID.
     * Only the owner can call this function.
     * @param _videoId The unique identifier for the video.
     * @param _arweaveTxId The Arweave Transaction ID for the video content.
     */
    function storeContentId(uint256 _videoId, string memory _arweaveTxId) public onlyOwner {
        require(bytes(_arweaveTxId).length > 0, "Arweave TxID cannot be empty");
        videoArweaveTxIds[_videoId] = _arweaveTxId;
        emit ContentIdStored(_videoId, _arweaveTxId);
    }

    /**
     * @dev Retrieves the Arweave Transaction ID for a given video ID.
     * @param _videoId The unique identifier for the video.
     * @return The Arweave Transaction ID.
     */
    function getContentId(uint256 _videoId) public view returns (string memory) {
        return videoArweaveTxIds[_videoId];
    }
}