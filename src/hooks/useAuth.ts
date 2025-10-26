import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { toast } from 'react-hot-toast';
import { web3AuthService } from '@/services/api';
import { storeToken, getToken, isTokenExpired } from '@/utils/token';

export const useAuth = () => {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const authenticate = async (): Promise<boolean> => {
        console.log('Authenticate called - address:', address);

        if (!address) {
            toast.error('Please connect your wallet first');
            return false;
        }

        setIsAuthenticating(true);
        const loadingToast = toast.loading('Authenticating...');

        const token = getToken();

        try {
            // Check if we have a valid token
            if (token && !isTokenExpired()) {
                toast.success('Already authenticated!', { id: loadingToast });
                return true;
            }

            // Get nonce and sign message
            console.log('Getting nonce for address:', address);
            const { nonce } = await web3AuthService.getNonce(address);
            const message = `I'm signing my one-time nonce: ${nonce}`;

            console.log('Requesting signature...');
            // Sign message using Wagmi's useSignMessage hook
            // This automatically handles Smart Wallet signatures correctly
            const signature = await signMessageAsync({
                message,
            });

            console.log('Signature received:', signature);

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