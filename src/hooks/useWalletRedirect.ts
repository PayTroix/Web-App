import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { getToken, removeToken } from '@/utils/token';

export const useWalletRedirect = () => {
    const { address, isConnected } = useAccount();
    const router = useRouter();
    const [hasInitialized, setHasInitialized] = useState(false);
    const previousAddress = useRef<string | undefined>(address);
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Skip checks on first render/page load
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Handle wallet disconnection
        if (hasInitialized && !isConnected) {
            removeToken();
            router.push('/');
            return;
        }

        // Handle account change
        if (hasInitialized &&
            address &&
            previousAddress.current &&
            address !== previousAddress.current) {
            removeToken();
            router.push('/');
            return;
        }

        // Update previous address reference
        previousAddress.current = address;

        // Mark initialization complete after first render
        if (!hasInitialized) {
            setHasInitialized(true);
        }
    }, [address, isConnected, router, hasInitialized]);

    // Modified token check to be less aggressive
    useEffect(() => {
        const token = getToken();
        if (hasInitialized && !isConnected && !token) {
            router.push('/');
        }
    }, [isConnected, router, hasInitialized]);

    return address;
};