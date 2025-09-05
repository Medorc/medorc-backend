import {type Request, type Response} from 'express';
import * as doctorService from "../../services/doctor.services.js";
import type {DoctorProfileCredentials} from "../../types/application.js";


export const handleGetDoctorProfile = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        let doctorProfile;
        if(userPayload.role =="doctor"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            doctorProfile = await doctorService.getDoctorProfile(userId);
        }
        else if(["patient", "hospital", "extern"].includes(userPayload.role)){
            const userId = req.body.doctor_id;
            if(!userId){return res.status(400).json({ error: "Doctor id must be provided" });}
            doctorProfile = await doctorService.getDoctorProfile(userId);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"doctor profile retrieved successfully",data:doctorProfile});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while retriving profile .' });
    }
}

export const handleGetDoctorProfileCredentials = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        let doctorProfileCredentials;
        if(userPayload.role =="doctor"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            doctorProfileCredentials = await doctorService.getDoctorProfileCredentials(userId);
        }
        else if(["patient", "hospital", "extern"].includes(userPayload.role)){
            const userId = req.body.doctor_id;
            if(!userId){return res.status(400).json({ error: "Doctor id must be provided" });}
            doctorProfileCredentials = await doctorService.getDoctorProfileCredentials(userId);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"doctor profile credentials retrieved successfully",data:doctorProfileCredentials});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while retriving profile credentials .' });
    }
}

export const handleGetDoctorBasicDetails = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        if (!userPayload.id) {
            return res.status(400).json({ error: "User ID missing in token." });
        }
        if(userPayload.role !="doctor"){
            return res.status(400).json({ error: "Unauthorized role." });
        }
        const userId = String(userPayload.id);
        const doctorBasicDetails= await doctorService.getDoctorBasicDetails(userId);
        return res.status(200).json({message:"doctor basic details retrieved successfully", data:doctorBasicDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while retriving basic details .' });
    }
}

export const handleUpdateDoctorProfileCredentials = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        if (!userPayload.id) {
            return res.status(400).json({ error: "User ID missing in token." });
        }
        if(userPayload.role !="doctor"){
            return res.status(400).json({ error: "Unauthorized role." });
        }
        const userId = String(userPayload.id);
        const newcredentials: DoctorProfileCredentials = req.body.newCredentials;
        if(!newcredentials){res.status(400).json({ error: "Credentials not provided correctly" });}
        const updatedCredentials= await doctorService.updateDoctorProfileCredentials(userId,newcredentials);
        return res.status(200).json({message:"doctor profile credentials updated successfully ", data:updatedCredentials});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating profile credentials .' });
    }
}

export const handleUpdateDoctorVerificationDocument = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        if (!userPayload.id) {
            return res.status(400).json({ error: "User ID missing in token." });
        }
        if(userPayload.role !="doctor"){
            return res.status(400).json({ error: "Unauthorized role." });
        }
        const userId = String(userPayload.id);
        const newDocument :string= req.body.newDocument;
        if(!newDocument){res.status(400).json({ error: "Document url not provided correctly" });}
        const updatedDetails= await doctorService.updateDoctorVerificationDocument(userId,newDocument);
        return res.status(200).json({message:"doctor profile credentials updated successfully ", data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating Verification documents .' });
    }
}

export const handleUpdateDoctorPhoto = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        if (!userPayload.id) {
            return res.status(400).json({ error: "User ID missing in token." });
        }
        if(userPayload.role !="doctor"){
            return res.status(400).json({ error: "Unauthorized role." });
        }
        const userId = String(userPayload.id);
        const newPhoto :string= req.body.newPhoto;
        if(!newPhoto){res.status(400).json({ error: "Photo url not provided correctly" });}
        const updatedDetails= await doctorService.updateDoctorPhoto(userId,newPhoto);
        return res.status(200).json({message:"doctor photo updated successfully ", data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating photo.' });
    }
}

export const handleUpdateDoctorEmail = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        if (!userPayload.id) {
            return res.status(400).json({ error: "User ID missing in token." });
        }
        if(userPayload.role !="doctor"){
            return res.status(400).json({ error: "Unauthorized role." });
        }
        const userId = String(userPayload.id);
        const newEmail :string= req.body.newEmail;
        //console.log(newEmail);
        if(!newEmail){res.status(400).json({ error: "Email not provided correctly" });}
        const updatedDetails= await doctorService.updateDoctorEmail(userId,newEmail);
        return res.status(200).json({message:"doctor email updated successfully ", data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating Email.' });
    }
}

export const handleUpdateDoctorPhone = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        if (!userPayload.id) {
            return res.status(400).json({ error: "User ID missing in token." });
        }
        if(userPayload.role !="doctor"){
            return res.status(400).json({ error: "Unauthorized role." });
        }
        const userId = String(userPayload.id);
        const newPhone :string= req.body.newPhone;
        if(!newPhone){res.status(400).json({ error: "Phone not provided correctly" });}
        const updatedDetails= await doctorService.updateDoctorPhone(userId,newPhone);
        return res.status(200).json({message:"doctor phone updated successfully ", data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating Email.' });
    }
}

export const handleUpdateDoctorPassword = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        if (!userPayload.id) {
            return res.status(400).json({ error: "User ID missing in token." });
        }
        if(userPayload.role !="doctor"){
            return res.status(400).json({ error: "Unauthorized role." });
        }
        const userId = String(userPayload.id);
        const newPassword :string= req.body.newPassword;
        if(!newPassword){res.status(400).json({ error: "Password not provided correctly" });}
        const updatedDetails= await doctorService.updateDoctorPassword(userId,newPassword);
        return res.status(200).json({message:"doctor password updated successfully ", data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating Email.' });
    }
}