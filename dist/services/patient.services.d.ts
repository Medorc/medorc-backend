import type { JwtPayload } from 'jsonwebtoken';
import type { PatientDetails, Lifestyle, EmergencyContact, Record, PatientIdentifier, HospitalizationRecordDetails, SurgeryRecordDetails, SearchOptions } from "../types/application.js";
export declare const createPatient: (patient: PatientDetails) => Promise<{
    token: string;
    user: {
        patient_id: string;
        email: string;
        shc_code: string;
        qr_code: string;
        phone_no: string | null;
        visibility: boolean | null;
        full_name: string | null;
        gender: string | null;
        blood_group: string | null;
        photo: string | null;
        date_of_birth: Date | null;
        address: string | null;
        smoking: boolean | null;
        alcoholism: boolean | null;
        tobacco: boolean | null;
        others: string | null;
        pregnancy: boolean | null;
        exercise: boolean | null;
        allergy: string | null;
        data_logs: string | null;
    };
}>;
export declare const getPatientProfile: (patient_id?: string, shc_code?: string, qr_code?: string) => Promise<{
    role: string;
    email: string;
    shc_code: string;
    qr_code: string;
    phone_no: string | null;
    visibility: boolean | null;
    full_name: string | null;
    gender: string | null;
    blood_group: string | null;
    photo: string | null;
    date_of_birth: Date | null;
}>;
export declare const getPatientPersonalDetails: (patient_id?: string, shc_code?: string, qr_code?: string) => Promise<{
    full_name: string | null;
    gender: string | null;
    blood_group: string | null;
    photo: string | null;
    date_of_birth: Date | null;
    address: string | null;
    smoking: boolean | null;
    alcoholism: boolean | null;
    tobacco: boolean | null;
    others: string | null;
    pregnancy: boolean | null;
    exercise: boolean | null;
    allergy: string | null;
}>;
export declare const getPatientBasicDetails: (patient_id?: string, shc_code?: string, qr_code?: string) => Promise<{
    email: string;
    shc_code: string;
    qr_code: string;
    phone_no: string | null;
    visibility: boolean | null;
    full_name: string | null;
    gender: string | null;
    blood_group: string | null;
    photo: string | null;
    date_of_birth: Date | null;
    address: string | null;
    smoking: boolean | null;
    alcoholism: boolean | null;
    exercise: boolean | null;
    allergy: string | null;
}>;
export declare const getPatientEmergencyContacts: (patientIdentifier: PatientIdentifier) => Promise<{
    patient_emergency_contacts: {
        patient_id: string;
        phone_no: string | null;
        full_name: string | null;
        emg_id: string;
        relation: string | null;
    }[];
}>;
export declare const getPatientDataLogs: (patientIdentifier: PatientIdentifier) => Promise<{
    data_logs: string | null;
}>;
export declare const updatePatientVisibility: (curVisibility: boolean, patient_id: string) => Promise<{
    visibility: boolean | null;
}>;
export declare const updatePatientPhoto: (newPhoto: string, patient_id: string) => Promise<{
    photo: string | null;
}>;
export declare const updatePatientLifestyle: (newLifestyle: Lifestyle, patient_id: string) => Promise<{
    smoking: boolean | null;
    alcoholism: boolean | null;
    tobacco: boolean | null;
    others: string | null;
    pregnancy: boolean | null;
    exercise: boolean | null;
    allergy: string | null;
}>;
export declare const updatePatientPersonalDetails: (newPersonalDetails: Partial<PatientDetails>, patient_id: string) => Promise<{
    full_name: string | null;
    gender: string | null;
    blood_group: string | null;
    photo: string | null;
    date_of_birth: Date | null;
    address: string | null;
}>;
export declare const updatePatientEmail: (newEmail: string, patient_id: string) => Promise<{
    email: string;
}>;
export declare const updatePatientPhoneNo: (newPhoneNo: string, patient_id: string) => Promise<{
    phone_no: string | null;
}>;
export declare const updatePatientPassword: (newPassword: string, patient_id: string) => Promise<boolean>;
export declare const addPatientEmergencyContact: (emergencyContact: EmergencyContact, patient_id: string) => Promise<{
    phone_no: string | null;
    full_name: string | null;
    relation: string | null;
}>;
export declare const deletePatientEmergencyContact: (patient_id: string, emg_id: string) => Promise<{
    patient_id: string;
    phone_no: string | null;
    full_name: string | null;
    emg_id: string;
    relation: string | null;
}>;
export declare const getVisitorDisplayName: (id: string, role: string) => Promise<string>;
export declare const addPatientDataLog: (patientIdentifier: PatientIdentifier, newLogEntry: string) => Promise<void>;
export declare const createPatientRecord: (patientIdentifier: PatientIdentifier, record: Record, creatorPayload: JwtPayload | string) => Promise<{
    record_id: string;
}>;
export declare const addPatientHospitalizationDetails: (record_id: string, hospitalizationDetails: HospitalizationRecordDetails) => Promise<{
    record_id: string;
    treatment_undergone: string | null;
    id: string;
    duration: string | null;
    reason: string | null;
    room_no: string | null;
}>;
export declare const addPatientSurgeryDetails: (record_id: string, surgeryDetails: SurgeryRecordDetails) => Promise<{
    type: string | null;
    record_id: string;
    id: string;
    duration: string | null;
    outcome: string | null;
    medical_condition: string | null;
    bed_no: string | null;
}>;
export declare const addPatientPrescription: (record_id: string, prescription_url: string) => Promise<{
    record_id: string;
    created_at: Date | null;
    updated_at: Date | null;
    doc_id: string;
    prescriptions: string | null;
    lab_results: string | null;
}>;
export declare const removePatientPrescription: (record_id: string) => Promise<{
    record_id: string;
    created_at: Date | null;
    updated_at: Date | null;
    doc_id: string;
    prescriptions: string | null;
    lab_results: string | null;
}>;
export declare const addPatientLabResults: (record_id: string, lab_results_url: string) => Promise<{
    record_id: string;
    created_at: Date | null;
    updated_at: Date | null;
    doc_id: string;
    prescriptions: string | null;
    lab_results: string | null;
}>;
export declare const removePatientLabResults: (record_id: string) => Promise<{
    record_id: string;
    created_at: Date | null;
    updated_at: Date | null;
    doc_id: string;
    prescriptions: string | null;
    lab_results: string | null;
}>;
export declare const updatePatientRecordVisibility: (record_id: string, curVisibility: boolean) => Promise<{
    visibility: boolean | null;
    record_id: string;
}>;
export declare const getPatientRecords: (patientIdentifier: PatientIdentifier, searchOptions: SearchOptions, userRole: string, searchQuery?: string) => Promise<{
    record_id: string;
    doctor_id: string | null;
    doctor_name: string;
    hospital_id: string | null;
    hospital_name: string;
    created_at: Date | null;
    updated_at: Date | null;
    entry_type: string | null;
    diagnosis_name: string | null;
    treatment_undergone: string | null;
    visibility: boolean | null;
    history_of_present_illness: string | null;
    is_hospitalized: boolean;
    is_surgery: boolean;
    document_count: number;
    appointment_date: Date | null;
    reg_no: string | null;
    doctor: {
        email: string | null;
        phone_no: string | null;
        full_name: string | null;
        photo: string | null;
        specializations: string | null;
    } | null;
    hospital: {
        email: string | null;
        phone_no: string | null;
        photo: string | null;
        address: string | null;
        name: string | null;
        website: string | null;
    } | null;
    patient: {
        email: string;
        phone_no: string | null;
        full_name: string | null;
        photo: string | null;
    };
}[]>;
export declare const getPatientSurgeryDetails: (record_id: string) => Promise<{
    type: string | null;
    record_id: string;
    id: string;
    duration: string | null;
    outcome: string | null;
    medical_condition: string | null;
    bed_no: string | null;
} | null>;
export declare const getPatientHospitalizationDetails: (record_id: string) => Promise<{
    record_id: string;
    treatment_undergone: string | null;
    id: string;
    duration: string | null;
    reason: string | null;
    room_no: string | null;
} | null>;
export declare const getPatientDocuments: (record_id: string) => Promise<{
    record_id: string;
    created_at: Date | null;
    updated_at: Date | null;
    doc_id: string;
    prescriptions: string | null;
    lab_results: string | null;
} | null>;
//# sourceMappingURL=patient.services.d.ts.map