import { useCallback, useState, useEffect } from 'react';
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

// Improved token address validation with better error handling
const getTokenAddresses = () => {
  // For SSR support
  if (typeof window === 'undefined') {
    return { USDT: null, USDC: null };
  }

  const addresses = {
    USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS,
    USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS,
  };

  // Log helpful debugging information
  if (!addresses.USDT) {
    console.warn('NEXT_PUBLIC_USDT_ADDRESS is not defined in environment variables');
  } else if (!ethers.isAddress(addresses.USDT)) {
    console.warn(`Invalid USDT address: ${addresses.USDT}`);
  }

  if (!addresses.USDC) {
    console.warn('NEXT_PUBLIC_USDC_ADDRESS is not defined in environment variables');
  } else if (!ethers.isAddress(addresses.USDC)) {
    console.warn(`Invalid USDC address: ${addresses.USDC}`);
  }

  return {
    USDT: addresses.USDT && ethers.isAddress(addresses.USDT) ? addresses.USDT : null,
    USDC: addresses.USDC && ethers.isAddress(addresses.USDC) ? addresses.USDC : null,
  };
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

  // Check token configuration on mount
  useEffect(() => {
    const addresses = getTokenAddresses();
    if (!addresses.USDT || !addresses.USDC) {
      console.warn('Token addresses not properly configured. Check your environment variables.');
    }
  }, []);

  const getTokenBalances = useCallback(async (walletAddress: string, provider: Provider) => {
    try {
      setBalances(prev => ({ ...prev, loading: true, error: null }));

      const addresses = getTokenAddresses();
      const missingAddresses = [];

      if (!addresses.USDT) missingAddresses.push('USDT');
      if (!addresses.USDC) missingAddresses.push('USDC');

      if (missingAddresses.length > 0) {
        throw new Error(`Token addresses not configured: ${missingAddresses.join(', ')}`);
      }

      const ethersProvider = new ethers.BrowserProvider(provider);

      // Get all available token balances
      const results = await Promise.allSettled([
        fetchTokenBalance(addresses.USDT, walletAddress, ethersProvider),
        fetchTokenBalance(addresses.USDC, walletAddress, ethersProvider),
      ]);

      const usdtResult = results[0];
      const usdcResult = results[1];

      setBalances({
        USDT: usdtResult.status === 'fulfilled' ? usdtResult.value : '0',
        USDC: usdcResult.status === 'fulfilled' ? usdcResult.value : '0',
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching token balances:', error);
      setBalances(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch token balances',
      }));
    }
  }, []);

  const fetchTokenBalance = async (
    tokenAddress: string | null,
    walletAddress: string,
    provider: ethers.BrowserProvider
  ): Promise<string> => {
    if (!tokenAddress) return '0';

    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const balance = await contract.balanceOf(walletAddress);
      return ethers.formatUnits(balance, 6);
    } catch (err) {
      console.error(`Error fetching balance for token ${tokenAddress}:`, err);
      return '0';
    }
  };

  return { balances, getTokenBalances };
};

export default useTokenBalances;