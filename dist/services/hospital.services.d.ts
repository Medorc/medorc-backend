import type { HospitalDetails, HospitalProfileCredentials } from "../types/application.js";
export declare const createHospital: (hospital: HospitalDetails) => Promise<{
    token: string;
    user: {
        email: string | null;
        phone_no: string | null;
        photo: string | null;
        address: string | null;
        name: string | null;
        license_no: string;
        verification_documents: string | null;
        hospital_id: string;
        website: string | null;
        license_valid_till: Date | null;
        type: string | null;
        founded_on: Date | null;
    };
}>;
export declare const getHospitalProfile: (hospital_id: string) => Promise<{
    email: string | null;
    photo: string | null;
    name: string | null;
}>;
export declare const getHospitalDetails: (hospital_id: string) => Promise<{
    email: string | null;
    phone_no: string | null;
    photo: string | null;
    address: string | null;
    name: string | null;
}>;
export declare const getHospitalProfileCredentials: (hospital_id: string) => Promise<{
    phone_no: string | null;
    address: string | null;
    license_no: string;
    verification_documents: string | null;
    website: string | null;
    license_valid_till: Date | null;
    type: string | null;
    founded_on: Date | null;
}>;
export declare const updateHospitalProfileCredentials: (hospital_id: string, newCredentials: HospitalProfileCredentials) => Promise<{
    email: string | null;
    password: string | null;
    phone_no: string | null;
    photo: string | null;
    address: string | null;
    name: string | null;
    license_no: string;
    verification_documents: string | null;
    hospital_id: string;
    website: string | null;
    license_valid_till: Date | null;
    type: string | null;
    founded_on: Date | null;
}>;
export declare const updateHospitalVerificationDocuments: (hospital_id: string, newDocument: string) => Promise<{
    name: string | null;
    verification_documents: string | null;
}>;
export declare const updateHospitalPhoto: (hospital_id: string, newPhoto: string) => Promise<{
    photo: string | null;
    name: string | null;
}>;
export declare const updateHospitalEmail: (hospital_id: string, newEmail: string) => Promise<{
    email: string | null;
    name: string | null;
}>;
export declare const updateHospitalPhone: (hospital_id: string, newPhone: string) => Promise<{
    phone_no: string | null;
    name: string | null;
}>;
export declare const updateHospitalPassword: (hospital_id: string, newPassword: string) => Promise<{
    name: string | null;
}>;
//# sourceMappingURL=hospital.services.d.ts.map