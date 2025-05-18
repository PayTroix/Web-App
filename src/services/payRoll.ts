import { ethers } from 'ethers';
import { payrollService } from '@/services/api';
import toast from 'react-hot-toast';
import orgAbi from '@/services/organization_abi.json';
import { type Provider } from "@reown/appkit/react";

interface DisburseSalaryParams {
    recipientId: number;
    recipientAddress: string;
    amount: bigint;
    tokenAddress: string;
    paymentMonth: string;
    token: string;
    signer: ethers.Signer;
    contractAddress: string;
    organizationId: number;
}

interface BatchDisburseSalaryParams {
    recipients: {
        id: number;
        address: string;
        amount: bigint;
    }[];
    tokenAddress: string;
    paymentMonth: string;
    token: string;
    signer: ethers.Signer;
    contractAddress: string;
    organizationId: number;
}

interface PayrollResult {
    backendIds: number[];
    transactionHash: string;
}

// interface ContractErrorData {
//     data?: unknown;
//     reason?: string;
// }

interface EthersError extends Error {
    code?: string;
    errorArgs?: unknown[];
    errorName?: string;
    errorSignature?: string;
    reason?: string;
    transaction?: {
        data?: string;
        [key: string]: unknown;
    };
    error?: {
        code?: number;
        message?: string;
        data?: string;
    };
    action?: string;
    invocation?: unknown;
    revert?: unknown;
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
    organizationId,
}: DisburseSalaryParams): Promise<PayrollResult> {
    // Validate inputs
    if (!ethers.isAddress(recipientAddress)) {
        throw new Error('Invalid recipient address');
    }
    if (!ethers.isAddress(contractAddress)) {
        throw new Error('Invalid contract address');
    }
    if (amount <= BigInt(0)) {
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
            date: new Date().toISOString().split('T')[0],
            description: `Salary payment for ${paymentMonth}`,
            status: 'pending',
            organization: organizationId,
        };

        const payrollResponse = await payrollService.createPayroll(payrollData, token);
        backendPayrollId = payrollResponse.id;

        // 2. Execute on-chain disbursement
        const tx = await payrollContract.disburseToken(
            tokenAddress,
            recipientAddress,
            ethers.parseUnits(amount.toString(), 6)
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

        throw handleContractError(error, payrollContract);
    }
}

export async function batchDisburseSalaryAtomic({
    recipients,
    tokenAddress,
    paymentMonth,
    token,
    signer,
    contractAddress,
    organizationId,
}: BatchDisburseSalaryParams): Promise<PayrollResult> {
    // Input validation
    if (!ethers.isAddress(contractAddress)) {
        throw new Error('Invalid contract address');
    }
    if (!ethers.isAddress(tokenAddress)) {
        throw new Error('Invalid token address');
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
        throw new Error('No contract found at specified address');
    }

    const payrollContract = new ethers.Contract(contractAddress, orgAbi, signer);
    const backendPayrollIds: number[] = [];

    try {
        // Prepare transaction data
        const addresses = recipients.map(r => {
            if (!ethers.isAddress(r.address)) {
                throw new Error(`Invalid recipient address: ${r.address}`);
            }
            return r.address;
        });

        const amounts = recipients.map(r => {
            if (r.amount <= BigInt(0)) {
                throw new Error(`Invalid amount for recipient ${r.address}`);
            }
            return r.amount;
        });

        // Calculate total amount for logging
        const totalAmount = amounts.reduce((sum, amount) => sum + amount, BigInt(0));
        console.log('Batch disbursement details:', {
            recipientCount: recipients.length,
            totalAmount: totalAmount.toString(),
            tokenAddress,
            paymentMonth
        });

        // 1. Create pending backend records first
        const batchRef = `BATCH-${Date.now()}`;
        const createPromises = recipients.map(recipient => {
            const payrollData = {
                recipient: recipient.id,
                amount: recipient.amount.toString(),
                date: new Date().toISOString().split('T')[0],
                description: `Salary payment for ${paymentMonth}`,
                status: 'pending',
                batch_reference: batchRef,
                organization: organizationId,
            };
            return payrollService.createPayroll(payrollData, token);
        });

        const payrollResponses = await Promise.all(createPromises);
        backendPayrollIds.push(...payrollResponses.map(r => r.id));

        console.log('Created backend records:', backendPayrollIds);

        // 2. Execute blockchain transaction
        console.log('Executing blockchain transaction...');

        // Check if contract supports token
        const isSupported = await payrollContract.isTokenSupported(tokenAddress);
        if (!isSupported) {
            throw new Error('Token not supported by the contract');
        }

        // Execute batch disbursement with proper gas estimation
        const tx = await payrollContract.batchDisburseToken(
            tokenAddress,
            addresses,
            amounts,
            {
                gasLimit: await payrollContract.batchDisburseToken.estimateGas(
                    tokenAddress,
                    addresses,
                    amounts
                ).catch(() => BigInt(5000000)) // fallback gas limit
            }
        );

        console.log('Transaction sent:', tx.hash);

        // Wait for transaction confirmation
        const receipt = await tx.wait();

        if (!receipt || receipt.status !== 1) {
            throw new Error('Transaction failed on-chain');
        }

        console.log('Transaction confirmed:', receipt.hash);

        // 3. Update backend records as completed
        console.log('Updating backend records as completed...');
        await Promise.all(
            backendPayrollIds.map(id =>
                payrollService.updatePayrollStatus(id, 'completed', token)
            )
        );

        toast.success(`Successfully disbursed salaries to ${recipients.length} recipients!`);
        return {
            backendIds: backendPayrollIds,
            transactionHash: receipt.hash
        };

    } catch (error: unknown) {
        console.error('Batch disbursement error:', {
            error,
            code: error instanceof Error ? (error as EthersError).code : undefined,
            reason: (error as EthersError).reason,
            message: (error as Error).message,
            data: (error as EthersError).error?.data
        });

        // Handle backend rollback
        if (backendPayrollIds.length > 0) {
            console.log('Rolling back backend records...');
            try {
                await Promise.all(
                    backendPayrollIds.map(id =>
                        payrollService.updatePayrollStatus(id, 'failed', token)
                    )
                );
            } catch (rollbackError) {
                console.error('Failed to update payroll statuses:', rollbackError);
            }
        }

        // Type cast error to EthersError
        const ethError = error as EthersError;

        // Handle specific contract errors
        if (ethError.code === 'CALL_EXCEPTION') {
            try {
                if ((error as EthersError).error?.data) {
                    const decodedError = payrollContract.interface.parseError((error as EthersError).error?.data as string);
                    if (decodedError) {
                        throw new Error(
                            `Contract error: ${decodedError.name}(${decodedError.args.join(', ')})`
                        );
                    }
                }
            } catch (decodeError) {
                console.error('Error decoding contract error:', decodeError);
            }
        }

        // Provide meaningful error message based on error type
        
        let errorMessage = 'Batch disbursement failed: ';
        if (ethError.reason) {
            errorMessage += ethError.reason;
        } else if (ethError.code === 'UNPREDICTABLE_GAS_LIMIT') {
            errorMessage += 'Transaction would fail - check token allowance and balances';
        } else if (ethError.message.includes('user rejected')) {
            errorMessage += 'Transaction was rejected by user';
        } else {
            errorMessage += ethError.message || 'Unknown error';
        }

        throw new Error(errorMessage);
    }
}

// Improved error handling function
function handleContractError(error: unknown, contract: ethers.Contract): Error {
    const ethersError = error as EthersError;

    if (ethersError.action === 'estimateGas' && ethersError.code === 'CALL_EXCEPTION') {
        // Try to parse the transaction data to understand what failed
        if (ethersError.transaction?.data) {
            try {
                const decodedTx = contract.interface.parseError(ethersError.transaction.data);
                if (decodedTx) {
                    return new Error(`Transaction would fail when calling ${decodedTx.name} with args: ${JSON.stringify(decodedTx.args)}. Possible reasons: insufficient balance, allowance, or invalid parameters.`);
                }
            } catch (parseError) {
                console.error('Failed to parse transaction data:', parseError);
            }
        }
        return new Error('Transaction would fail. Possible reasons: insufficient balance, allowance, or invalid parameters.');
    }

    // Handle custom contract errors
    if (ethersError.error?.data) {
        try {
            const decodedError = contract.interface.parseError(ethersError.error.data);
            if (decodedError) {
                return new Error(`Contract error: ${decodedError.name}(${decodedError.args.join(', ')})`);
            }
        } catch (parseError) {
            console.error('Failed to decode custom error:', parseError);
        }
    }

    // Handle revert strings
    if (ethersError.reason) {
        return new Error(`Transaction reverted: ${ethersError.reason}`);
    }

    // Handle other ethers.js errors
    if (ethersError.code === 'UNPREDICTABLE_GAS_LIMIT') {
        return new Error('Transaction would fail - check token allowance and balance');
    }

    if (ethersError.code === 'INSUFFICIENT_FUNDS') {
        return new Error('Insufficient funds for transaction');
    }

    if (ethersError.code === 'CALL_EXCEPTION') {
        return new Error('Contract call exception - check contract state and parameters');
    }

    // Fallback to original error if we can't parse it
    if (error instanceof Error) {
        return error;
    }

    return new Error('Unknown contract error occurred');
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