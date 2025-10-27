/**
 * usePayrollDisbursement Hook
 * Handles payroll disbursement operations
 */

import { useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { Contract, parseUnits } from 'ethers';
import toast from 'react-hot-toast';
import { profileService } from '@/services/api';
import { getToken, isTokenExpired } from '@/utils/token';
import { disburseSalaryAtomic, batchDisburseSalaryAtomic } from '@/services/payRoll';
import { validateRecipients, filterRecipientsByGroup } from '../_utils';
import { USDT_DECIMALS } from '../_constants';
import type { Recipient, RecipientGroup, DisbursementRecipient } from '../_types';
import abi from '@/services/abi.json';
import orgAbi from '@/services/organization_abi.json';
import { BrowserProvider } from 'ethers';

interface UseDisbursementParams {
  recipients: Recipient[];
  onSuccess?: () => void;
}

export function usePayrollDisbursement({ recipients, onSuccess }: UseDisbursementParams) {
  const { address, isConnected, connector } = useAccount();
  const { data: walletClient } = useWalletClient();

  const disburse = useCallback(async (
    selectedGroup: RecipientGroup,
    paymentMonth: string,
    selectedToken: string = 'USDT'
  ) => {
    try {
      if (!isConnected || !address || !walletClient || !connector) {
        toast.error('Please connect your wallet first');
        return;
      }

      if (!paymentMonth) {
        toast.error('Please specify payment month');
        return;
      }

      const token = getToken();
      if (!token || isTokenExpired()) {
        toast.error('Authentication required');
        return;
      }

      // Get organization details
      const orgProfile = await profileService.listOrganizationProfiles(token);
      const organizationId = orgProfile[0]?.id;

      if (!organizationId) {
        throw new Error('Organization ID not found');
      }

      // Filter recipients by group
      const recipientProfiles = orgProfile[0]?.recipients || [];
      const filteredRecipients = filterRecipientsByGroup(recipientProfiles, selectedGroup);

      if (filteredRecipients.length === 0) {
        toast.error('No recipients found for selected group');
        throw new Error('No recipients found for selected group');
      }

      // Validate recipients
      const validation = validateRecipients(filteredRecipients);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Get wallet client for contract interactions
      const provider = await connector.getProvider() as any;
      const ethersProvider = new BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      // Get factory contract
      const factoryContractAddress = process.env.NEXT_PUBLIC_BASE_SEPOLIA_CONTRACT_ADDRESS;
      if (!factoryContractAddress) {
        throw new Error('Factory contract address not configured');
      }

      const factoryContract = new Contract(factoryContractAddress, abi, ethersProvider);
      const contractAddress = await factoryContract.getOrganizationContract(address);

      if (!contractAddress) {
        throw new Error('Organization contract address not found');
      }

      // Verify contract deployment
      const contractCode = await ethersProvider.getCode(contractAddress);
      if (contractCode === '0x') {
        throw new Error('Organization contract not deployed at address: ' + contractAddress);
      }

      const payrollContract = new Contract(contractAddress, orgAbi, signer);

      // Get token address
      const usdtAddress = process.env.NEXT_PUBLIC_USDT_ADDRESS;
      if (!usdtAddress) {
        throw new Error('USDT token address not found');
      }

      const usdtContract = new Contract(
        usdtAddress,
        [
          'function allowance(address,address) view returns (uint256)',
          'function approve(address,uint256) returns (bool)',
          'function balanceOf(address) view returns (uint256)'
        ],
        signer
      );

      // Calculate total amount
      const totalNetAmount = filteredRecipients.reduce(
        (sum, r) => sum + (r.salary || 0),
        0
      );

      const parsedAmount = parseUnits(totalNetAmount.toString(), USDT_DECIMALS);
      const totalGrossAmount = await payrollContract.calculateGrossAmount(parsedAmount);

      // Check and approve allowance
      const currentAllowance = await usdtContract.allowance(address, contractAddress);
      
      if (currentAllowance < totalGrossAmount) {
        console.log('Requesting token approval...');
        const approveTx = await usdtContract.approve(contractAddress, totalGrossAmount);
        console.log('Approval transaction sent:', approveTx.hash);
        await approveTx.wait();
        console.log('Approval confirmed');
      }

      // Check balance
      const balance = await usdtContract.balanceOf(address);
      if (balance < totalGrossAmount) {
        throw new Error(
          `Insufficient USDT balance. Required: ${(Number(totalGrossAmount) / 1e6).toFixed(2)} USDT`
        );
      }

      // Prepare recipients for disbursement
      const disbursementRecipients: DisbursementRecipient[] = filteredRecipients.map(r => ({
        id: r.id,
        address: r.recipient_ethereum_address!,
        amount: parseUnits((r.salary || 0).toString(), USDT_DECIMALS),
      }));

      // Execute disbursement
      if (disbursementRecipients.length === 1) {
        const recipient = disbursementRecipients[0];
        await disburseSalaryAtomic({
          recipientId: recipient.id,
          recipientAddress: recipient.address,
          amount: recipient.amount,
          tokenAddress: usdtAddress,
          paymentMonth,
          token,
          signer,
          contractAddress,
          organizationId,
        });
      } else {
        await batchDisburseSalaryAtomic({
          recipients: disbursementRecipients,
          tokenAddress: usdtAddress,
          paymentMonth,
          token,
          signer,
          contractAddress,
          organizationId,
        });
      }

      toast.success('Salary disbursement completed successfully!');
      onSuccess?.();
    } catch (error: unknown) {
      console.error('Disbursement error:', error);
      throw error;
    }
  }, [isConnected, address, walletClient, connector, recipients, onSuccess]);

  return { disburse };
}
