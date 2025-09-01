import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";

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