"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABI_JSON = void 0;
exports.ABI_JSON = [
    {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewBet",
        "inputs": [
            {
                "type": "tuple",
                "name": "bet",
                "indexed": false,
                "components": [
                    {
                        "type": "uint256",
                        "name": "id"
                    },
                    {
                        "type": "address",
                        "name": "owner"
                    },
                    {
                        "type": "string",
                        "name": "option"
                    },
                    {
                        "type": "uint256",
                        "name": "amount"
                    }
                ]
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Pong",
        "inputs": []
    },
    {
        "type": "function",
        "name": "FEES",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "ODD_DECIMALS",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "addressToString",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_addr"
            }
        ],
        "outputs": [
            {
                "type": "string",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "admin",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "bet",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "string",
                "name": "selection"
            },
            {
                "type": "uint256",
                "name": "odds"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "betKeys",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "bets",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "id"
            },
            {
                "type": "address",
                "name": "owner"
            },
            {
                "type": "string",
                "name": "option"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ]
    },
    {
        "type": "function",
        "name": "calculateOdds",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "option"
            },
            {
                "type": "uint256",
                "name": "betAmount"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getBetKeys",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256[]",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getBets",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "betId"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "bet",
                "components": [
                    {
                        "type": "uint256",
                        "name": "id"
                    },
                    {
                        "type": "address",
                        "name": "owner"
                    },
                    {
                        "type": "string",
                        "name": "option"
                    },
                    {
                        "type": "uint256",
                        "name": "amount"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "ping",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "resolveResult",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "optionResult"
            },
            {
                "type": "uint8",
                "name": "result"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "status",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint8",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "winner",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "string",
                "name": ""
            }
        ]
    }
];
