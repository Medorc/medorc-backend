import type { DoctorDetails, DoctorProfileCredentials } from "../types/application.js";
export declare const createDoctor: (doctor: DoctorDetails) => Promise<{
    token: string;
    user: {
        email: string | null;
        phone_no: string | null;
        full_name: string | null;
        gender: string | null;
        photo: string | null;
        date_of_birth: Date | null;
        address: string | null;
        doctor_id: string;
        specializations: string | null;
        license_no: string | null;
        years_of_experience: number | null;
        status: string | null;
        hospital_affiliation: string | null;
        verification_documents: string | null;
    };
}>;
export declare const getDoctorProfile: (doctor_id: string) => Promise<{
    email: string | null;
    phone_no: string | null;
    full_name: string | null;
    gender: string | null;
    photo: string | null;
    date_of_birth: Date | null;
    address: string | null;
    specializations: string | null;
    years_of_experience: number | null;
    hospital_affiliation: string | null;
}>;
export declare const getDoctorProfileCredentials: (doctor_id: string) => Promise<{
    specializations: string | null;
    license_no: string | null;
    years_of_experience: number | null;
    hospital_affiliation: string | null;
    verification_documents: string | null;
}>;
export declare const getDoctorBasicDetails: (doctor_id: string) => Promise<{
    email: string | null;
    phone_no: string | null;
    full_name: string | null;
    photo: string | null;
    specializations: string | null;
    years_of_experience: number | null;
}>;
export declare const updateDoctorProfileCredentials: (doctor_id: string, newCredentials: DoctorProfileCredentials) => Promise<{
    specializations: string | null;
    license_no: string | null;
    years_of_experience: number | null;
    hospital_affiliation: string | null;
}>;
export declare const updateDoctorVerificationDocument: (doctor_id: string, newDocument: string) => Promise<{
    full_name: string | null;
    verification_documents: string | null;
}>;
export declare const updateDoctorPhoto: (doctor_id: string, newPhoto: string) => Promise<{
    full_name: string | null;
    photo: string | null;
}>;
export declare const updateDoctorEmail: (doctor_id: string, newEmail: string) => Promise<{
    email: string | null;
    full_name: string | null;
}>;
export declare const updateDoctorPhone: (doctor_id: string, newPhone: string) => Promise<{
    phone_no: string | null;
    full_name: string | null;
}>;
export declare const updateDoctorPassword: (doctor_id: string, newPassword: string) => Promise<{
    full_name: string | null;
}>;
//# sourceMappingURL=doctor.services.d.ts.map