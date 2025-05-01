import { ethers } from 'ethers';
import { payrollService } from '@/services/api';
import toast from 'react-hot-toast';
import orgAbi from '@/services/organization_abi.json';
import { type Provider } from "@reown/appkit/react";

interface DisburseSalaryParams {
    recipientId: number;
    recipientAddress: string;
    amount: number;
    tokenAddress: string;
    paymentMonth: string;
    token: string;
    signer: ethers.Signer;
    contractAddress: string;
    organizationId: number; // Add this
}

interface BatchDisburseSalaryParams {
    recipients: {
        id: number;
        address: string;
        amount: number;
    }[];
    tokenAddress: string;
    paymentMonth: string;
    token: string;
    signer: ethers.Signer;
    contractAddress: string;
    organizationId: number; // Add this
}

interface PayrollResult {
    backendIds: number[];
    transactionHash: string;
}

export async function disburseSalaryAtomic({
    recipientId,
    recipientAddress,
    amount,
    tokenAddress,
    paymentMonth,
    token,
    signer,
    contractAddress,
    organizationId, // Add this parameter
}: DisburseSalaryParams): Promise<PayrollResult> {
    // Validate inputs
    if (!ethers.isAddress(recipientAddress)) {
        throw new Error('Invalid recipient address');
    }
    if (!ethers.isAddress(contractAddress)) {
        throw new Error('Invalid contract address');
    }
    if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
    }

    const provider = signer.provider;
    if (!provider) {
        throw new Error('No provider available');
    }

    // Verify contract exists
    const code = await provider.getCode(contractAddress);
    if (code === '0x') {
        throw new Error('No contract found at the specified address');
    }

    const payrollContract = new ethers.Contract(contractAddress, orgAbi, signer);
    let backendPayrollId: number | null = null;

    try {
        // 1. First create backend payroll record
        const payrollData = {
            recipient: recipientId,
            amount: amount.toString(),
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            description: `Salary payment for ${paymentMonth}`,
            status: 'pending',
            organization: organizationId, // Add this field
        };

        const payrollResponse = await payrollService.createPayroll(payrollData, token);
        backendPayrollId = payrollResponse.id;

        // 2. Execute on-chain disbursement

        const tx = await payrollContract.disburseToken(
            tokenAddress,
            recipientAddress,
            ethers.parseUnits(amount.toString(), 6) // Assuming 18 decimals
        );

        const receipt = await tx.wait();

        if (!receipt || receipt.status !== 1) {
            throw new Error('Transaction failed');
        }

        // 3. Update backend record as completed
        await payrollService.updatePayrollStatus(backendPayrollId, 'completed', token);

        toast.success('Salary disbursed successfully!');
        return { backendIds: [backendPayrollId], transactionHash: tx.hash };

    } catch (error) {
        // Rollback: Update backend record as failed if chain transaction failed
        if (backendPayrollId) {
            try {
                await payrollService.updatePayrollStatus(backendPayrollId, 'failed', token);
            } catch (rollbackError) {
                console.error('Failed to update payroll status:', rollbackError);
            }
        }

        // Handle specific contract errors
        // if (error instanceof Error) {
        //     const errorMessage = 'reason' in error ? error.reason as string : error.message;
        //     // throw new Error(`Disbursement failed: ${errorMessage.split('(')[0]}`);
        //     throw new Error(`Disbursement failed: ${errorMessage}`);
        // }
        if (error.data) {
            // Try to decode custom error
            const customError = payrollContract.interface.parseError(error.data);
            throw new Error(`Contract error: ${customError.name}`);
          }
          throw error;
        }
}

export async function batchDisburseSalaryAtomic({
    recipients,
    tokenAddress,
    paymentMonth,
    token,
    signer,
    contractAddress,
    organizationId, // Add this parameter
}: BatchDisburseSalaryParams): Promise<PayrollResult> {
    // Validate inputs
    if (!ethers.isAddress(contractAddress)) {
        throw new Error('Invalid contract address');
    }
    if (recipients.length === 0) {
        throw new Error('No recipients provided');
    }

    const provider = signer.provider;
    if (!provider) {
        throw new Error('No provider available');
    }

    // Verify contract exists
    const code = await provider.getCode(contractAddress);
    if (code === '0x') {
        throw new Error('No contract found at the specified address');
    }

    const payrollContract = new ethers.Contract(contractAddress, orgAbi, signer);
    const backendPayrollIds: number[] = [];

    try {
        // 1. First create backend payroll records
        const createPromises = recipients.map(recipient => {
            const payrollData = {
                recipient: recipient.id,
                amount: recipient.amount.toString(),
                date: new Date().toISOString().split('T')[0],
                description: `Salary payment for ${paymentMonth}`,
                status: 'pending',
                batch_reference: `BATCH-${Date.now()}`,
                organization: organizationId, // Add this field
            };
            return payrollService.createPayroll(payrollData, token);
        });

        const payrollResponses = await Promise.all(createPromises);
        backendPayrollIds.push(...payrollResponses.map(r => r.id));

        // 2. Prepare data for batch disbursement
        const addresses = recipients.map(r => r.address);
        const amounts = recipients.map(r => ethers.parseUnits(r.amount.toString(), 6));

        // 3. Execute batch disbursement
        const tx = await payrollContract.batchDisburseToken(
            tokenAddress,
            addresses,
            amounts
        );

        const receipt = await tx.wait();

        if (!receipt || receipt.status !== 1) {
            throw new Error('Batch transaction failed');
        }

        // 4. Update all backend records as completed
        await Promise.all(
            backendPayrollIds.map(id =>
                payrollService.updatePayrollStatus(id, 'completed', token)
            )
        );

        toast.success(`Successfully disbursed salaries to ${recipients.length} recipients!`);
        return { backendIds: backendPayrollIds, transactionHash: tx.hash };

    } catch (error) {
        // Rollback: Update all backend records as failed
        if (backendPayrollIds.length > 0) {
            try {
                await Promise.all(
                    backendPayrollIds.map(id =>
                        payrollService.updatePayrollStatus(id, 'failed', token))
                );
            } catch (rollbackError) {
                console.error('Failed to update payroll statuses:', rollbackError);
            }
        }

        if (error instanceof Error) {
            const errorMessage = 'reason' in error ? error.reason as string : error.message;
            throw new Error(`Batch disbursement failed: ${errorMessage.split('(')[0]}`);
        }

        throw error;
    }
}

// Helper function to get contract address
export async function getPayrollContractAddress(
    walletProvider: Provider,
    chainId: number,
    address: string
): Promise<string> {
    const provider = new ethers.BrowserProvider(walletProvider, chainId);
    const factoryContractAddress = process.env.NEXT_PUBLIC_LISK_CONTRACT_ADDRESS;

    if (!factoryContractAddress) {
        throw new Error('Factory contract address not configured');
    }

    const factoryContract = new ethers.Contract(
        factoryContractAddress,
        orgAbi,
        provider
    );

    return await factoryContract.getOrganizationContract(address);
}