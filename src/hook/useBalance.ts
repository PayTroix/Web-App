import { useState } from 'react';
import { ethers } from 'ethers';
import { type Provider } from '@reown/appkit/react';

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

// Validate token addresses with SSR support
const validateTokenAddress = (address: string | undefined): string | null => {
  if (typeof window === 'undefined') {
    return null; // Return null during SSR
  }
  if (!address) {
    console.warn('Token address is not defined in environment variables');
    return null;
  }
  if (!ethers.isAddress(address)) {
    console.warn(`Invalid token address: ${address}`);
    return null;
  }
  return address;
};

const TOKEN_ADDRESSES = {
  USDT: validateTokenAddress(process.env.NEXT_PUBLIC_USDT_ADDRESS),
  USDC: validateTokenAddress(process.env.NEXT_PUBLIC_USDC_ADDRESS),
};

interface TokenBalance {
  USDT: string;
  USDC: string;
  loading: boolean;
  error: string | null;
}

const useTokenBalances = () => {
  const [balances, setBalances] = useState<TokenBalance>({
    USDT: '0',
    USDC: '0',
    loading: false,
    error: null,
  });

  const getTokenBalances = async (walletAddress: string, provider: Provider) => {
    try {
      setBalances(prev => ({ ...prev, loading: true, error: null }));

      // Check if we have valid token addresses
      if (!TOKEN_ADDRESSES.USDT || !TOKEN_ADDRESSES.USDC) {
        throw new Error('Token addresses are not properly configured');
      }

      // Convert provider to ethers.js provider
      const ethersProvider = new ethers.BrowserProvider(provider);

      // Create contract instances
      const usdtContract = new ethers.Contract(TOKEN_ADDRESSES.USDT, ERC20_ABI, ethersProvider);
      const usdcContract = new ethers.Contract(TOKEN_ADDRESSES.USDC, ERC20_ABI, ethersProvider);

      // Fetch balances in parallel
      const [usdtBalance, usdcBalance] = await Promise.all([
        usdtContract.balanceOf(walletAddress),
        usdcContract.balanceOf(walletAddress),
      ]);

      // Format balances (USDT and USDC have 6 decimals)
      const formattedUSDT = ethers.formatUnits(usdtBalance, 6);
      const formattedUSDC = ethers.formatUnits(usdcBalance, 6);

      setBalances({
        USDT: formattedUSDT,
        USDC: formattedUSDC,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching token balances:', error);
      setBalances(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch token balances',
      }));
    }
  };

  return { balances, getTokenBalances };
};

export default useTokenBalances;