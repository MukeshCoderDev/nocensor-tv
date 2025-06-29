import { ethers, Signer } from 'ethers';
import { CONTRACT_ADDRESSES } from '../contracts/addresses';
import LibertyTokenABI from '../contracts/abis/LibertyToken.json';
import CreatorRegistryABI from '../contracts/abis/CreatorRegistry.json';
import ModuleManagerABI from '../contracts/abis/ModuleManager.json';
import type { ModuleManager } from '../contracts/typechain-types';

interface ContentData {
  title: string;
  description: string;
  cid: string;
  price: number;
  accessType: number;
}

export const getContract = (contractName: keyof typeof CONTRACT_ADDRESSES, signer: Signer) => {
  const address = CONTRACT_ADDRESSES[contractName];
  let abi: any;
  
  switch(contractName) {
    case 'libertyToken':
      abi = LibertyTokenABI;
      break;
    case 'creatorRegistry':
      abi = CreatorRegistryABI;
      break;
    case 'moduleManager':
      abi = ModuleManagerABI;
      break;
    default:
      throw new Error(`Unknown contract: ${contractName}`);
  }
  
  return new ethers.Contract(address, abi, signer) as ethers.Contract & ModuleManager;
};

export const registerCreator = async (signer: Signer, metadataCID: string) => {
  const registry = getContract('creatorRegistry', signer);
  const tx = await registry.registerCreator(metadataCID);
  await tx.wait();
  return tx.hash;
};

export const uploadContent = async (signer: Signer, contentData: ContentData) => {
  const contentRegistry = getContract('contentRegistry', signer);
  const tx = await contentRegistry.registerContent(
    contentData.title,
    contentData.description,
    contentData.cid,
    ethers.utils.parseEther(contentData.price.toString()),
    contentData.accessType
  );
  await tx.wait();
  return tx.hash;
};

export const purchaseAccess = async (
  signer: Signer,
  contentId: number,
  moduleType: 'PPV' | 'SUBSCRIPTION' | 'NFT',
  amount?: ethers.BigNumberish
) => {
  const moduleManager = getContract('moduleManager', signer);
  
  let tx;
  switch(moduleType) {
    case 'PPV':
      tx = await moduleManager.executePPV(contentId, { value: amount });
      break;
    case 'SUBSCRIPTION':
      tx = await moduleManager.executeSubscription(contentId);
      break;
    case 'NFT':
      tx = await moduleManager.executeNFT(contentId);
      break;
    default:
      throw new Error('Invalid module type');
  }
  
  await tx.wait();
  return tx.hash;
};

export const checkAccess = async (
  signer: Signer,
  contentId: number,
  userAddress: string
) => {
  const moduleManager = getContract('moduleManager', signer);
  return await moduleManager.checkAccess(contentId, userAddress);
};
