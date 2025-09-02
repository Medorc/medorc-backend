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