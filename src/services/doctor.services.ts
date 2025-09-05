import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";
import type {DoctorDetails, DoctorProfileCredentials} from "../types/application.js";

const prisma = new PrismaClient();

export const createDoctor = async (doctor:DoctorDetails)=>{
    if(!doctor || !doctor.password){
        throw new Error("doctor details were not received properly");
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

export const getDoctorProfile = async(doctor_id:string)=>{
      if(!doctor_id){
          throw new Error("Doctor id were not received properly");
      }

    const doctorProfile = await prisma.doctors.findUnique({
        where: {doctor_id: doctor_id},
        // Select only the fields you want to return
        select: {
            email:true,
            phone_no:true,
            full_name:true,
            date_of_birth:true,
            gender:true,
            photo:true,
            hospital_affiliation:true,
            address:true,
        }
    });
    if(!doctorProfile){
        console.log("User not found");
        throw new Error("User not found");
    }
    return doctorProfile;
}

export const getDoctorProfileCredentials = async(doctor_id:string)=>{
    if(!doctor_id){
        throw new Error("Doctor id were not received properly");
    }

    const doctorProfileCredentials = await prisma.doctors.findUnique({
        where: {doctor_id: doctor_id},
        // Select only the fields you want to return
        select: {
           license_no:true,
            years_of_experience:true,
            specializations:true,
            verification_documents:true
        }
    });
    if(!doctorProfileCredentials){
        console.log("User not found");
        throw new Error("User not found");
    }
    return doctorProfileCredentials;
}

export const getDoctorBasicDetails = async(doctor_id:string)=>{
    if(!doctor_id){
        throw new Error("Doctor id were not received properly");
    }
    const doctorBasicDetails = await prisma.doctors.findUnique({
        where: {doctor_id: doctor_id},
        // Select only the fields you want to return
        select: {
            photo:true,
            email:true,
            phone_no:true,
        }
    });
    if(!doctorBasicDetails){
        console.log("User not found");
        throw new Error("User not found");
    }
    return doctorBasicDetails;
}

export const updateDoctorProfileCredentials = async(doctor_id:string, newCredentials: DoctorProfileCredentials)=>{
    if(!doctor_id || !newCredentials){
        throw new Error("Doctor id & credentials were not received properly");
    }
    const updatedCredentials = await prisma.doctors.update({
        where:{doctor_id: doctor_id},
        data:{
            ...newCredentials,
        },
        select:{
            license_no:true,
            years_of_experience:true,
            specializations:true,
            hospital_affiliation:true
        }
    });
    if(!updatedCredentials){
        throw new Error("Doctor not found");
    }
    return updatedCredentials;
}

export const updateDoctorVerificationDocument = async(doctor_id:string, newDocument: string)=>{
    if(!doctor_id || !newDocument){
        throw new Error("Doctor id & new document were not received properly");
    }
    const updatedDetails = await prisma.doctors.update({
        where:{doctor_id: doctor_id},
        data:{
            verification_documents:newDocument
        },
        select:{
            full_name:true,
            verification_documents:true,
        }
    });
    if(!updatedDetails){
        throw new Error("Doctor not found");
    }
    return updatedDetails;
}

export const updateDoctorPhoto = async(doctor_id:string, newPhoto: string)=>{
    if(!doctor_id || !newPhoto){
        throw new Error("Doctor id & new Photo were not received properly");
    }
    const updatedDetails = await prisma.doctors.update({
        where:{doctor_id: doctor_id},
        data:{
            photo:newPhoto
        },
        select:{
            full_name:true,
            photo:true,
        }
    });
    if(!updatedDetails){
        throw new Error("Doctor not found");
    }
    return updatedDetails;
}

export const updateDoctorEmail = async(doctor_id:string, newEmail: string)=>{
    if(!doctor_id || !newEmail){
        throw new Error("Doctor id & new Email were not received properly");
    }
    const updatedDetails = await prisma.doctors.update({
        where:{doctor_id: doctor_id},
        data:{
            email:newEmail
        },
        select:{
            full_name:true,
            email:true,
        }
    });
    if(!updatedDetails){
        throw new Error("Doctor not found");
    }
    return updatedDetails;
}

export const updateDoctorPhone = async(doctor_id:string, newPhone: string)=>{
    if(!doctor_id || !newPhone){
        throw new Error("Doctor id & new Phone were not received properly");
    }
    const updatedDetails = await prisma.doctors.update({
        where:{doctor_id: doctor_id},
        data:{
            phone_no:newPhone
        },
        select:{
            full_name:true,
            phone_no:true,
        }
    });
    if(!updatedDetails){
        throw new Error("Doctor not found");
    }
    return updatedDetails;
}

export const updateDoctorPassword = async(doctor_id:string, newPassword: string)=>{
    if(!doctor_id || !newPassword){
        throw new Error("Doctor id & new Password were not received properly");
    }
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);
    const updatedDetails = await prisma.doctors.update({
        where:{doctor_id: doctor_id},
        data:{
            phone_no:password_hash
        },
        select:{
            full_name:true,
        }
    });
    if(!updatedDetails){
        throw new Error("Doctor not found");
    }
    return updatedDetails;
}