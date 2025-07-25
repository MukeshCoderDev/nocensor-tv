/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IMonetizationModule,
  IMonetizationModuleInterface,
} from "../IMonetizationModule";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "contentId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "canAccess",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "contentId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "contentId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "initializationData",
        type: "bytes",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IMonetizationModule__factory {
  static readonly abi = _abi;
  static createInterface(): IMonetizationModuleInterface {
    return new Interface(_abi) as IMonetizationModuleInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IMonetizationModule {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as IMonetizationModule;
  }
}
