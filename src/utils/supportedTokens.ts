export const SUPPORTED_TOKENS = [
    {
        symbol: 'TOKEN',
        name: 'Morph Holesky Token',
        address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '',
        decimals: 6
    }
] as const;

export type SupportedToken = typeof SUPPORTED_TOKENS[number];

// CSV template data
export const CSV_TEMPLATE = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        recipient_ethereum_address: '0x1234...5678',
        position: 'Developer',
        salary: '1000',
        token: 'USDT'
    }
];