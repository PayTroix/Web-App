import { ethers } from 'ethers';
import { profileService } from '@/services/api';
import toast from 'react-hot-toast';
import abi from '@/services/abi.json';

interface CreateRecipientParams {
  name: string;
  email: string;
  recipient_ethereum_address: string;
  organization: number;
  phone_number?: string;
  salary: number;
  position?: string;
  token: string;
  signer: ethers.Signer;
  contractAddress: string;
}

interface BatchRecipient {
  name: string;
  email: string;
  recipient_ethereum_address: string;
  phone_number: string;
  salary: number;
  position: string;
}

interface CreateBatchRecipientsParams {
  recipients: BatchRecipient[];
  organizationId: number;
  token: string;
  signer: ethers.Signer;
  contractAddress: string;
}

interface RecipientCreationResult {
  backendIds: number[];
  transactionHash: string;
}

/**
 * Creates a single recipient in an atomic transaction
 * 1. First creates the recipient in the backend
 * 2. Then creates the recipient on-chain
 * 3. Rolls back backend creation if chain transaction fails
 */
export async function createRecipientAtomic({
  name,
  email,
  recipient_ethereum_address,
  organization,
  phone_number,
  salary,
  position,
  token,
  signer,
  contractAddress,
}: CreateRecipientParams): Promise<RecipientCreationResult> {
  // Validate wallet address format
  if (!ethers.isAddress(recipient_ethereum_address)) {
    throw new Error('Invalid wallet address');
  }

  // Validate contract address format
  if (!ethers.isAddress(contractAddress)) {
    throw new Error('Invalid contract address');
  }

  const provider = signer.provider;
  if (!provider) {
    throw new Error('No provider available');
  }

  // Verify contract exists at the address
  const code = await provider.getCode(contractAddress);
  if (code === '0x') {
    throw new Error('No contract found at the specified address');
  }

  const payrollContract = new ethers.Contract(contractAddress, abi, signer);
  let backendRecipientId: number | null = null;
  let transactionHash: string = '';

  try {
    // 1. First create backend record
    const recipientData = {
      name: name,
      email: email,
      recipient_ethereum_address: ethers.getAddress(recipient_ethereum_address), // Normalize address
      organization: organization,
      phone_number: phone_number,
      salary: salary,
      position: position,
      status: 'active',
    };

    const recipientResponse = await profileService.createRecipientProfile(
      recipientData,
      token
    );
    backendRecipientId = recipientResponse.id;

    // 2. Then create on-chain recipient
    // let estimatedGas;
    // try {
    //   estimatedGas = await payrollContract.createRecipient.estimateGas(
    //     recipient_ethereum_address,
    //     name,
    //     salary
    //   );
    // } catch (estimateError) {
    //   console.error('Gas estimation failed:', estimateError);
      
    //   // Extract error message from different error structures
    //   let errorMessage: string;
    //   if (estimateError instanceof Error) {
    //     errorMessage = estimateError.message;
    //   } else if (
    //     typeof estimateError === 'object' &&
    //     estimateError !== null &&
    //     'reason' in estimateError
    //   ) {
    //     errorMessage = String(estimateError.reason);
    //   } else {
    //     errorMessage = 'Unknown error during gas estimation';
    //   }
      
    //   throw new Error(`Failed to estimate gas: ${errorMessage}`);
    // }

    // Add 20% buffer to gas limit
    // const gasLimit = (estimatedGas * BigInt(120)) / BigInt(100);

    const tx = await payrollContract.createRecipient(recipient_ethereum_address, name, salary);
    
    transactionHash = tx.hash;
    const receipt = await tx.wait();

    // Check transaction status
    if (!receipt) {
      throw new Error(`Transaction failed: No receipt returned`);
    }
    
    if (receipt.status !== 1) {
      const txDetails = await provider.getTransaction(tx.hash);
      throw new Error(
        `Transaction failed with status ${receipt.status}. Transaction: ${JSON.stringify(
          txDetails
        )}`
      );
    }

    toast.success('Recipient created successfully!');
    return { backendIds: [backendRecipientId], transactionHash };
    
  } catch (error) {
    // Rollback: Delete backend record if chain transaction failed
    if (backendRecipientId) {
      try {
        await profileService.deleteRecipientProfile(backendRecipientId, token);
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
        // We continue with the original error even if rollback fails
      }
    }

    // Handle specific contract errors
    if (error && typeof error === 'object') {
      const ethersError = error as { code?: string; reason?: string };

      if (ethersError.code) {
        switch (ethersError.code) {
          case 'CALL_EXCEPTION':
            throw new Error(
              `Contract error: ${ethersError.reason || 'Unknown contract error'}`
            );
          case 'INSUFFICIENT_FUNDS':
            throw new Error('Insufficient funds for transaction');
          case 'NETWORK_ERROR':
            throw new Error('Network error occurred');
          default:
            // Default case - re-throw original error
            throw error;
        }
      }
    }

    // Re-throw other errors
    throw error;
  }
}

/**
 * Creates multiple recipients in an atomic transaction
 * 1. First creates recipients in the backend
 * 2. Then creates recipients on-chain
 * 3. Rolls back backend creations if chain transaction fails
 */
export async function createBatchRecipientsAtomic({
  recipients,
  organizationId,
  token,
  signer,
  contractAddress,
}: CreateBatchRecipientsParams): Promise<RecipientCreationResult> {
  if (!ethers.isAddress(contractAddress)) {
    throw new Error('Invalid contract address');
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

  const payrollContract = new ethers.Contract(contractAddress, abi, signer);

  // Validate all recipient addresses
  for (const recipient of recipients) {
    if (!ethers.isAddress(recipient.recipient_ethereum_address)) {
      throw new Error(`Invalid wallet address: ${recipient.recipient_ethereum_address}`);
    }
  }

  const backendRecipientIds: number[] = [];
  let transactionHash: string = '';

  try {
    // 1. First create backend records
    const backendRecipients = recipients.map((recipient) => ({
      name: recipient.name,
      email: recipient.email,
      recipient_ethereum_address: ethers.getAddress(recipient.recipient_ethereum_address), // Normalize address
      organization: organizationId,
      phone_number: recipient.phone_number,
      salary: recipient.salary,
      position: recipient.position,
      status: 'active',
    }));

    const createPromises = backendRecipients.map((recipient) =>
      profileService.createRecipientProfile(recipient, token)
    );

    const createdRecipients = await Promise.all(createPromises);
    backendRecipientIds.push(...createdRecipients.map((r) => r.id));

    // 2. Prepare data for batch creation
    const addresses = recipients.map((r) => r.recipient_ethereum_address);
    const names = recipients.map((r) => r.name);
    const salaries = recipients.map((r) => r.salary);

    // 3. Execute batch creation on-chain
    let estimatedGas;
    try {
      estimatedGas = await payrollContract.batchCreateRecipients.estimateGas(
        addresses,
        names,
        salaries
      );
    } catch (estimateError) {
      console.error('Gas estimation failed:', estimateError);
      
      // Extract error message from different error structures
      let errorMessage: string;
      if (estimateError instanceof Error) {
        errorMessage = estimateError.message;
      } else if (
        typeof estimateError === 'object' &&
        estimateError !== null &&
        'reason' in estimateError
      ) {
        errorMessage = String(estimateError.reason);
      } else {
        errorMessage = 'Unknown error during gas estimation';
      }
      
      throw new Error(`Failed to estimate gas: ${errorMessage}`);
    }

    // Add 20% buffer to gas limit
    const gasLimit = (estimatedGas * BigInt(120)) / BigInt(100);

    const tx = await payrollContract.batchCreateRecipients(
      addresses,
      names,
      salaries,
      {
        gasLimit,
      }
    );
    
    transactionHash = tx.hash;
    const receipt = await tx.wait();

    // Check transaction status
    if (!receipt) {
      throw new Error(`Transaction failed: No receipt returned`);
    }
    
    if (receipt.status !== 1) {
      const txDetails = await provider.getTransaction(tx.hash);
      throw new Error(
        `Transaction failed with status ${receipt.status}. Transaction: ${JSON.stringify(
          txDetails
        )}`
      );
    }

    toast.success(`${recipients.length} recipients created successfully!`);
    return { backendIds: backendRecipientIds, transactionHash };
    
  } catch (error) {
    // Rollback: Delete all backend records if chain transaction failed
    if (backendRecipientIds.length > 0) {
      try {
        const deletePromises = backendRecipientIds.map((id) =>
          profileService.deleteRecipientProfile(id, token)
        );
        await Promise.all(deletePromises);
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
        // We continue with the original error even if rollback fails
      }
    }

    // Handle specific contract errors
    if (error && typeof error === 'object') {
      const ethersError = error as { code?: string; reason?: string };

      if (ethersError.code) {
        switch (ethersError.code) {
          case 'CALL_EXCEPTION':
            throw new Error(
              `Contract error: ${ethersError.reason || 'Unknown contract error'}`
            );
          case 'INSUFFICIENT_FUNDS':
            throw new Error('Insufficient funds for transaction');
          case 'NETWORK_ERROR':
            throw new Error('Network error occurred');
          default:
            // Default case - re-throw original error
            throw error;
        }
      }
    }

    // Re-throw other errors
    throw error;
  }
}