# Migration Plan: IPFS to Arweave for NoCensorTV

### 1. Smart Contracts: Option A (ContentDAOv2)

*   **Action:** Create a new Solidity contract, e.g., `ContentDAOv2.sol` (or `ContentStorage.sol`), with:

    ```solidity
    string public contentId;
    ```
*   **Deployment:** Deploy `ContentDAOv2` alongside the existing `ContentDAO` contract on mainnet.
*   **App Configuration:** Update all new-upload logic to read/write to `ContentDAOv2` instead of `ContentDAO`.

### 2. Data Migration Strategy: Frontend Fallback + One-Time Script

*   **Frontend Fallback:**

    1.  On content fetch, call `ContentDAOv2.getContentId(videoId)`.
    2.  If result is empty or zero, fall back to `ContentDAO.getCid(videoId)`.
        *This ensures existing IPFS-based videos continue working without interruption.*

*   **One-Time Migration Script (Optional):**

    *   Prepare a mapping `{ oldCid: newTxId }`.
    *   Write a Node.js or Hardhat script to iterate over all video IDs:

        ```js
        for (const videoId of allVideoIds) {
          const oldCid = await oldContract.getCid(videoId);
          const newTx = mapping[oldCid];
          if (newTx) {
            await newContract.storeContentId(videoId, newTx);
          }
        }
        ```
    *   Run the script once to populate `ContentDAOv2` with Arweave IDs.

### 3. Arweave Key Management: User-Provided Frontend

*   **User Flow:**

    1.  Creator clicks **"Load Arweave Key"** and selects/pastes their Arweave key JSON file.
    2.  The frontend initializes the Bundlr/Arweave client with this key (in memory).
    3.  On upload, the client signs the transaction locally and obtains a `txId`.
    4.  After upload, the key JSON is cleared from memory; it is never sent to any server.

*   **Security:**

    *   No server-side key storage.
    *   Full user control over their wallet keys.
    *   Keys exist only briefly in browser memory.

### 4. Implementation Steps: Putting It All Together

1.  **Deploy Contracts**

    *   Deploy `ContentDAOv2` to the mainnet.

2.  **Frontend Updates**

    *   **API Endpoints:**

        *   `getContentId(videoId)` → Query `v2` first, then fallback to `v1`.
        *   `storeContentId(videoId, txId)` → Write to `v2` only.
    *   **UI:** Add a **"Load Arweave Key"** button in the uploader.
    *   **Upload Logic:**

        ```js
        const tx = await bundlr.uploader.upload(file, { key: arKeyJson });
        const arweaveId = tx.id;
        await contentDAOv2.storeContentId(videoId, arweaveId);
        ```

3.  **(Optional) Run Migration Script**

    *   Execute the one-time script to migrate old IPFS CIDs to Arweave TxIDs in `ContentDAOv2`.

---

*This document serves as the definitive guide for migrating NoCensorTV from IPFS-based content storage to permanent, censorship-resistant hosting on Arweave.*