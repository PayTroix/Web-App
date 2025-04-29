import { useState, useEffect } from 'react';
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

const TOKEN_ADDRESSES = {
  USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS,
  USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS,
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

      // Create contract instances
      const usdtContract = new ethers.Contract(TOKEN_ADDRESSES.USDT, ERC20_ABI, provider);
      const usdcContract = new ethers.Contract(TOKEN_ADDRESSES.USDC, ERC20_ABI, provider);

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