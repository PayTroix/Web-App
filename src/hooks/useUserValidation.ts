import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { web3AuthService } from '@/services/api';
import { VerifyAddressResponse } from '@/components/landingPage/Hero';

export const useUserValidation = () => {
    const [userExists, setUserExists] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { address } = useAccount();

    useEffect(() => {
        const checkUser = async () => {
            if (!address) return;

            try {
                const response: VerifyAddressResponse = await web3AuthService.verifyAddress(address);
                setUserExists(response.exists);
            } catch (error) {
                console.error('Error checking user:', error);
                setUserExists(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkUser();
    }, [address]);

    return { userExists, isLoading };
};