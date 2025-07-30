// Morph Holesky network definition
export const morphHolesky = {
    id: 2810,
    name: 'Morph Holesky',
    network: 'morph-holesky',
    nativeCurrency: {
        decimals: 18,
        name: 'ETH',
        symbol: 'ETH',
    },
    rpcUrls: {
        public: { http: ['https://rpc-holesky.morphl2.io'] },
        default: { http: ['https://rpc-holesky.morphl2.io'] },
    },
    blockExplorers: {
        etherscan: { name: 'Morph Holesky Explorer', url: 'https://explorer-holesky.morphl2.io' },
        default: { name: 'Morph Holesky Explorer', url: 'https://explorer-holesky.morphl2.io' },
    },
    testnet: true,
} as const;
