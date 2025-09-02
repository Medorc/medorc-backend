import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";
import {Prisma} from "@prisma/client";

const prisma = new PrismaClient();
interface patientDetails {
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

export const createPatient = async (patient:patientDetails)=>{
        try{
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
        catch (error){
            console.log(error);
            throw new Error("Failed to create user.");
        }
}

export const fetchProfile = async(patient_id?: string, shc_code?:string, qr_code?:string)=>{
     try{
         let whereClause: Prisma.patientsWhereUniqueInput ;

         // 2. Conditionally build the where clause based on provided arguments
         if (patient_id) {
             whereClause = { patient_id: patient_id };
         } else if (shc_code) {
             whereClause = { shc_code: shc_code };
         } else if (qr_code) {
             whereClause = { qr_code: qr_code };
         } else {
             // 3. If no identifier is provided, throw an error
             throw new Error("An identifier (patient_id, shc_code, or qr_code) must be provided.");
         }

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
     }catch (error){
         console.log(error);
         throw new Error("Failed to get profile");
     }
}

export const fetchPersonalDetails = async(patient_id?: string, shc_code?:string, qr_code?:string) =>{
    try{
        let whereClause: Prisma.patientsWhereUniqueInput ;

        // 2. Conditionally build the where clause based on provided arguments
        if (patient_id) {
            whereClause = { patient_id: patient_id };
        } else if (shc_code) {
            whereClause = { shc_code: shc_code };
        } else if (qr_code) {
            whereClause = { qr_code: qr_code };
        } else {
            // 3. If no identifier is provided, throw an error
            throw new Error("An identifier (patient_id, shc_code, or qr_code) must be provided.");
        }

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
    }catch (error){
        console.log(error);
        throw new Error("Failed to get profile");
    }
}

export const fetchBasicDetails = async(patient_id?: string, shc_code?:string, qr_code?:string) => {
    try{
        let whereClause: Prisma.patientsWhereUniqueInput ;

        // 2. Conditionally build the where clause based on provided arguments
        if (patient_id) {
            whereClause = { patient_id: patient_id };
        } else if (shc_code) {
            whereClause = { shc_code: shc_code };
        } else if (qr_code) {
            whereClause = { qr_code: qr_code };
        } else {
            // 3. If no identifier is provided, throw an error
            throw new Error("An identifier (patient_id, shc_code, or qr_code) must be provided.");
        }

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
    }catch (error){
        console.log(error);
        throw new Error("Failed to get profile");
    }
}

export const fetchEmergencyContacts = async(patient_id?: string, shc_code?:string, qr_code?:string) => {
    try{
        let whereClause: Prisma.patientsWhereUniqueInput ;

        // 2. Conditionally build the where clause based on provided arguments
        if (patient_id) {
            whereClause = { patient_id: patient_id };
        } else if (shc_code) {
            whereClause = { shc_code: shc_code };
        } else if (qr_code) {
            whereClause = { qr_code: qr_code };
        } else {
            // 3. If no identifier is provided, throw an error
            throw new Error("An identifier (patient_id, shc_code, or qr_code) must be provided.");
        }

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
    }catch (error){
        console.log(error);
        throw new Error("Failed to get profile");
    }
}

export const fetchDataLogs = async(patient_id?: string, shc_code?:string, qr_code?:string) => {
    try{
        let whereClause: Prisma.patientsWhereUniqueInput ;

        // 2. Conditionally build the where clause based on provided arguments
        if (patient_id) {
            whereClause = { patient_id: patient_id };
        } else if (shc_code) {
            whereClause = { shc_code: shc_code };
        } else if (qr_code) {
            whereClause = { qr_code: qr_code };
        } else {
            // 3. If no identifier is provided, throw an error
            throw new Error("An identifier (patient_id, shc_code, or qr_code) must be provided.");
        }

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
    }catch (error){
        console.log(error);
        throw new Error("Failed to get profile");
    }
}

export const toggleVisibility = async(curVisibility: boolean, patient_id: string)=> {
    try{
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
    catch(err){
        console.log("Unable to update visibility");
        throw new Error("Failed to update visibility");
    }
}

export const updatePhoto =  async(newPhoto:string, patient_id: string)=> {
    try{
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
    catch(err){
        console.log("Unable to update Photo");
        throw new Error("Failed to update Photo");
    }
}

interface lifestyle{
    smoking: boolean,
    alcoholism: boolean,
    tobacco: boolean,
    exercise: boolean,
    pregnancy: boolean,
    others: string,
    allergy: string,
}

export const updateLifestyle = async(newLifestyle:lifestyle, patient_id: string)=> {
    try{
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
    catch(err){
        console.log("Unable to update Lifestyle");
        throw new Error("Failed to update Lifestyle");
    }
}

export const updateEmail = async(newEmail:string, patient_id: string)=> {
    try{
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
    catch(err){
        console.log("Unable to update email");
        throw new Error("Failed to update email");
    }
}

export const updatePhoneNo = async(newPhoneNo:string, patient_id: string)=> {
    try{
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
    catch(err){
        console.log("Unable to update Phone no");
        throw new Error("Failed to update Phone no");
    }
}

export const updatePassword = async(newPassword:string, patient_id: string)=> {
    try{
        let whereClause: Prisma.patientsWhereUniqueInput ;
        // 2. Conditionally build the where clause based on provided arguments
        if (patient_id) {
            whereClause = { patient_id: patient_id };
        } else {
            // 3. If no identifier is provided, throw an error
            throw new Error("An identifier (patient_id) must be provided.");
        }
        if(newPassword) {
            const saltRounds =10;
            const password_hash = await bcrypt.hash(newPassword, saltRounds);
            const updatedPassword = await prisma.patients.update({
                where: whereClause,
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
    catch(err){
        console.log("Unable to update Password");
    }
}
interface emergencyContact{
    full_name:string,
    phone_no:string,
    relation:string
}

export const addEmergencyContact = async(emergencyContact:emergencyContact, patient_id:string)=>{
    try {
        const existingContactCount = await prisma.patient_emergency_contacts.count({
            where: {
                patient_id: patient_id
            }
        });
        //Throw error as the patient already has the limit of 3 emergency contacts
        if (existingContactCount >= 3) {
            throw new Error("Maximum limit of 3 emergency contacts reached.");
        }
        const newContact = await prisma.patient_emergency_contacts.create({
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
        return newContact;
    }catch(err){
        console.error("Unable to add EmergencyContact:", err);
        throw err; // rethrow original error
    }
}

export const deleteEmergencyContact = async(patient_id: string, emg_id: string)=>{
        try {
            const deletedContact = await prisma.patient_emergency_contacts.delete({
                where: { emg_id } // assuming emg_id is unique
            });
            // optional: verify deleted contact belongs to patient
            if (deletedContact.patient_id !== patient_id) {
                throw new Error("Unauthorized: contact does not belong to this patient");
            }
            return deletedContact;
        } catch (err) {
            console.error("Unable to delete EmergencyContact:", err);
            throw err;
        }
}