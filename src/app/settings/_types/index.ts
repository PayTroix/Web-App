/**
 * Settings Module Types
 */

export interface OrganizationData {
    id: number;
    name: string;
    email: string;
    organization_address: string;
    organization_phone?: string;
    website?: string;
    created_at: string;
    updated_at: string;
}

export interface OrganizationFormData extends Partial<OrganizationData> { }
