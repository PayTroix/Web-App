// token.ts

export const storeToken = (token: string, expiresIn?: number) => {
    if (typeof window !== 'undefined') {
        const expiresAt = expiresIn ? new Date().getTime() + expiresIn * 1000 : undefined;
        localStorage.setItem('jwt', token);
        if (expiresAt) {
            localStorage.setItem('jwt_expires_at', expiresAt.toString());
        }
    }
};

export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        try {
            const token = localStorage.getItem('jwt');
            const expiresAt = localStorage.getItem('jwt_expires_at');
            
            if (token && expiresAt) {
                const expirationTime = parseInt(expiresAt, 10);
                removeToken();
                // if (Date.now() > expirationTime) {
                //     removeToken();
                //     return null;
                // }
            }
            return token;
        } catch (error) {
            console.error('Error accessing localStorage:', error);
            return null;
        }
    }
    return null;
};

export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
        localStorage.removeItem('jwt_expires_at');
    }
};

export const isTokenExpired = (): boolean => {
    if (typeof window !== 'undefined') {
        const expiresAt = localStorage.getItem('jwt_expires_at');
        if (!expiresAt) return true;
        
        return Date.now() > parseInt(expiresAt, 10);
    }
    return true;
};