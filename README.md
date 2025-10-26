# PayTriox - Web3 Payroll Management System

A decentralized HR and payroll management system built with Next.js and OnchainKit, supporting smart contract-based payroll operations on Base blockchain.

## Overview

PayTriox enables organizations to manage payroll, employee records, and salary distributions using blockchain technology. The platform supports both traditional EOA wallets and provides a seamless Web3 experience.

## Tech Stack

- **Frontend**: Next.js 15.3.1, React 19, TypeScript
- **Web3**: OnchainKit 0.35.0, Wagmi 2.14.16, Viem 2.28.0
- **Smart Contracts**: Solidity (deployed on Base Sepolia)
- **Styling**: Tailwind CSS 4.1.4
- **State Management**: React Query (TanStack Query)
- **Authentication**: Web3 signature-based auth (ECDSA)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm/bun
- A Web3 wallet (MetaMask, Coinbase Wallet, or WalletConnect compatible)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Web-App
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key
NEXT_PUBLIC_BASE_SEPOLIA_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_USDC_ADDRESS=usdc_token_address
NEXT_PUBLIC_USDT_ADDRESS=usdt_token_address
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Supported Networks

This dApp currently supports:
- **Base Sepolia** (Testnet) - Chain ID: 84532
- **Base** (Mainnet) - Chain ID: 8453

## Supported Wallets

The application uses OnchainKit and supports:
- **MetaMask** - Browser extension & mobile
- **Coinbase Wallet** - EOA mode (extension & mobile)
- **WalletConnect** - 300+ mobile wallets

> **Note**: Smart Wallet signatures are not currently supported. Only traditional EOA (Externally Owned Account) wallets are compatible with the current backend authentication system.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_PROJECT_ID` | WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/) | Yes |
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | OnchainKit API Key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) | Yes |
| `NEXT_PUBLIC_BASE_SEPOLIA_CONTRACT_ADDRESS` | Deployed payroll contract address on Base Sepolia | Yes |
| `NEXT_PUBLIC_USDC_ADDRESS` | USDC token address on Base Sepolia | Yes |
| `NEXT_PUBLIC_USDT_ADDRESS` | USDT token address on Base Sepolia | Yes |

## Key Features

- 🔐 **Web3 Authentication** - Signature-based login with wallet connection
- 👥 **Organization Management** - Create and manage organization profiles
- 💼 **Employee/Recipient Management** - Add and track employees/recipients
- 💰 **Payroll Processing** - Execute on-chain salary payments
- 📊 **Dashboard Analytics** - View payroll statistics and wallet balances
- 🔔 **Notifications** - Real-time updates for payroll events
- 📄 **Leave Management** - Handle leave requests and approvals
- 💸 **Salary Advances** - Process and track salary advance requests

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard pages
│   ├── register/          # Organization registration
│   ├── payroll/           # Payroll management
│   └── ...
├── components/            # React components
│   ├── landingPage/      # Landing page components
│   ├── dashboard/        # Dashboard widgets
│   └── shared/           # Reusable components
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useBalance.ts     # Token balance hook
│   └── ...
├── services/             # API and contract services
│   ├── api.ts           # Backend API calls
│   ├── abi.json         # Smart contract ABI
│   └── contractInteraction.ts
├── providers.tsx         # OnchainKit & Wagmi providers
└── utils/               # Utility functions
```

## Authentication Flow

1. User connects wallet (MetaMask, Coinbase Wallet, etc.)
2. User signs a message to prove wallet ownership
3. Backend verifies signature and issues JWT token
4. Token is stored in localStorage for session management
5. Protected routes check for valid authentication

## Smart Contract Integration

The application interacts with a payroll smart contract deployed on Base Sepolia:

- **Organization Creation** - Register organizations on-chain
- **Recipient Management** - Add employees/recipients
- **Payroll Execution** - Distribute salaries in USDC/USDT
- **Token Support** - Manage supported payment tokens

## Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Migration Notes

This project has been migrated from Reown AppKit to OnchainKit for better integration with Coinbase's Web3 infrastructure and improved wallet support.

### Key Changes:
- ✅ Replaced AppKit hooks with Wagmi hooks
- ✅ Implemented OnchainKit wallet components
- ✅ Updated to React 19
- ✅ Centralized authentication logic
- ✅ Improved error handling and user feedback

## Troubleshooting

### "Please connect your wallet" error
- Ensure your wallet is connected before attempting actions
- Check that you're on the correct network (Base Sepolia)

### Signature verification failed
- Make sure you're using an EOA wallet (not Smart Wallet)
- Ensure you're signing the correct message
- Check that your wallet is connected to Base Sepolia

### Contract interaction errors
- Verify you're on Base Sepolia network (Chain ID: 84532)
- Ensure the contract address is correct in `.env`
- Check that you have sufficient Base Sepolia ETH for gas

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license here]

## Support

For issues and questions, please open an issue on GitHub.
