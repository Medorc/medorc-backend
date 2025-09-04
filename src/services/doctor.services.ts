import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from 'jsonwebtoken';
import {PrismaClient} from "@prisma/client";
import {Prisma} from "@prisma/client";
import type {DoctorDetails} from "../types/application.js";

const prisma = new PrismaClient();

export const createDoctor = async (doctor:DoctorDetails)=>{
    if(!doctor || !doctor.password){
        throw new Error("patient details were not received properly");
    }
    const { password, ...restOfDetails } = doctor;
    const saltRounds =10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.doctors.create({
        data: {
            ...restOfDetails,           // Spread the other details
            date_of_birth: new Date(restOfDetails.date_of_birth),
            password: password_hash, // Use the correct field name for the hash
        },
    });
    const token = jwt.sign(
        {
            id: newUser.doctor_id,
            role: "doctor",
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
    );
    const { password: _, ...userWithoutPassword } = newUser;
    return { token, user: userWithoutPassword };
}