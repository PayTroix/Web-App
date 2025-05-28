import { ProfileData } from '@/types/profile';

const PROFILE_KEY = 'user_profile';
const PROFILE_EXPIRY = 1 * 60 * 60 * 1000; // 1 hour

export const storeProfileData = (data: ProfileData) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(PROFILE_KEY, JSON.stringify({
            ...data,
            lastChecked: Date.now()
        }));
    }
};

export const getProfileData = (): ProfileData | null => {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem(PROFILE_KEY);
        if (!data) return null;

        const profileData = JSON.parse(data) as ProfileData;
        const isExpired = Date.now() - profileData.lastChecked > PROFILE_EXPIRY;

        if (isExpired) {
            localStorage.removeItem(PROFILE_KEY);
            return null;
        }

        return profileData;
    }
    return null;
};

export const clearProfileData = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(PROFILE_KEY);
    }
};