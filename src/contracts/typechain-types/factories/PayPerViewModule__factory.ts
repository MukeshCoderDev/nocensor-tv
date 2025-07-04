/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type {
  PayPerViewModule,
  PayPerViewModuleInterface,
} from "../PayPerViewModule";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "accessGranted",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "creators",
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
    inputs: [
      {
        internalType: "uint256",
        name: "contentId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
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
        name: "initData",
        type: "bytes",
      },
    ],
    name: "initialize",
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
    name: "prices",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506107b6806100206000396000f3fe6080604052600436106100555760003560e01c806359efcb151461005a578063bc31c1c114610076578063cd53d08e146100b3578063d5b2d1ed146100f0578063e19067781461012d578063e209b6461461016a575b600080fd5b610074600480360381019061006f91906104da565b610193565b005b34801561008257600080fd5b5061009d6004803603810190610098919061053a565b6102d0565b6040516100aa9190610576565b60405180910390f35b3480156100bf57600080fd5b506100da60048036038101906100d5919061053a565b6102e8565b6040516100e791906105d2565b60405180910390f35b3480156100fc57600080fd5b5061011760048036038101906101129190610619565b61031b565b6040516101249190610674565b60405180910390f35b34801561013957600080fd5b50610154600480360381019061014f9190610619565b610383565b6040516101619190610674565b60405180910390f35b34801561017657600080fd5b50610191600480360381019061018c919061068f565b6103b2565b005b600080848152602001908152602001600020543410156101e8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101df90610760565b60405180910390fd5b60016002600085815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055506001600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051600060405180830381858888f193505050501580156102ca573d6000803e3d6000fd5b50505050565b60006020528060005260406000206000915090505481565b60016020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006002600084815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b60026020528160005260406000206020528060005260406000206000915091509054906101000a900460ff1681565b600082828101906103c3919061053a565b9050836001600087815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600080878152602001908152602001600020819055505050505050565b600080fd5b600080fd5b6000819050919050565b6104528161043f565b811461045d57600080fd5b50565b60008135905061046f81610449565b92915050565b600080fd5b600080fd5b600080fd5b60008083601f84011261049a57610499610475565b5b8235905067ffffffffffffffff8111156104b7576104b661047a565b5b6020830191508360018202830111156104d3576104d261047f565b5b9250929050565b6000806000604084860312156104f3576104f2610435565b5b600061050186828701610460565b935050602084013567ffffffffffffffff8111156105225761052161043a565b5b61052e86828701610484565b92509250509250925092565b6000602082840312156105505761054f610435565b5b600061055e84828501610460565b91505092915050565b6105708161043f565b82525050565b600060208201905061058b6000830184610567565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006105bc82610591565b9050919050565b6105cc816105b1565b82525050565b60006020820190506105e760008301846105c3565b92915050565b6105f6816105b1565b811461060157600080fd5b50565b600081359050610613816105ed565b92915050565b600080604083850312156106305761062f610435565b5b600061063e85828601610460565b925050602061064f85828601610604565b9150509250929050565b60008115159050919050565b61066e81610659565b82525050565b60006020820190506106896000830184610665565b92915050565b600080600080606085870312156106a9576106a8610435565b5b60006106b787828801610460565b94505060206106c887828801610604565b935050604085013567ffffffffffffffff8111156106e9576106e861043a565b5b6106f587828801610484565b925092505092959194509250565b600082825260208201905092915050565b7f496e73756666696369656e74207061796d656e74000000000000000000000000600082015250565b600061074a601483610703565b915061075582610714565b602082019050919050565b600060208201905081810360008301526107798161073d565b905091905056fea2646970667358221220cbb2eb3223c6edb162a5d1c7d05a4d100178d85885cbb10bb9d87a78fe67906d64736f6c63430008140033";

type PayPerViewModuleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PayPerViewModuleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PayPerViewModule__factory extends ContractFactory {
  constructor(...args: PayPerViewModuleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      PayPerViewModule & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): PayPerViewModule__factory {
    return super.connect(runner) as PayPerViewModule__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PayPerViewModuleInterface {
    return new Interface(_abi) as PayPerViewModuleInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): PayPerViewModule {
    return new Contract(address, _abi, runner) as unknown as PayPerViewModule;
  }
}
