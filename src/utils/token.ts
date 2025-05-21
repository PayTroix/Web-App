import { web3AuthService } from "@/services/api";

// token.ts
const TOKEN_KEY = 'jwt';
const EXPIRY_KEY = 'jwt_expires_at';
const EXPIRY_HOURS = 20; // 20 hours expiry

export const storeToken = (token: string) => {
    if (typeof window !== 'undefined') {
        const expiresAt = new Date().getTime() + EXPIRY_HOURS * 60 * 60 * 1000;
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(EXPIRY_KEY, expiresAt.toString());
    }
};

export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            const expiresAt = localStorage.getItem(EXPIRY_KEY);

            if (!token || !expiresAt) {
                return null;
            }

            if (Date.now() > parseInt(expiresAt, 10)) {
                removeToken();
                return null;
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
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EXPIRY_KEY);
    }
};

export const isTokenExpired = (): boolean => {
    if (typeof window !== 'undefined') {
        const expiresAt = localStorage.getItem(EXPIRY_KEY);
        if (!expiresAt) return true;

        return Date.now() > parseInt(expiresAt, 10);
    }
    return true;
};

export const getTokenExpiry = (): number | null => {
    if (typeof window !== 'undefined') {
        const expiresAt = localStorage.getItem(EXPIRY_KEY);
        return expiresAt ? parseInt(expiresAt, 10) : null;
    }
    return null;
};

export const isValidSession = async () => {
    const token = getToken();
    if (!token) return false;

    try {
        const user = await web3AuthService.getUser(token);
        return !!user;
    } catch (error) {
        removeToken();
        return false;
    }
};