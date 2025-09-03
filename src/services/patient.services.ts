import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";
import {Prisma} from "@prisma/client";
import type {PatientDetails, Lifestyle, EmergencyContact} from "../types/application.js";

const prisma = new PrismaClient();

const getPatientWhereClause = (patient_id?: string, shc_code?: string, qr_code?: string): Prisma.patientsWhereUniqueInput => {
    if (patient_id) {
        return { patient_id: patient_id };
    }
    if (shc_code) {
        return { shc_code: shc_code };
    }
    if (qr_code) {
        return { qr_code: qr_code };
    }

    // If no identifier is provided, throw an error
    throw new Error("An identifier (patient_id, shc_code, or qr_code) must be provided.");
};

export const createPatient = async (patient:PatientDetails)=>{
            if(!patient || !patient.password){
                throw new Error("patient details were not received properly");
            }
            const { password, ...restOfDetails } = patient;
            const saltRounds =10;
            const password_hash = await bcrypt.hash(password, saltRounds);
            const newUser = await prisma.patients.create({
                data: {
                    ...restOfDetails,           // Spread the other details
                    date_of_birth: new Date(restOfDetails.date_of_birth),
                    password: password_hash, // Use the correct field name for the hash
                },
            });
            const token = jwt.sign(
                {
                    id: newUser.patient_id,
                    role: "patient",
                },
                process.env.JWT_SECRET!,
                { expiresIn: '24h' }
            );
            const { password: _, ...userWithoutPassword } = newUser;
            return { token, user: userWithoutPassword };
}

export const getPatientProfile = async(patient_id?: string, shc_code?:string, qr_code?:string)=>{
         let whereClause: Prisma.patientsWhereUniqueInput = getPatientWhereClause(patient_id, shc_code, qr_code);

         const patientProfile = await prisma.patients.findUnique({
             where: whereClause,
             // Select only the fields you want to return
             select: {
                 full_name: true,
                 email: true,
                 date_of_birth: true,
                 phone_no: true,
                 visibility:true,
                 shc_code:true,
                 qr_code: true,
                 photo: true,
             }
         });
         if(!patientProfile){
             console.log("User not found");
             throw new Error("User not found");
         }
         return patientProfile;
}

export const getPatientPersonalDetails = async(patient_id?: string, shc_code?:string, qr_code?:string) =>{
    let whereClause: Prisma.patientsWhereUniqueInput = getPatientWhereClause(patient_id, shc_code, qr_code);

        const patientPersonalDetails = await prisma.patients.findUnique({
            where: whereClause,
            // Select only the fields you want to return
            select: {
                full_name: true,
                photo: true,
                date_of_birth: true,
                gender: true,
                address: true,
                smoking: true,
                alcoholism: true,
                tobacco: true,
                pregnancy: true,
                exercise: true,
                others: true,
                allergy:true
            }
        });
        if(!patientPersonalDetails) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return patientPersonalDetails;
}

export const getPatientBasicDetails = async(patient_id?: string, shc_code?:string, qr_code?:string) => {
       let whereClause: Prisma.patientsWhereUniqueInput = getPatientWhereClause(patient_id, shc_code, qr_code);

        const patientBasicDetails = await prisma.patients.findUnique({
            where: whereClause,
            // Select only the fields you want to return
            select: {
                email: true,
                phone_no: true,
                photo: true
            }
        });
        if(!patientBasicDetails) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return patientBasicDetails;

}

export const getPatientEmergencyContacts = async(patient_id?: string, shc_code?:string, qr_code?:string) => {

    let whereClause: Prisma.patientsWhereUniqueInput = getPatientWhereClause(patient_id, shc_code, qr_code);

        const patientEmergencyContacts = await prisma.patients.findUnique({
            where: whereClause,
            // Select only the fields you want to return
            select: {
                patient_emergency_contacts:true
            }
        });
        if(!patientEmergencyContacts) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return patientEmergencyContacts;

}

export const getPatientDataLogs = async(patient_id?: string, shc_code?:string, qr_code?:string) => {

    let whereClause: Prisma.patientsWhereUniqueInput = getPatientWhereClause(patient_id, shc_code, qr_code);

        const patientDataLogs = await prisma.patients.findUnique({
            where: whereClause,
            // Select only the fields you want to return
            select: {
                data_logs:true
            }
        });

        if(!patientDataLogs) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return patientDataLogs;

}

export const updatePatientVisibility = async(curVisibility: boolean, patient_id: string)=> {

        let whereClause: Prisma.patientsWhereUniqueInput ;

        // 2. Conditionally build the where clause based on provided arguments
        if (patient_id) {
            whereClause = { patient_id: patient_id };
        } else {
            // 3. If no identifier is provided, throw an error
            throw new Error("An identifier (patient_id) must be provided.");
        }

        const updatedVisibility = await prisma.patients.update({
            where: whereClause,
            // Select only the fields you want to return
            data:{
                visibility: !curVisibility,
            },
            select: {
                visibility:true
            }
        });

        if(!updatedVisibility) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return updatedVisibility;

}

export const updatePatientPhoto =  async(newPhoto:string, patient_id: string)=> {

        let whereClause: Prisma.patientsWhereUniqueInput ;

        // 2. Conditionally build the where clause based on provided arguments
        if (patient_id) {
            whereClause = { patient_id: patient_id };
        } else {
            // 3. If no identifier is provided, throw an error
            throw new Error("An identifier (patient_id) must be provided.");
        }

        const updatedPhoto = await prisma.patients.update({
            where: whereClause,
            // Select only the fields you want to return
            data:{
                photo: newPhoto,
            },
            select: {
                photo: true
            }
        });

        if(!updatedPhoto) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return updatedPhoto;

}


export const updatePatientLifestyle = async(newLifestyle:Lifestyle, patient_id: string)=> {

        let whereClause: Prisma.patientsWhereUniqueInput ;
        // 2. Conditionally build the where clause based on provided arguments
        if (patient_id) {
            whereClause = { patient_id: patient_id };
        } else {
            // 3. If no identifier is provided, throw an error
            throw new Error("An identifier (patient_id) must be provided.");
        }
        if(newLifestyle){
            const updatedLifestyle = await prisma.patients.update({
                where: whereClause,
                // Select only the fields you want to return
                data:{
                    smoking: newLifestyle.smoking,
                    alcoholism: newLifestyle.alcoholism,
                    exercise: newLifestyle.exercise,
                    pregnancy: newLifestyle.pregnancy,
                    others: newLifestyle.others,
                    allergy: newLifestyle.allergy,
                    tobacco: newLifestyle.tobacco,
                },
                select: {
                    smoking:true,
                    alcoholism:true,
                    tobacco:true,
                    exercise:true,
                    pregnancy:true,
                    others:true,
                    allergy:true,
                }
            });
            if(!updatedLifestyle) {
                console.log("User not found");
                throw new Error("User not found");
            }
            return updatedLifestyle;
        }else{
            throw new Error("Lifestyle must be provided.");
        }

}

export const updatePatientEmail = async(newEmail:string, patient_id: string)=> {

        let whereClause: Prisma.patientsWhereUniqueInput ;
        // 2. Conditionally build the where clause based on provided arguments
        if (patient_id) {
            whereClause = { patient_id: patient_id };
        } else {
            // 3. If no identifier is provided, throw an error
            throw new Error("An identifier (patient_id) must be provided.");
        }
        if(newEmail){
            const updatedEmail = await prisma.patients.update({
                where: whereClause,
                data:{
                    email: newEmail,
                },
                select:{
                    email:true
                }
            })
            if(!updatedEmail) {
                console.log("User not found");
                throw new Error("User not found");
            }
            return updatedEmail;
        }
        else{
            throw new Error("Email id must be provided.");
        }

}

export const updatePatientPhoneNo = async(newPhoneNo:string, patient_id: string)=> {

        let whereClause: Prisma.patientsWhereUniqueInput ;
        // 2. Conditionally build the where clause based on provided arguments
        if (patient_id) {
            whereClause = { patient_id: patient_id };
        } else {
            // 3. If no identifier is provided, throw an error
            throw new Error("An identifier (patient_id) must be provided.");
        }
        if(newPhoneNo) {
            const updatedPhoneNo = await prisma.patients.update({
                where: whereClause,
                data:{
                    phone_no: newPhoneNo,
                },
                select:{
                    phone_no:true
                }
            })
            if(!updatedPhoneNo) {
                console.log("User not found");
                throw new Error("User not found");
            }
            return updatedPhoneNo;
        }
        else{
            throw new Error("Phone No must be provided.");
        }

}

export const updatePatientPassword = async(newPassword:string, patient_id: string)=> {

        if (!patient_id) {
            throw new Error("An identifier (patient_id) must be provided.");
        }
        if(newPassword) {
            const saltRounds =10;
            const password_hash = await bcrypt.hash(newPassword, saltRounds);
            const updatedPassword = await prisma.patients.update({
                where: {patient_id},
                data:{
                    password: password_hash,
                },
                select:{
                    full_name: true
                }
            })
            if(!updatedPassword) {
                console.log("User not found");
                throw new Error("User not found");
            }
            return true;
        }
        else{
            throw new Error("Password must be provided.");
        }

}

export const addPatientEmergencyContact = async(emergencyContact:EmergencyContact, patient_id:string)=>{
    if (!patient_id) {
        throw new Error("An identifier (patient_id) must be provided.");
    }

    const existingContactCount = await prisma.patient_emergency_contacts.count({
            where: {
                patient_id: patient_id
            }
        });
        //Throw error as the patient already has the limit of 3 emergency contacts
        if (existingContactCount >= 3) {
            throw new Error("Maximum limit of 3 emergency contacts reached.");
        }
        const newEmergencyContact = await prisma.patient_emergency_contacts.create({
            data: {
                patient_id: patient_id,
                full_name: emergencyContact.full_name,
                phone_no: emergencyContact.phone_no,
                relation: emergencyContact.relation
            },
            select:{
                full_name: true,
                phone_no: true,
                relation:true
            }
        });
        if(!newEmergencyContact) {
            throw new Error("Unable to add Emergency contact.");
        }
        return newEmergencyContact;
}

export const deletePatientEmergencyContact = async(patient_id: string, emg_id: string)=>{
    if (!patient_id || !emg_id) {
        throw new Error("An identifier (patient_id, emg_id) must be provided.");
    }
            const deletedContact = await prisma.patient_emergency_contacts.delete({
                where: { emg_id } // assuming emg_id is unique
            });
            // optional: verify deleted contact belongs to patient
            if (deletedContact.patient_id !== patient_id) {
                throw new Error("Unauthorized: contact does not belong to this patient");
            }
            return deletedContact;
}

