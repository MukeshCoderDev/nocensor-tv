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
import type { ModuleManager, ModuleManagerInterface } from "../ModuleManager";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_contentRegistry",
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
        indexed: false,
        internalType: "uint256",
        name: "contentId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "module",
        type: "address",
      },
    ],
    name: "ModuleAttached",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "module",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    name: "ModuleWhitelisted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
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
        name: "module",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "initData",
        type: "bytes",
      },
    ],
    name: "attachModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "contentModules",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contentRegistry",
    outputs: [
      {
        internalType: "contract ContentRegistry",
        name: "",
        type: "address",
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
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "module",
        type: "address",
      },
      {
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    name: "whitelistModule",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "whitelistedModules",
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
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161091138038061091183398101604081905261002f916100b1565b61003833610061565b60018055600280546001600160a01b0319166001600160a01b03929092169190911790556100e1565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100c357600080fd5b81516001600160a01b03811681146100da57600080fd5b9392505050565b610821806100f06000396000f3fe6080604052600436106100865760003560e01c8063867574801161005957806386757480146101285780638da5cb5b14610148578063a3756ebb14610166578063c3f8450b146101a6578063f2fde38b146101c657600080fd5b806327a4f2bb1461008b57806359efcb15146100c8578063715018a6146100dd5780637e1087b6146100f2575b600080fd5b34801561009757600080fd5b506002546100ab906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b6100db6100d6366004610631565b6101e6565b005b3480156100e957600080fd5b506100db6102c0565b3480156100fe57600080fd5b506100ab61010d36600461067d565b6003602052600090815260409020546001600160a01b031681565b34801561013457600080fd5b506100db6101433660046106b2565b6102d4565b34801561015457600080fd5b506000546001600160a01b03166100ab565b34801561017257600080fd5b5061019661018136600461070c565b60046020526000908152604090205460ff1681565b60405190151581526020016100bf565b3480156101b257600080fd5b506100db6101c136600461072e565b610401565b3480156101d257600080fd5b506100db6101e136600461070c565b61046c565b6101ee6104e5565b6000838152600360205260409020546001600160a01b03168061024d5760405162461bcd60e51b8152602060048201526012602482015271139bc81b5bd91d5b1948185d1d1858da195960721b60448201526064015b60405180910390fd5b6040516359efcb1560e01b81526001600160a01b038216906359efcb1590349061027f90889088908890600401610793565b6000604051808303818588803b15801561029857600080fd5b505af11580156102ac573d6000803e3d6000fd5b5050505050506102bb60018055565b505050565b6102c861053e565b6102d26000610598565b565b6001600160a01b03831660009081526004602052604090205460ff166103355760405162461bcd60e51b8152602060048201526016602482015275135bd91d5b19481b9bdd081dda1a5d195b1a5cdd195960521b6044820152606401610244565b6000848152600360205260409081902080546001600160a01b0319166001600160a01b0386169081179091559051637104db2360e11b815263e209b646906103879087903390879087906004016107b6565b600060405180830381600087803b1580156103a157600080fd5b505af11580156103b5573d6000803e3d6000fd5b5050604080518781526001600160a01b03871660208201527f6319329853d0fd85dcc9750bfe970e6fa839d85f17ee3cf73aea0131f7adab08935001905060405180910390a150505050565b61040961053e565b6001600160a01b038216600081815260046020908152604091829020805460ff19168515159081179091558251938452908301527f90b76f3b0d31020a89ff64d2bc7bc18f912018d5d51334eb496b6c8ae329cb16910160405180910390a15050565b61047461053e565b6001600160a01b0381166104d95760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610244565b6104e281610598565b50565b6002600154036105375760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610244565b6002600155565b6000546001600160a01b031633146102d25760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610244565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60008083601f8401126105fa57600080fd5b50813567ffffffffffffffff81111561061257600080fd5b60208301915083602082850101111561062a57600080fd5b9250929050565b60008060006040848603121561064657600080fd5b83359250602084013567ffffffffffffffff81111561066457600080fd5b610670868287016105e8565b9497909650939450505050565b60006020828403121561068f57600080fd5b5035919050565b80356001600160a01b03811681146106ad57600080fd5b919050565b600080600080606085870312156106c857600080fd5b843593506106d860208601610696565b9250604085013567ffffffffffffffff8111156106f457600080fd5b610700878288016105e8565b95989497509550505050565b60006020828403121561071e57600080fd5b61072782610696565b9392505050565b6000806040838503121561074157600080fd5b61074a83610696565b91506020830135801515811461075f57600080fd5b809150509250929050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b8381526040602082015260006107ad60408301848661076a565b95945050505050565b8481526001600160a01b03841660208201526060604082018190526000906107e1908301848661076a565b969550505050505056fea26469706673582212201893ab19caec8984866ad890fa9571f2a0e65952b017af957d0a9a25c7bcc2af64736f6c63430008140033";

type ModuleManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ModuleManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ModuleManager__factory extends ContractFactory {
  constructor(...args: ModuleManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _contentRegistry: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_contentRegistry, overrides || {});
  }
  override deploy(
    _contentRegistry: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_contentRegistry, overrides || {}) as Promise<
      ModuleManager & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ModuleManager__factory {
    return super.connect(runner) as ModuleManager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ModuleManagerInterface {
    return new Interface(_abi) as ModuleManagerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ModuleManager {
    return new Contract(address, _abi, runner) as unknown as ModuleManager;
  }
}
