import { useState } from 'react';
import { useAppKitAccount, useAppKitProvider, useAppKitNetwork, type Provider } from '@reown/appkit/react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { web3AuthService } from '@/services/api';
import { storeToken, getToken, isTokenExpired } from '@/utils/token';

export const useAuth = () => {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const { address } = useAppKitAccount();
    const { chainId } = useAppKitNetwork();
    const { walletProvider } = useAppKitProvider<Provider>('eip155');

    const authenticate = async (): Promise<boolean> => {
        if (!address || !walletProvider) {
            toast.error('Please connect your wallet first');
            return false;
        }

        setIsAuthenticating(true);
        const loadingToast = toast.loading('Authenticating...');

        try {
            // Check if we have a valid token
            if (getToken() && !isTokenExpired()) {
                toast.success('Already authenticated!', { id: loadingToast });
                return true;
            }

            // Get nonce and sign message
            const { nonce } = await web3AuthService.getNonce(address);
            const message = `I'm signing my one-time nonce: ${nonce}`;
            const provider = new ethers.BrowserProvider(walletProvider, chainId);
            const signer = await provider.getSigner();
            const signature = await signer.signMessage(message);

            // Login and store token
            const authResponse = await web3AuthService.login({
                address,
                signature
            });

            storeToken(authResponse.access);
            toast.success('Authentication successful!', { id: loadingToast });
            return true;
        } catch (error) {
            console.error('Authentication error:', error);
            toast.error('Authentication failed', { id: loadingToast });
            return false;
        } finally {
            setIsAuthenticating(false);
        }
    };

    return {
        authenticate,
        isAuthenticating
    };
};