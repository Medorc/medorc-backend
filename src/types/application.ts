
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

