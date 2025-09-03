
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

