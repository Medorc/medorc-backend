
export interface PatientIdentifier{
    patient_id?: string ,
    shc_code?: string | undefined,
    qr_code?: string | undefined
}

export interface SearchOptions{
    entry_type:"All" |"Self" | "Hospital" | "Doctor",
    sort_by:"None" |"Diagnosis" | "Time Asc" | "Time Desc",
}

export interface PatientDetails {
    date_of_birth: Date,
    full_name: string,
    phone_no: string,
    photo: string,
    gender: string,
    email: string,
    password: string,
    address: string,
    allergy: string,
    smoking: boolean,
    alcoholism: boolean,
    tobacco: boolean,
    pregnancy: boolean,
    exercise: boolean,
}

export interface Lifestyle{
    smoking: boolean,
    alcoholism: boolean,
    tobacco: boolean,
    exercise: boolean,
    pregnancy: boolean,
    others: string,
    allergy: string,
}

export interface EmergencyContact{
    full_name:string,
    phone_no:string,
    relation:string
}

export interface BasicRecordDetails{
    doctor_id?:string ,
    hospital_id?:string,
    diagnosis_name: string,
    doctor_name: string,
    hospital_name: string,
    appointment_date: Date,
    reg_no: string,
    history_of_present_illness: string,
    treatment_undergone: string,
    alternative_system_of_medicine: string
}

export interface HospitalizationRecordDetails{
    room_no: string,
    reason_for_hospitalization: string,
    treatment_undergone: string,
    duration:string
}

export interface SurgeryRecordDetails{
    type: string,
    duration: string,
    bed_no: string,
    medical_condition: string,
    outcome: string
}

export interface Documents{
    prescription?: string,
    lab_results?: string
}

export interface Record{
    basicDetails:BasicRecordDetails,
    hospitalizationDetails?:HospitalizationRecordDetails,
    surgeryDetails?:SurgeryRecordDetails,
    documents?:Documents,
}

export interface DoctorDetails{
    full_name: string,
    date_of_birth: string,
    gender: string,
    email: string,
    photo: string,
    password: string,
    address: string,
    specializations: string,
    license_no: string,
    years_of_experience: number,
    hospital_affiliation: string,
    verification_documents: string
}

export interface DoctorProfileCredentials{
    license_no: string,
    years_of_experience: number,
    hospital_affiliation: string,
    specializations: string,
}

export interface HospitalDetails{
    name: string,
    photo: string,
    address:string,
    phone_no:string,
    email:string,
    password:string,
    license_no: string,
    website: string,
    license_valid_till:Date,
    type:string,
    founded_on : Date,
    verification_documents:string
}

export interface HospitalProfileCredentials{
    address: string,
    phone_no: string,
    website:string,
    type: string,
    founded_on: Date,
    license_no: string,
    license_valid_till:Date,
}

export interface OrganizationDetails{
    org_name:string,
    org_type: string,
    org_address:string,
    org_description: string,
    org_founded_on: string,
    org_website: string,
    org_license_no: string,
    org_license_valid_till: string,
}

export interface ExternDetails{
    full_name: string,
    date_of_birth: Date,
    gender: string,
    photo: string,
    phone_no: string,
    email: string,
    password: string,
    organization_details: OrganizationDetails,
    verification_documents: string
}