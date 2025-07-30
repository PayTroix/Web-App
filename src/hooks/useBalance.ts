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
const getTokenAddress = () => {
  // For SSR support
  if (typeof window === 'undefined') {
    return null;
  }

  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

  // Log helpful debugging information
  if (!tokenAddress) {
    console.warn('NEXT_PUBLIC_TOKEN_ADDRESS is not defined in environment variables');
  } else if (!ethers.isAddress(tokenAddress)) {
    console.warn(`Invalid token address: ${tokenAddress}`);
  }

  return tokenAddress && ethers.isAddress(tokenAddress) ? tokenAddress : null;
};

interface TokenBalance {
  TOKEN: string;
  loading: boolean;
  error: string | null;
}

const useTokenBalances = () => {
  const [balances, setBalances] = useState<TokenBalance>({
    TOKEN: '0',
    loading: false,
    error: null,
  });

  // Check token configuration on mount
  useEffect(() => {
    const address = getTokenAddress();
    if (!address) {
      console.warn('Token address not properly configured. Check your environment variables.');
    }
  }, []);

  const getTokenBalances = useCallback(async (walletAddress: string, provider: Provider) => {
    try {
      setBalances(prev => ({ ...prev, loading: true, error: null }));

      const tokenAddress = getTokenAddress();

      if (!tokenAddress) {
        throw new Error('Token address not configured');
      }

      const ethersProvider = new ethers.BrowserProvider(provider);

      // Get token balance
      const balance = await fetchTokenBalance(tokenAddress, walletAddress, ethersProvider);

      setBalances({
        TOKEN: balance,
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