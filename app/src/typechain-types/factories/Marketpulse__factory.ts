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
import type { PayableOverrides } from "../common";
import type { Marketpulse, MarketpulseInterface } from "../Marketpulse";

const _abi = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address payable",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "option",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct Marketpulse.Bet",
        name: "bet",
        type: "tuple",
      },
    ],
    name: "NewBet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Pong",
    type: "event",
  },
  {
    inputs: [],
    name: "FEES",
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
  {
    inputs: [],
    name: "ODD_DECIMALS",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "addressToString",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address payable",
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
        internalType: "string",
        name: "selection",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "odds",
        type: "uint256",
      },
    ],
    name: "bet",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
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
    name: "bets",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "option",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "option",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "betAmount",
        type: "uint256",
      },
    ],
    name: "calculateOdds",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "betId",
        type: "uint256",
      },
    ],
    name: "getBets",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address payable",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "option",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct Marketpulse.Bet",
        name: "bet",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ping",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "optionResult",
        type: "string",
      },
      {
        internalType: "enum Marketpulse.BET_RESULT",
        name: "result",
        type: "uint8",
      },
    ],
    name: "resolveResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "status",
    outputs: [
      {
        internalType: "enum Marketpulse.BET_RESULT",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "winner",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405260028060006101000a81548160ff021916908360028111156100295761002861007d565b5b021790555060006004556000600555336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506100ac565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b61311580620000bc6000396000f3fe6080604052600436106100a75760003560e01c80635e57966d116100645780635e57966d146101d35780637a4f4e9c146102105780638b7b23ee14610239578063dfbf53ae14610264578063e9c20cb91461028f578063f851a440146102bf576100a7565b806308888c0a146100ac5780631ccf6955146100d75780631d86be8814610114578063200d2ed21461015157806322af00fa1461017c5780635c36b186146101bc575b600080fd5b3480156100b857600080fd5b506100c16102ea565b6040516100ce9190611c9c565b60405180910390f35b3480156100e357600080fd5b506100fe60048036038101906100f99190611cf7565b6102ef565b60405161010b9190611e67565b60405180910390f35b34801561012057600080fd5b5061013b60048036038101906101369190611fbe565b610427565b6040516101489190611c9c565b60405180910390f35b34801561015d57600080fd5b50610166610760565b6040516101739190612091565b60405180910390f35b34801561018857600080fd5b506101a3600480360381019061019e9190611cf7565b610773565b6040516101b39493929190612105565b60405180910390f35b3480156101c857600080fd5b506101d161085b565b005b3480156101df57600080fd5b506101fa60048036038101906101f5919061218f565b6108c7565b60405161020791906121bc565b60405180910390f35b34801561021c57600080fd5b5061023760048036038101906102329190612203565b610b9e565b005b34801561024557600080fd5b5061024e6111c5565b60405161025b9190611c9c565b60405180910390f35b34801561027057600080fd5b506102796111ca565b60405161028691906121bc565b60405180910390f35b6102a960048036038101906102a491906122bf565b611258565b6040516102b69190611c9c565b60405180910390f35b3480156102cb57600080fd5b506102d4611630565b6040516102e1919061231f565b60405180910390f35b600a81565b6102f7611c3b565b6001828154811061030b5761030a61233a565b5b9060005260206000209060040201604051806080016040529081600082015481526020016001820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160028201805461039490612398565b80601f01602080910402602001604051908101604052809291908181526020018280546103c090612398565b801561040d5780601f106103e25761010080835404028352916020019161040d565b820191906000526020600020905b8154815290600101906020018083116103f057829003601f168201915b505050505081526020016003820154815250509050919050565b600061044c60405180606001604052806030815260200161308e603091398484611654565b600083805190602001206040518060400160405280600581526020017f7472756d7000000000000000000000000000000000000000000000000000000081525080519060200120036104a0576005546104a4565b6004545b9050600084805190602001206040518060400160405280600581526020017f7472756d700000000000000000000000000000000000000000000000000000008152508051906020012014610505578360055461050091906123f8565b610514565b8360045461051391906123f8565b5b90506105556040518060400160405280601581526020017f746f74616c4c6f736572416d6f756e74203a2025640000000000000000000000815250836116f3565b6105946040518060400160405280601781526020017f746f74616c57696e6e6572416d6f756e7420203a202564000000000000000000815250826116f3565b60006105ad83600a806105a7919061255f565b8461178f565b90506105ee6040518060400160405280601981526020017f7061727420706572204f44445f444543494d414c203a20256400000000000000815250826116f3565b600080610610600a80610601919061255f565b8461187d90919063ffffffff16565b9150915081610654576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161064b906125f6565b60405180910390fd5b6106936040518060400160405280601481526020017f6f6464776974686f75744665657320203a202564000000000000000000000000815250826116f3565b6000806106cd6064600a806106a8919061255f565b600a6106b49190612616565b6106be9190612687565b846118ac90919063ffffffff16565b9150915081610711576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161070890612704565b60405180910390fd5b6107506040518060400160405280600981526020017f6f646420203a2025640000000000000000000000000000000000000000000000815250826116f3565b8097505050505050505092915050565b600260009054906101000a900460ff1681565b6001818154811061078357600080fd5b90600052602060002090600402016000915090508060000154908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020180546107d290612398565b80601f01602080910402602001604051908101604052809291908181526020018280546107fe90612398565b801561084b5780601f106108205761010080835404028352916020019161084b565b820191906000526020600020905b81548152906001019060200180831161082e57829003601f168201915b5050505050908060030154905084565b6108996040518060400160405280600481526020017f50696e67000000000000000000000000000000000000000000000000000000008152506118d4565b7f4d015fcc2a20c24d7be893b3a525eac864b5a53a5f88ef7201a600465c73314e60405160405180910390a1565b606060006040518060400160405280601081526020017f3031323334353637383961626364656600000000000000000000000000000000815250905060008360601b90506000602a67ffffffffffffffff81111561092857610927611e93565b5b6040519080825280601f01601f19166020018201604052801561095a5781602001600182028036833780820191505090505b5090507f3000000000000000000000000000000000000000000000000000000000000000816000815181106109925761099161233a565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f7800000000000000000000000000000000000000000000000000000000000000816001815181106109f6576109f561233a565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060005b6014811015610b9257836004848360148110610a4757610a4661233a565b5b1a60f81b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916901c60f81c60ff1681518110610a8657610a8561233a565b5b602001015160f81c60f81b82600283610a9f9190612616565b6002610aab91906123f8565b81518110610abc57610abb61233a565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535083600f60f81b848360148110610b0457610b0361233a565b5b1a60f81b1660f81c60ff1681518110610b2057610b1f61233a565b5b602001015160f81c60f81b82600283610b399190612616565b6003610b4591906123f8565b81518110610b5657610b5561233a565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508080600101915050610a28565b50809350505050919050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610c1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff166108c7565b604051602001610c2691906127ac565b60405160208183030381529060405290610c76576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c6d91906121bc565b60405180910390fd5b50600280811115610c8a57610c8961201a565b5b600260009054906101000a900460ff166002811115610cac57610cab61201a565b5b14600260009054906101000a900460ff16604051602001610ccd9190612889565b60405160208183030381529060405290610d1d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d1491906121bc565b60405180910390fd5b5060006002811115610d3257610d3161201a565b5b816002811115610d4557610d4461201a565b5b1480610d75575060016002811115610d6057610d5f61201a565b5b816002811115610d7357610d7261201a565b5b145b610db4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dab90612921565b60405180910390fd5b60005b60018054905081101561119657600060018281548110610dda57610dd961233a565b5b9060005260206000209060040201604051806080016040529081600082015481526020016001820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600282018054610e6390612398565b80601f0160208091040260200160405190810160405280929190818152602001828054610e8f90612398565b8015610edc5780601f10610eb157610100808354040283529160200191610edc565b820191906000526020600020905b815481529060010190602001808311610ebf57829003601f168201915b50505050508152602001600382015481525050905060006002811115610f0557610f0461201a565b5b836002811115610f1857610f1761201a565b5b148015610f3657508380519060200120816040015180519060200120145b1561100d576000610f668260600151610f5484604001516000610427565b600a80610f61919061255f565b61178f565b9050610fac6040518060400160405280601481526020017f6561726e696e6773203a20256420666f7220257300000000000000000000000081525082846020015161196d565b816020015173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610ff6573d6000803e3d6000fd5b5084600390816110069190612aed565b5050611188565b600160028111156110215761102061201a565b5b8360028111156110345761103361201a565b5b0361114357600061104c8260600151600a606461178f565b90506000806110688385606001516118ac90919063ffffffff16565b91509150816110ac576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110a390612c31565b60405180910390fd5b6110f06040518060400160405280601b81526020017f67697665206261636b206d6f6e6579203a20256420666f72202573000000000081525082866020015161196d565b836020015173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015801561113a573d6000803e3d6000fd5b50505050611187565b6111866040518060400160405280600f81526020017f626574206c6f737420666f7220257300000000000000000000000000000000008152508260200151611a0c565b5b5b508080600101915050610db7565b5080600260006101000a81548160ff021916908360028111156111bc576111bb61201a565b5b02179055505050565b600a81565b600380546111d790612398565b80601f016020809104026020016040519081016040528092919081815260200182805461120390612398565b80156112505780601f1061122557610100808354040283529160200191611250565b820191906000526020600020905b81548152906001019060200180831161123357829003601f168201915b505050505081565b600080341161129c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161129390612c9d565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff16313411156112f6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112ed90612d2f565b60405180910390fd5b6000611300611aa8565b9050600060405180608001604052808381526020013373ffffffffffffffffffffffffffffffffffffffff16815260200187878080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050815260200134815250905060018190806001815401808255809150506001900390600052602060002090600402016000909190919091506000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020190816114139190612aed565b506060820151816003015550507f3da3958a2d60288c66fc825e0a5e95a83e03662afbe1595a85c7a477422642938160405161144f9190611e67565b60405180910390a16114966040518060400160405280600d81526020017f42657420256420706c6163656400000000000000000000000000000000000000815250836116f3565b6114fe6040518060600160405280602281526020016130be602291393488888080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505087611b1b565b6040518060400160405280600581526020017f7472756d7000000000000000000000000000000000000000000000000000000081525080519060200120816040015180519060200120146115ba57600080611568836060015160045461187d90919063ffffffff16565b91509150816115ac576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115a390612dc1565b60405180910390fd5b806004819055505050611624565b6000806115d6836060015160055461187d90919063ffffffff16565b915091508161161a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161161190612e53565b60405180910390fd5b8060058190555050505b81925050509392505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6116ee83838360405160240161166c93929190612e73565b6040516020818303038152906040527f5821efa1000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611bbd565b505050565b61178b8282604051602401611709929190612eb8565b6040516020818303038152906040527fb60e72cc000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611bbd565b5050565b60008083850290506000801985870982811083820303915050600081036117ca578382816117c0576117bf612658565b5b0492505050611876565b8084116117ea576117e96117e46000861460126011611bd7565b611bf1565b5b600084868809905082811182039150808303925060008560000386169050808604955080840493506001818260000304019050808302841793506000600287600302189050808702600203810290508087026002038102905080870260020381029050808702600203810290508087026002038102905080870260020381029050808502955050505050505b9392505050565b600080600083850190508481101561189c5760008092509250506118a5565b60018192509250505b9250929050565b600080838311156118c357600080915091506118cd565b6001838503915091505b9250929050565b61196a816040516024016118e891906121bc565b6040516020818303038152906040527f41304fac000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611bbd565b50565b611a0783838360405160240161198593929190612ef7565b6040516020818303038152906040527f1c7ec448000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611bbd565b505050565b611aa48282604051602401611a22929190612f35565b6040516020818303038152906040527f319af333000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611bbd565b5050565b6000611ae86040518060400160405280601581526020017f43616c6c696e672067656e6572617465426574496400000000000000000000008152506118d4565b424433604051602001611afd93929190612fce565b6040516020818303038152906040528051906020012060001c905090565b611bb784848484604051602401611b35949392919061300b565b6040516020818303038152906040527fc67ea9d1000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611bbd565b50505050565b611bd481611bcc611c03611c24565b63ffffffff16565b50565b6000611be284611c2f565b82841802821890509392505050565b634e487b71600052806020526024601cfd5b60006a636f6e736f6c652e6c6f679050600080835160208501845afa505050565b611c79819050919050565b60008115159050919050565b604051806080016040528060008152602001600073ffffffffffffffffffffffffffffffffffffffff16815260200160608152602001600081525090565b611c8161305e565b565b6000819050919050565b611c9681611c83565b82525050565b6000602082019050611cb16000830184611c8d565b92915050565b6000604051905090565b600080fd5b600080fd5b611cd481611c83565b8114611cdf57600080fd5b50565b600081359050611cf181611ccb565b92915050565b600060208284031215611d0d57611d0c611cc1565b5b6000611d1b84828501611ce2565b91505092915050565b611d2d81611c83565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611d5e82611d33565b9050919050565b611d6e81611d53565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611dae578082015181840152602081019050611d93565b60008484015250505050565b6000601f19601f8301169050919050565b6000611dd682611d74565b611de08185611d7f565b9350611df0818560208601611d90565b611df981611dba565b840191505092915050565b6000608083016000830151611e1c6000860182611d24565b506020830151611e2f6020860182611d65565b5060408301518482036040860152611e478282611dcb565b9150506060830151611e5c6060860182611d24565b508091505092915050565b60006020820190508181036000830152611e818184611e04565b905092915050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b611ecb82611dba565b810181811067ffffffffffffffff82111715611eea57611ee9611e93565b5b80604052505050565b6000611efd611cb7565b9050611f098282611ec2565b919050565b600067ffffffffffffffff821115611f2957611f28611e93565b5b611f3282611dba565b9050602081019050919050565b82818337600083830152505050565b6000611f61611f5c84611f0e565b611ef3565b905082815260208101848484011115611f7d57611f7c611e8e565b5b611f88848285611f3f565b509392505050565b600082601f830112611fa557611fa4611e89565b5b8135611fb5848260208601611f4e565b91505092915050565b60008060408385031215611fd557611fd4611cc1565b5b600083013567ffffffffffffffff811115611ff357611ff2611cc6565b5b611fff85828601611f90565b925050602061201085828601611ce2565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b6003811061205a5761205961201a565b5b50565b600081905061206b82612049565b919050565b600061207b8261205d565b9050919050565b61208b81612070565b82525050565b60006020820190506120a66000830184612082565b92915050565b6120b581611d53565b82525050565b600082825260208201905092915050565b60006120d782611d74565b6120e181856120bb565b93506120f1818560208601611d90565b6120fa81611dba565b840191505092915050565b600060808201905061211a6000830187611c8d565b61212760208301866120ac565b818103604083015261213981856120cc565b90506121486060830184611c8d565b95945050505050565b600061215c82611d33565b9050919050565b61216c81612151565b811461217757600080fd5b50565b60008135905061218981612163565b92915050565b6000602082840312156121a5576121a4611cc1565b5b60006121b38482850161217a565b91505092915050565b600060208201905081810360008301526121d681846120cc565b905092915050565b600381106121eb57600080fd5b50565b6000813590506121fd816121de565b92915050565b6000806040838503121561221a57612219611cc1565b5b600083013567ffffffffffffffff81111561223857612237611cc6565b5b61224485828601611f90565b9250506020612255858286016121ee565b9150509250929050565b600080fd5b600080fd5b60008083601f84011261227f5761227e611e89565b5b8235905067ffffffffffffffff81111561229c5761229b61225f565b5b6020830191508360018202830111156122b8576122b7612264565b5b9250929050565b6000806000604084860312156122d8576122d7611cc1565b5b600084013567ffffffffffffffff8111156122f6576122f5611cc6565b5b61230286828701612269565b9350935050602061231586828701611ce2565b9150509250925092565b600060208201905061233460008301846120ac565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806123b057607f821691505b6020821081036123c3576123c2612369565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061240382611c83565b915061240e83611c83565b9250828201905080821115612426576124256123c9565b5b92915050565b60008160011c9050919050565b6000808291508390505b60018511156124835780860481111561245f5761245e6123c9565b5b600185161561246e5780820291505b808102905061247c8561242c565b9450612443565b94509492505050565b60008261249c5760019050612558565b816124aa5760009050612558565b81600181146124c057600281146124ca576124f9565b6001915050612558565b60ff8411156124dc576124db6123c9565b5b8360020a9150848211156124f3576124f26123c9565b5b50612558565b5060208310610133831016604e8410600b841016171561252e5782820a905083811115612529576125286123c9565b5b612558565b61253b8484846001612439565b92509050818404811115612552576125516123c9565b5b81810290505b9392505050565b600061256a82611c83565b915061257583611c83565b92506125a27fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff848461248c565b905092915050565b7f43616e6e6f7420616464207061727420616e6420310000000000000000000000600082015250565b60006125e06015836120bb565b91506125eb826125aa565b602082019050919050565b6000602082019050818103600083015261260f816125d3565b9050919050565b600061262182611c83565b915061262c83611c83565b925082820261263a81611c83565b91508282048414831517612651576126506123c9565b5b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600061269282611c83565b915061269d83611c83565b9250826126ad576126ac612658565b5b828204905092915050565b7f43616e6e6f742072656d6f766520666565732066726f6d206f64640000000000600082015250565b60006126ee601b836120bb565b91506126f9826126b8565b602082019050919050565b6000602082019050818103600083015261271d816126e1565b9050919050565b7f4f6e6c79207468652061646d696e200000000000000000000000000000000000815250565b600081905092915050565b600061276082611d74565b61276a818561274a565b935061277a818560208601611d90565b80840191505092915050565b7f2063616e20676976652074686520726573756c742e0000000000000000000000815250565b60006127b782612724565b600f820191506127c78284612755565b91506127d282612786565b60158201915081905092915050565b7f526573756c7420697320616c726561647920676976656e20616e64206265747360008201527f20617265207265736f6c766564203a2000000000000000000000000000000000602082015250565b600061283d60308361274a565b9150612848826127e1565b603082019050919050565b60008160f81b9050919050565b600061286b82612853565b9050919050565b61288361287e82612070565b612860565b82525050565b600061289482612830565b91506128a08284612872565b60018201915081905092915050565b7f4f6e6c7920676976652077696e6e657273206f7220647261772c206e6f206f7460008201527f6865722063686f69636573000000000000000000000000000000000000000000602082015250565b600061290b602b836120bb565b9150612916826128af565b604082019050919050565b6000602082019050818103600083015261293a816128fe565b9050919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026129a37fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82612966565b6129ad8683612966565b95508019841693508086168417925050509392505050565b6000819050919050565b60006129ea6129e56129e084611c83565b6129c5565b611c83565b9050919050565b6000819050919050565b612a04836129cf565b612a18612a10826129f1565b848454612973565b825550505050565b600090565b612a2d612a20565b612a388184846129fb565b505050565b5b81811015612a5c57612a51600082612a25565b600181019050612a3e565b5050565b601f821115612aa157612a7281612941565b612a7b84612956565b81016020851015612a8a578190505b612a9e612a9685612956565b830182612a3d565b50505b505050565b600082821c905092915050565b6000612ac460001984600802612aa6565b1980831691505092915050565b6000612add8383612ab3565b9150826002028217905092915050565b612af682611d74565b67ffffffffffffffff811115612b0f57612b0e611e93565b5b612b198254612398565b612b24828285612a60565b600060209050601f831160018114612b575760008415612b45578287015190505b612b4f8582612ad1565b865550612bb7565b601f198416612b6586612941565b60005b82811015612b8d57848901518255600182019150602085019450602081019050612b68565b86831015612baa5784890151612ba6601f891682612ab3565b8355505b6001600288020188555050505b505050505050565b7f43616e6e6f7420737562206665657320616d6f756e742066726f6d20616d6f7560008201527f6e74000000000000000000000000000000000000000000000000000000000000602082015250565b6000612c1b6022836120bb565b9150612c2682612bbf565b604082019050919050565b60006020820190508181036000830152612c4a81612c0e565b9050919050565b7f42657420616d6f756e74206d75737420626520706f7369746976652e00000000600082015250565b6000612c87601c836120bb565b9150612c9282612c51565b602082019050919050565b60006020820190508181036000830152612cb681612c7a565b9050919050565b7f496e73756666696369656e742062616c616e636520746f20706c61636520746860008201527f6973206265742e00000000000000000000000000000000000000000000000000602082015250565b6000612d196027836120bb565b9150612d2482612cbd565b604082019050919050565b60006020820190508181036000830152612d4881612d0c565b9050919050565b7f43616e6e6f742061646420746f74616c5472756d70416d6f756e7420616e642060008201527f6265742e616d6f756e7400000000000000000000000000000000000000000000602082015250565b6000612dab602a836120bb565b9150612db682612d4f565b604082019050919050565b60006020820190508181036000830152612dda81612d9e565b9050919050565b7f43616e6e6f742061646420746f74616c486172726973416d6f756e7420616e6460008201527f206265742e616d6f756e74000000000000000000000000000000000000000000602082015250565b6000612e3d602b836120bb565b9150612e4882612de1565b604082019050919050565b60006020820190508181036000830152612e6c81612e30565b9050919050565b60006060820190508181036000830152612e8d81866120cc565b90508181036020830152612ea181856120cc565b9050612eb06040830184611c8d565b949350505050565b60006040820190508181036000830152612ed281856120cc565b9050612ee16020830184611c8d565b9392505050565b612ef181612151565b82525050565b60006060820190508181036000830152612f1181866120cc565b9050612f206020830185611c8d565b612f2d6040830184612ee8565b949350505050565b60006040820190508181036000830152612f4f81856120cc565b9050612f5e6020830184612ee8565b9392505050565b6000819050919050565b612f80612f7b82611c83565b612f65565b82525050565b60008160601b9050919050565b6000612f9e82612f86565b9050919050565b6000612fb082612f93565b9050919050565b612fc8612fc382612151565b612fa5565b82525050565b6000612fda8286612f6f565b602082019150612fea8285612f6f565b602082019150612ffa8284612fb7565b601482019150819050949350505050565b6000608082019050818103600083015261302581876120cc565b90506130346020830186611c8d565b818103604083015261304681856120cc565b90506130556060830184611c8d565b95945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052605160045260246000fdfe63616c63756c6174654f64647320666f72206f7074696f6e20257320616e642062657420616d6f756e7420697320256442657420706c616365643a202564206f6e202573206174206f646473206f66202564a26469706673582212209b721eb816b592a625a04888b821427637f9cb7eef9db56892b81a1dc4a9da9d64736f6c63430008180033";

type MarketpulseConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MarketpulseConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Marketpulse__factory extends ContractFactory {
  constructor(...args: MarketpulseConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: PayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Marketpulse & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Marketpulse__factory {
    return super.connect(runner) as Marketpulse__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MarketpulseInterface {
    return new Interface(_abi) as MarketpulseInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Marketpulse {
    return new Contract(address, _abi, runner) as unknown as Marketpulse;
  }
}