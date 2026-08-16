import type { ExternDetails, OrganizationDetails } from "../types/application.js";
export declare const createExtern: (extern: ExternDetails) => Promise<{
    token: string;
    user: {
        email: string | null;
        phone_no: string | null;
        full_name: string | null;
        gender: string | null;
        photo: string | null;
        date_of_birth: Date | null;
        verification_documents: string | null;
        viewer_id: string;
        org_type: string | null;
        org_name: string | null;
        org_address: string | null;
        org_description: string | null;
        org_founded_on: Date | null;
        org_website: string | null;
        org_license_no: string;
        org_license_valid_till: Date | null;
    };
}>;
export declare const getExternProfile: (viewer_id: string) => Promise<{
    email: string | null;
    full_name: string | null;
    photo: string | null;
    org_name: string | null;
}>;
export declare const getExternPersonalDetails: (viewer_id: string) => Promise<{
    full_name: string | null;
    gender: string | null;
    photo: string | null;
    date_of_birth: Date | null;
    org_address: string | null;
}>;
export declare const getExternOrganizationCredentials: (viewer_id: string) => Promise<{
    verification_documents: string | null;
    org_type: string | null;
    org_name: string | null;
    org_address: string | null;
    org_description: string | null;
    org_founded_on: Date | null;
    org_website: string | null;
    org_license_no: string;
    org_license_valid_till: Date | null;
}>;
export declare const getExternBasicDetails: (viewer_id: string) => Promise<{
    email: string | null;
    phone_no: string | null;
    full_name: string | null;
    photo: string | null;
}>;
export declare const updateExternOrganizationDetails: (viewer_id: string, newOrganisationDetails: OrganizationDetails) => Promise<{
    verification_documents: string | null;
    org_type: string | null;
    org_name: string | null;
    org_address: string | null;
    org_description: string | null;
    org_founded_on: Date | null;
    org_website: string | null;
    org_license_no: string;
    org_license_valid_till: Date | null;
}>;
export declare const updateExternVerificationDocuments: (viewer_id: string, newDocument: string) => Promise<{
    full_name: string | null;
    verification_documents: string | null;
}>;
export declare const updateExternPhoto: (viewer_id: string, newPhoto: string) => Promise<{
    full_name: string | null;
    photo: string | null;
}>;
export declare const updateExternEmail: (viewer_id: string, newEmail: string) => Promise<{
    email: string | null;
    full_name: string | null;
}>;
export declare const updateExternPhone: (viewer_id: string, newPhone: string) => Promise<{
    phone_no: string | null;
    full_name: string | null;
}>;
export declare const updateExternPassword: (viewer_id: string, newPassword: string) => Promise<{
    full_name: string | null;
}>;
//# sourceMappingURL=extern.services.d.ts.map