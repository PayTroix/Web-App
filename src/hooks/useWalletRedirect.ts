import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppKitAccount } from '@reown/appkit/react';

export const useWalletRedirect = () => {
    const { address } = useAppKitAccount();
    const router = useRouter();

    useEffect(() => {
        if (!address) {
            router.push('/');
        }
    }, [address, router]);

    return address;
};