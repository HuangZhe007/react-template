export const LOGIN_INFO = {
  chainId: 'AELF',
  payload: {
    method: 'LOGIN',
    contracts: [
      {
        chainId: 'AELF',
        contractAddress: '2RHf2fxsnEaM3wb6N1yGqPupNZbcCY98LgWbGSFWmWzgEs5Sjo',
        contractName: 'Token swap contract',
        description: 'Swap token from the other chain. Base on protocol [-]',
        github: 'https://github.com/AElfProject/AElf/blob/token-swap-contract/protobuf/token_swap_contract.proto',
      },
      {
        chainId: 'AELF',
        contractAddress: '2u6Dd139bHvZJdZ835XnNKL5y6cxqzV9PEWD5fZdQXdFZLgevc',
        contractName: 'Lottery contract',
        description: 'Good Luck',
        github: '-',
      },
      {
        chainId: 'AELF',
        contractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
        contractName: 'Token contract',
        description: 'You can transfer, approve, get balance, etc.',
        github: 'https://github.com/AElfProject/AElf/blob/dev/protobuf/token_contract.proto',
      },
    ],
  },
};

export const CHAIN_INFO = {
  chainId: 'AELF',
  exploreUrl: 'https://explorer.aelf.io/',
  rpcUrl: 'https://explorer.aelf.io/chain',
};

export const CHAIN_ID = 'AELF';
export const tokenContract = 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE';
export const profitContract = '2ZUgaDqWSh4aJ5s5Ker2tRczhJSNep4bVVfrRBRJTRQdMTbA5W';
