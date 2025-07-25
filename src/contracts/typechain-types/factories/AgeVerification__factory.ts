/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../common";
import type {
  AgeVerification,
  AgeVerificationInterface,
} from "../AgeVerification";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_verifier",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "AgeVerified",
    type: "event",
  },
  {
    inputs: [
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isVerified",
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
    inputs: [],
    name: "verifyAge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161024538038061024583398101604081905261002f91610054565b600180546001600160a01b0319166001600160a01b0392909216919091179055610084565b60006020828403121561006657600080fd5b81516001600160a01b038116811461007d57600080fd5b9392505050565b6101b2806100936000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806318a9d22214610046578063575b63c014610086578063b9209e3314610090575b600080fd5b61007261005436600461014c565b6001600160a01b031660009081526020819052604090205460ff1690565b604051901515815260200160405180910390f35b61008e6100b3565b005b61007261009e36600461014c565b60006020819052908152604090205460ff1681565b3360009081526020819052604090205460ff161561010a5760405162461bcd60e51b815260206004820152601060248201526f105b1c9958591e481d995c9a599a595960821b604482015260640160405180910390fd5b33600081815260208190526040808220805460ff19166001179055517f82719cca0118176b0839ed3c738495293c8d75fe5953e04fc8e740cbe02d90119190a2565b60006020828403121561015e57600080fd5b81356001600160a01b038116811461017557600080fd5b939250505056fea2646970667358221220dabdb50755102e50d16d0dbf626091bf19154d0e55f4ed6b6c61338bc32991ac64736f6c63430008140033";

type AgeVerificationConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AgeVerificationConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AgeVerification__factory extends ContractFactory {
  constructor(...args: AgeVerificationConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _verifier: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_verifier, overrides || {});
  }
  override deploy(
    _verifier: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_verifier, overrides || {}) as Promise<
      AgeVerification & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): AgeVerification__factory {
    return super.connect(runner) as AgeVerification__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AgeVerificationInterface {
    return new Interface(_abi) as AgeVerificationInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): AgeVerification {
    return new Contract(address, _abi, runner) as unknown as AgeVerification;
  }
}
