"use client";

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, sepolia, lisk, liskSepolia, base, baseSepolia } from "@reown/appkit/networks";
import { projectId } from "@/config/Appkit";
import { ReactNode } from "react";


if (!projectId) {
  throw new Error('Project ID is not defined')
}

// 2. Create a metadata object
const metadata = {
  name: 'PayTroix - Web3 Payroll Solution',
  description: 'Payroll Reinvented for Web3 - Instant, Secure, and Borderless',
  url: "https://web-app-zf5d.onrender.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};


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