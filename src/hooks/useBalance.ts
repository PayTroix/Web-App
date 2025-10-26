import { useCallback, useState, useEffect } from 'react';
import { formatUnits, isAddress, type Address } from 'viem';
import { usePublicClient } from 'wagmi';

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
] as const;

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
  } else if (!isAddress(addresses.USDT)) {
    console.warn(`Invalid USDT address: ${addresses.USDT}`);
  }

  if (!addresses.USDC) {
    console.warn('NEXT_PUBLIC_USDC_ADDRESS is not defined in environment variables');
  } else if (!isAddress(addresses.USDC)) {
    console.warn(`Invalid USDC address: ${addresses.USDC}`);
  }

  return {
    USDT: addresses.USDT && isAddress(addresses.USDT) ? addresses.USDT as Address : null,
    USDC: addresses.USDC && isAddress(addresses.USDC) ? addresses.USDC as Address : null,
  };
};

interface TokenBalance {
  USDT: string;
  USDC: string;
  loading: boolean;
  error: string | null;
}

const useTokenBalances = () => {
  const publicClient = usePublicClient();
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

  const getTokenBalances = useCallback(async (walletAddress: Address) => {
    if (!publicClient) {
      console.warn('Public client not available');
      return;
    }

    try {
      setBalances(prev => ({ ...prev, loading: true, error: null }));

      const addresses = getTokenAddresses();
      const missingAddresses = [];

      if (!addresses.USDT) missingAddresses.push('USDT');
      if (!addresses.USDC) missingAddresses.push('USDC');

      if (missingAddresses.length > 0) {
        throw new Error(`Token addresses not configured: ${missingAddresses.join(', ')}`);
      }

      // Get all available token balances
      const results = await Promise.allSettled([
        fetchTokenBalance(addresses.USDT!, walletAddress, publicClient),
        fetchTokenBalance(addresses.USDC!, walletAddress, publicClient),
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
  }, [publicClient]);

  const fetchTokenBalance = async (
    tokenAddress: Address,
    walletAddress: Address,
    client: ReturnType<typeof usePublicClient>
  ): Promise<string> => {
    if (!client) return '0';

    try {
      const balance = await client.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [walletAddress],
      }) as bigint;

      return formatUnits(balance, 6);
    } catch (err) {
      console.error(`Error fetching balance for token ${tokenAddress}:`, err);
      return '0';
    }
  };

  return { balances, getTokenBalances };
};

export default useTokenBalances;