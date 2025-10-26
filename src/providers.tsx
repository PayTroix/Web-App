'use client';

import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseSepolia } from 'wagmi/chains';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { coinbaseWallet, walletConnect, metaMask, safe } from 'wagmi/connectors';

// Create wagmi config
const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    // MetaMask - Traditional EOA wallet
    metaMask(),
    // Coinbase Wallet (EOA only for signature compatibility)
    coinbaseWallet({
      appName: 'PayTriox HR Management',
      preference: 'eoaOnly', // Force traditional wallet signatures only
    }),
    // WalletConnect for mobile wallets (EOA wallets)
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
      metadata: {
        name: 'PayTriox HR Management',
        description: 'Payroll Reinvented for Web3',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: ['https://avatars.githubusercontent.com/u/37784886'],
      },
      showQrModal: true,
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
});

// Create query client
const queryClient = new QueryClient();

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
        >
          {props.children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
