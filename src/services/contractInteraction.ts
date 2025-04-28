// src/lib/contractInteractions.ts
import { ethers } from 'ethers';
import { JsonRpcProvider, Contract, ContractTransaction } from 'ethers';
import abi from './abi.json';

// Type definitions for better TypeScript support
interface Organization {
  organizationId: string;
  name: string;
  description: string;
  owner: string;
  createdAt: bigint;
  updatedAt: bigint;
}

interface ContractConfig {
  contractAddress: string;
  provider: JsonRpcProvider | ethers.BrowserProvider;
  signer?: ethers.Signer;
}

class PayrollContract {
  private contract: Contract;
  private provider: JsonRpcProvider | ethers.BrowserProvider;
  private signer?: ethers.Signer;

  constructor(config: ContractConfig) {


    this.provider = config.provider;
    this.signer = config.signer;
    this.contract = new Contract(
      config.contractAddress,
      abi,
      config.signer || config.provider
    );
  }

  // Set a new signer (useful when user connects wallet)
  setSigner(signer: ethers.Signer) {
    this.signer = signer;
    this.contract = this.contract;
  }

  // Organization functions
  async createOrganization(name: string, description: string): Promise<ContractTransaction> {
    return this.contract.createOrganization(name, description);
  }

  // // Add a helper method for waiting on transactions
  // async waitForTransaction(tx: ContractTransaction): Promise<TransactionReceipt> {
  //   return tx.wait();
  // }

  async getOrganizationContract(orgOwner: string): Promise<string> {
    return this.contract.getOrganizationContract(orgOwner);
  }

  async getOrganizationDetails(orgOwner: string): Promise<Organization> {
    const org = await this.contract.getOrganizationDetails(orgOwner);
    return {
      organizationId: org.organizationId,
      name: org.name,
      description: org.description,
      owner: org.owner,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt
    };
  }

  async updateOrganizationFeeCollector(orgOwner: string, newCollector: string): Promise<ContractTransaction> {
    return this.contract.updateOrganizationFeeCollector(orgOwner, newCollector);
  }

  async updateOrganizationTransactionFee(orgOwner: string, newFee: bigint): Promise<ContractTransaction> {
    return this.contract.updateOrganizationTransactionFee(orgOwner, newFee);
  }

  // Token functions
  async addToken(tokenName: string, tokenAddress: string): Promise<ContractTransaction> {
    return this.contract.addToken(tokenName, tokenAddress);
  }

  async removeToken(tokenAddress: string): Promise<ContractTransaction> {
    return this.contract.removeToken(tokenAddress);
  }

  async isTokenSupported(tokenAddress: string): Promise<boolean> {
    return this.contract.isTokenSupported(tokenAddress);
  }

  async getTokenName(tokenAddress: string): Promise<string> {
    return this.contract.getTokenName(tokenAddress);
  }

  async getSupportedTokensCount(): Promise<bigint> {
    return this.contract.getSupportedTokensCount();
  }

  // View functions
  async getFeeCollector(): Promise<string> {
    return this.contract.feeCollector();
  }

  async getOwner(): Promise<string> {
    return this.contract.owner();
  }

}

// Helper function to initialize the contract
export const initPayrollContract = (
  contractAddress: string,
  provider: JsonRpcProvider | ethers.BrowserProvider,
  signer?: ethers.Signer
): PayrollContract => {
  return new PayrollContract({
    contractAddress,
    provider,
    signer
  });
};