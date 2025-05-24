export interface ProfileData {
    hasRecipientProfile: boolean;
    hasOrganizationProfile: boolean;
    userType: 'recipient' | 'organization' | 'both' | null;
    lastChecked: number;
}