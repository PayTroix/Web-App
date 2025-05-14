import { ethers } from 'ethers';
import { profileService } from '@/services/api';
import toast from 'react-hot-toast';
import orgAbi from '@/services/organization_abi.json';

interface CreateRecipientParams {
  name: string;
  email: string;
  recipient_ethereum_address: string;
  // organization: number;
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
  // organizationId: number;
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
  // organization,
  phone_number,
  salary,
  position,
  token,
  signer,
  contractAddress,
}: CreateRecipientParams): Promise<RecipientCreationResult> {
  // Initial validation
  if (!ethers.isAddress(recipient_ethereum_address)) {
    throw new Error('Invalid wallet address');
  }

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

  let backendRecipientId: number | null = null;
  let transactionHash: string = '';

  try {
    // 1. First create backend record
    const recipientData = {
      name,
      email,
      recipient_ethereum_address: ethers.getAddress(recipient_ethereum_address),
      // organization,
      phone_number,
      salary,
      position,
      status: 'active',
    };

    const recipientResponse = await profileService.createRecipientProfile(
      recipientData,
      token
    );
    backendRecipientId = recipientResponse.id;

    // 2. Then create on-chain recipient
    const payrollContract = new ethers.Contract(contractAddress, orgAbi, signer);
    
    try {
      const tx = await payrollContract.createRecipient(recipient_ethereum_address, name, salary);
      transactionHash = tx.hash;
      const receipt = await tx.wait();

      if (!receipt || receipt.status !== 1) {
        // Smart contract transaction failed - rollback backend
        if (backendRecipientId) {
          await profileService.deleteRecipientProfile(backendRecipientId, token);
        }
        throw new Error('Smart contract transaction failed');
      }

      toast.success('Recipient created successfully!');
      return { backendIds: [backendRecipientId], transactionHash };

    } catch (contractError) {
      // Only rollback if it's a smart contract error
      if (backendRecipientId) {
        await profileService.deleteRecipientProfile(backendRecipientId, token);
      }

      if (contractError instanceof Error) {
        throw new Error(`Smart contract error: ${contractError.message}`);
      }
      throw contractError;
    }

  } catch (error) {
    // Don't rollback for non-contract errors
    if (error instanceof Error) {
      throw new Error(`Error creating recipient: ${error.message}`);
    }
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
  // organizationId,
  token,
  signer,
  contractAddress,
}: CreateBatchRecipientsParams): Promise<RecipientCreationResult> {
  // Initial validation
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

  const backendRecipientIds: number[] = [];

  try {
    // 1. First create all backend records
    const backendRecipients = await Promise.all(
      recipients.map(async (recipient) => {
        const recipientData = {
          name: recipient.name,
          email: recipient.email,
          recipient_ethereum_address: ethers.getAddress(recipient.recipient_ethereum_address),
          // organization: organizationId,
          phone_number: recipient.phone_number,
          salary: recipient.salary,
          position: recipient.position,
          status: 'active',
        };
        return profileService.createRecipientProfile(recipientData, token);
      })
    );

    backendRecipientIds.push(...backendRecipients.map(r => r.id));

    // 2. Then create on-chain recipients
    const payrollContract = new ethers.Contract(contractAddress, orgAbi, signer);
    
    try {
      const addresses = recipients.map(r => r.recipient_ethereum_address);
      const names = recipients.map(r => r.name);
      const salaries = recipients.map(r => r.salary);

      const tx = await payrollContract.batchCreateRecipients(addresses, names, salaries);
      const receipt = await tx.wait();

      if (!receipt || receipt.status !== 1) {
        // Smart contract transaction failed - rollback backend
        await rollbackBackendRecipients(backendRecipientIds, token);
        throw new Error('Smart contract transaction failed');
      }

      toast.success(`${recipients.length} recipients created successfully!`);
      return { backendIds: backendRecipientIds, transactionHash: tx.hash };

    } catch (contractError) {
      // Only rollback for contract errors
      await rollbackBackendRecipients(backendRecipientIds, token);
      
      if (contractError instanceof Error) {
        throw new Error(`Smart contract error: ${contractError.message}`);
      }
      throw contractError;
    }

  } catch (error) {
    // Don't rollback for non-contract errors
    if (error instanceof Error) {
      throw new Error(`Error creating recipients: ${error.message}`);
    }
    throw error;
  }
}

async function rollbackBackendRecipients(ids: number[], token: string) {
  try {
    await Promise.all(
      ids.map(id => profileService.deleteRecipientProfile(id, token))
    );
  } catch (error) {
    console.error('Failed to rollback backend recipients:', error);
  }
}