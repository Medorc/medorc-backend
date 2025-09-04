import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from 'jsonwebtoken';
import {PrismaClient} from "@prisma/client";
import {Prisma} from "@prisma/client";
import type {HospitalDetails} from "../types/application.js";

const prisma = new PrismaClient();

export const createHospital = async (hospital:HospitalDetails)=>{
    if(!hospital || !hospital.password){
        throw new Error("patient details were not received properly");
    }
    const { password, ...restOfDetails } = hospital;
    const saltRounds =10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.hospitals.create({
        data: {
            ...restOfDetails,           // Spread the other details
            founded_on: new Date(restOfDetails.founded_on),
            license_valid_till: new Date(restOfDetails.license_valid_till),
            password: password_hash, // Use the correct field name for the hash
        },
    });
    const token = jwt.sign(
        {
            id: newUser.hospital_id,
            role: "hospital",
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
    );
    const { password: _, ...userWithoutPassword } = newUser;
    return { token, user: userWithoutPassword };
}