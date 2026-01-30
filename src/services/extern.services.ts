import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";
import type {DoctorProfileCredentials, ExternDetails, OrganizationDetails} from "../types/application.js";
import type {Request, Response} from "express";
import * as hospitalService from "./hospital.services.js";

const prisma = new PrismaClient();

export const createExtern = async (extern:ExternDetails)=>{
    if(!extern || !extern.password){
        throw new Error("patient details were not received properly");
    }
    const { password, organization_details,...restOfDetails } = extern;
    const saltRounds =10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.external_viewers.create({
        data: {
            ...restOfDetails,           // Spread the other details
            org_type:organization_details.org_type,
            org_name:organization_details.org_name,
            org_description:organization_details.org_description,
            org_founded_on: new Date(organization_details.org_founded_on),
            org_license_no: organization_details.org_license_no,
            org_license_valid_till: new Date(organization_details.org_license_valid_till),
            org_address: organization_details.org_address,
            org_website: organization_details.org_website,
            password: password_hash, // Use the correct field name for the hash
        },
    });
    const token = jwt.sign(
        {
            id: newUser.viewer_id,
            role: "extern",
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
    );
    const { password: _, ...userWithoutPassword } = newUser;
    return { token, user: userWithoutPassword };
}

export const getExternProfile = async(viewer_id:string)=>{
    if(!viewer_id){
        throw new Error("viewer id were not received properly");
    }

    const externProfile = await prisma.external_viewers.findUnique({
        where: {viewer_id: viewer_id},
        // Select only the fields you want to return
        select: {
            email:true,
            full_name:true,
            photo:true,
            org_name:true,
        }
    });
    if(!externProfile){
        console.log("User not found");
        throw new Error("User not found");
    }
    return externProfile;
}

export const getExternPersonalDetails = async(viewer_id:string)=>{
    if(!viewer_id){
        throw new Error("viewer id were not received properly");
    }

    const externPersonalDetails = await prisma.external_viewers.findUnique({
        where: {viewer_id: viewer_id},
        // Select only the fields you want to return
        select: {
            full_name:true,
            date_of_birth:true,
            gender:true,
            org_address:true,
        }
    });
    if(!externPersonalDetails){
        console.log("User not found");
        throw new Error("User not found");
    }
    return externPersonalDetails;
}

export const getExternOrganizationCredentials = async(viewer_id:string)=>{
    if(!viewer_id){
        throw new Error("viewer id were not received properly");
    }

    const externOrganizationCredentials = await prisma.external_viewers.findUnique({
        where: {viewer_id: viewer_id},
        // Select only the fields you want to return
        select: {
            org_name:true,
            org_description:true,
            org_type:true,
            org_address:true,
            org_website:true,
            org_founded_on:true,
            org_license_no:true,
            org_license_valid_till:true,
            verification_documents:true,
        }
    });
    if(!externOrganizationCredentials){
        console.log("User not found");
        throw new Error("User not found");
    }
    return externOrganizationCredentials;
}

export const getExternBasicDetails = async(viewer_id:string)=>{
    if(!viewer_id){
        throw new Error("viewer id were not received properly");
    }

    const externBasicDetails = await prisma.external_viewers.findUnique({
        where: {viewer_id: viewer_id},
        // Select only the fields you want to return
        select: {
            email:true,
            phone_no:true,
            photo:true,

        }
    });
    if(!externBasicDetails){
        console.log("User not found");
        throw new Error("User not found");
    }
    return externBasicDetails;
}

export const updateExternOrganizationDetails = async(viewer_id:string, newOrganisationDetails:OrganizationDetails)=>{
    if(!viewer_id || !newOrganisationDetails){
        throw new Error("Viewer id & organization details were not received properly");
    }
    const updatedOrganisationDetails = await prisma.external_viewers.update({
        where:{viewer_id: viewer_id},
        data:{
            ...newOrganisationDetails,
        },
        select:{
            org_name:true,
            org_description:true,
            org_type:true,
            org_address:true,
            org_website:true,
            org_founded_on:true,
            org_license_no:true,
            org_license_valid_till:true,
            verification_documents:true,
        }
    });
    if(!updatedOrganisationDetails){
        throw new Error("Extern not found");
    }
    return updatedOrganisationDetails;
}

export const updateExternVerificationDocuments = async(viewer_id:string, newDocument: string)=>{
    if(!viewer_id && !newDocument){
        throw new Error("Viewer Id & document were not received properly");
    }

    const updatedDetails = await prisma.external_viewers.update({
        where: {viewer_id: viewer_id},
        // Select only the fields you want to return
        data: {
            verification_documents:newDocument,
        },
        select:{
            full_name:true,
            verification_documents:true,
        }
    });
    if(!updatedDetails){
        console.log("User not found");
        throw new Error("User not found");
    }
    return updatedDetails;
}

export const updateExternPhoto = async(viewer_id:string, newPhoto: string)=>{
    if(!viewer_id || !newPhoto){
        throw new Error("Extern id & new Photo were not received properly");
    }
    const updatedDetails = await prisma.external_viewers.update({
        where:{viewer_id: viewer_id},
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

export const updateExternEmail = async(viewer_id:string, newEmail: string)=>{
    if(!viewer_id || !newEmail){
        throw new Error("Doctor id & new Email were not received properly");
    }
    const updatedDetails = await prisma.external_viewers.update({
        where:{viewer_id: viewer_id},
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

export const updateExternPhone = async(viewer_id:string, newPhone: string)=>{
    if(!viewer_id || !newPhone){
        throw new Error("Doctor id & new Phone were not received properly");
    }
    const updatedDetails = await prisma.external_viewers.update({
        where:{viewer_id: viewer_id},
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

export const updateExternPassword = async(viewer_id:string, newPassword: string)=>{
    if(!viewer_id || !newPassword){
        throw new Error("Extern id & new Password were not received properly");
    }
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);
    const updatedDetails = await prisma.external_viewers.update({
        where:{viewer_id: viewer_id},
        data:{
            password:password_hash
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
