"use client";

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, sepolia, lisk, liskSepolia, base, baseSepolia } from "@reown/appkit/networks";
import { projectId } from "@/config/Appkit";
import WalletButton from "@/components/WalletButton";
import { ReactNode } from "react";
import Home from "@/app/page";


if (!projectId) {
  throw new Error('Project ID is not defined')
}

// 2. Create a metadata object
const metadata = {
  name: 'PayTroix - Web3 Payroll Solution',
  description: 'Payroll Reinvented for Web3 - Instant, Secure, and Borderless',
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};


// eslint-disable-next-line @typescript-eslint/no-unused-vars
createAppKit({
  adapters: [new EthersAdapter()],
  projectId,
  networks: [mainnet, sepolia, lisk, liskSepolia, base, baseSepolia],
  defaultNetwork: liskSepolia,
  metadata: metadata,
  features: {
    email: true,
    socials: false,
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

export const AppKit = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
}