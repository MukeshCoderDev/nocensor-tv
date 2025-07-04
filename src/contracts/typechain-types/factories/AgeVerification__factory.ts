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
  "0x608060405234801561001057600080fd5b506040516104de3803806104de833981810160405281019061003291906100dc565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610109565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006100a98261007e565b9050919050565b6100b98161009e565b81146100c457600080fd5b50565b6000815190506100d6816100b0565b92915050565b6000602082840312156100f2576100f1610079565b5b6000610100848285016100c7565b91505092915050565b6103c6806101186000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806318a9d22214610046578063575b63c014610076578063b9209e3314610080575b600080fd5b610060600480360381019061005b91906102b0565b6100b0565b60405161006d91906102f8565b60405180910390f35b61007e610105565b005b61009a600480360381019061009591906102b0565b61022d565b6040516100a791906102f8565b60405180910390f35b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050919050565b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615610191576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161018890610370565b60405180910390fd5b60016000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055503373ffffffffffffffffffffffffffffffffffffffff167f82719cca0118176b0839ed3c738495293c8d75fe5953e04fc8e740cbe02d901160405160405180910390a2565b60006020528060005260406000206000915054906101000a900460ff1681565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061027d82610252565b9050919050565b61028d81610272565b811461029857600080fd5b50565b6000813590506102aa81610284565b92915050565b6000602082840312156102c6576102c561024d565b5b60006102d48482850161029b565b91505092915050565b60008115159050919050565b6102f2816102dd565b82525050565b600060208201905061030d60008301846102e9565b92915050565b600082825260208201905092915050565b7f416c726561647920766572696669656400000000000000000000000000000000600082015250565b600061035a601083610313565b915061036582610324565b602082019050919050565b600060208201905081810360008301526103898161034d565b905091905056fea264697066735822122061615bd062a654cd0e7f337570d3d70dd0b65310fdc946a099bb656806546efb64736f6c63430008140033";

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
