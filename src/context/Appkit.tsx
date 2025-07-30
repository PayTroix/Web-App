"use client";

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { ReactNode } from "react";
import { morphHolesky } from "../config/networks";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
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
  networks: [morphHolesky],
  defaultNetwork: morphHolesky,
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