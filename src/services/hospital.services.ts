import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from 'jsonwebtoken';
import {PrismaClient} from "@prisma/client";
import {Prisma} from "@prisma/client";
import type {HospitalDetails, HospitalProfileCredentials} from "../types/application.js";

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

export const getHospitalProfile = async(hospital_id:string)=>{
    if(!hospital_id){
        throw new Error("Hospital id were not received properly");
    }

    const hospitalProfile = await prisma.hospitals.findUnique({
        where: {hospital_id: hospital_id},
        // Select only the fields you want to return
        select: {
            email:true,
            name:true,
            photo:true,
        }
    });
    if(!hospitalProfile){
        console.log("User not found");
        throw new Error("User not found");
    }
    return hospitalProfile;
}

export const getHospitalProfileCredentials = async(hospital_id:string)=>{
    if(!hospital_id){
        throw new Error("Hospital id were not received properly");
    }

    const hospitalProfileCredentials = await prisma.hospitals.findUnique({
        where: {hospital_id: hospital_id},
        // Select only the fields you want to return
        select: {
            license_no:true,
            address:true,
            phone_no:true,
            website:true,
            license_valid_till:true,
            type:true,
            founded_on:true,
            verification_documents:true,
        }
    });
    if(!hospitalProfileCredentials){
        console.log("User not found");
        throw new Error("User not found");
    }
    return hospitalProfileCredentials;
}

export const updateHospitalProfileCredentials = async(hospital_id:string, newCredentials: HospitalProfileCredentials)=>{
    if(!hospital_id && !newCredentials){
        throw new Error("Hospital id & credentials were not received properly");
    }
    const {founded_on, license_valid_till, ...restOftheDetails} = newCredentials;

    const updatedCredentials = await prisma.hospitals.update({
        where: {hospital_id: hospital_id},
        // Select only the fields you want to return
        data: {
            founded_on: new Date(founded_on),
            license_valid_till: new Date(license_valid_till),
            ...restOftheDetails,
        }
    });
    if(!updatedCredentials){
        console.log("User not found");
        throw new Error("User not found");
    }
    return updatedCredentials;
}

export const updateHospitalVerificationDocuments = async(hospital_id:string, newDocument: string)=>{
    if(!hospital_id && !newDocument){
        throw new Error("Hospital id & credentials were not received properly");
    }

    const updatedDetails = await prisma.hospitals.update({
        where: {hospital_id: hospital_id},
        // Select only the fields you want to return
        data: {
            verification_documents:newDocument,
        },
        select:{
            name:true,
            verification_documents:true,
        }
    });
    if(!updatedDetails){
        console.log("User not found");
        throw new Error("User not found");
    }
    return updatedDetails;
}

export const updateHospitalPhoto = async(hospital_id:string, newPhoto: string)=>{
    if(!hospital_id && !newPhoto){
        throw new Error("Hospital id & photo were not received properly");
    }

    const updatedDetails = await prisma.hospitals.update({
        where: {hospital_id: hospital_id},
        // Select only the fields you want to return
        data: {
            photo:newPhoto,
        },
        select:{
            name:true,
            photo:true,
        }
    });
    if(!updatedDetails){
        console.log("User not found");
        throw new Error("User not found");
    }
    return updatedDetails;
}

export const updateHospitalEmail = async(hospital_id:string, newEmail: string)=>{
    if(!hospital_id && !newEmail){
        throw new Error("Hospital id & email were not received properly");
    }

    const updatedDetails = await prisma.hospitals.update({
        where: {hospital_id: hospital_id},
        // Select only the fields you want to return
        data: {
            email:newEmail,
        },
        select:{
            name:true,
           email:true,
        }
    });
    if(!updatedDetails){
        console.log("User not found");
        throw new Error("User not found");
    }
    return updatedDetails;
}

export const updateHospitalPhone = async(hospital_id:string, newPhone: string)=>{
    if(!hospital_id && !newPhone){
        throw new Error("Hospital id & phone were not received properly");
    }

    const updatedDetails = await prisma.hospitals.update({
        where: {hospital_id: hospital_id},
        // Select only the fields you want to return
        data: {
            phone_no:newPhone,
        },
        select:{
            name:true,
            phone_no:true,
        }
    });
    if(!updatedDetails){
        console.log("User not found");
        throw new Error("User not found");
    }
    return updatedDetails;
}

export const updateHospitalPassword = async(hospital_id:string, newPassword: string)=>{
    if(!hospital_id && !newPassword){
        throw new Error("Hospital id & password were not received properly");
    }
    const saltRounds=10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);
    const updatedDetails = await prisma.hospitals.update({
        where: {hospital_id: hospital_id},
        // Select only the fields you want to return
        data: {
            password:password_hash
        },
        select:{
            name:true,
        }
    });
    if(!updatedDetails){
        console.log("User not found");
        throw new Error("User not found");
    }
    return updatedDetails;
}