import {type Request, type Response} from 'express';
import * as hospitalService from "../../services/hospital.services.js";
import * as doctorService from "../../services/doctor.services.js";
import type {HospitalProfileCredentials} from "../../types/application.js";

export const handleGetHospitalProfile = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        let hospitalProfile;
        if(userPayload.role =="hospital"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            hospitalProfile = await hospitalService.getHospitalProfile(userId);
        }
        else if(["patient", "doctor", "extern"].includes(userPayload.role)){
            const userId = req.body.hospital_id;
            if(!userId){return res.status(400).json({ error: "Doctor id must be provided" });}
            hospitalProfile = await hospitalService.getHospitalProfile(userId);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Hospital profile retrieved successfully",data:hospitalProfile});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while retriving profile .' });
    }
}

export const handleGetHospitalDetails = async (req: Request, res: Response) => {
    try{
        console.log(req.user);
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let hospitalDetails;
        if(userPayload.role =="hospital"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            hospitalDetails = await hospitalService.getHospitalDetails(userId);
        }
        else if(["patient", "doctor", "extern"].includes(userPayload.role)){
            const userId = req.body.hospital_id;
            if(!userId){return res.status(400).json({ error: "Hospital id must be provided" });}
            hospitalDetails = await hospitalService.getHospitalDetails(userId);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Hospital details retrieved successfully",data:hospitalDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while retriving details .' });
    }
}

export const handleGetHospitalProfileCredentials = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        let hospitalProfileCredentials;
        if(userPayload.role =="hospital"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            hospitalProfileCredentials = await hospitalService.getHospitalProfileCredentials(userId);
        }
        else if(["patient", "doctor", "extern"].includes(userPayload.role)){
            const userId = req.body.hospital_id;
            if(!userId){return res.status(400).json({ error: "Hospital id must be provided" });}
            hospitalProfileCredentials = await hospitalService.getHospitalProfileCredentials(userId);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Hospital profile credentials retrieved successfully",data:hospitalProfileCredentials});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while retriving profile credentials.' });
    }
}

export const handleUpdateHospitalProfileCredentials = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        let updatedCredentials;
        let newCredentials: HospitalProfileCredentials = req.body.newCredentials;
        if(!newCredentials){
            return res.status(403).json({ error: "Credentials not provided properly." });
        }
        if(userPayload.role =="hospital"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedCredentials = await hospitalService.updateHospitalProfileCredentials(userId, newCredentials);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Hospital profile credentials updated successfully",data:updatedCredentials});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating profile credentials.' });
    }
}

export const handleUpdateHospitalVerificationDocuments = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        let updatedDetails;
        let newDocument= req.body.newDocument;
        if(!newDocument){
            return res.status(403).json({ error: "Document not provided properly." });
        }
        if(userPayload.role =="hospital"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedDetails= await hospitalService.updateHospitalVerificationDocuments(userId, newDocument);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Hospital verification documents updated successfully",data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating verification documents.' });
    }
}

export const handleUpdateHospitalPhoto = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        let updatedDetails;
        let newPhoto= req.body.newPhoto;
        if(!newPhoto){
            return res.status(403).json({ error: "Photo not provided properly." });
        }
        if(userPayload.role =="hospital"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedDetails= await hospitalService.updateHospitalPhoto(userId, newPhoto);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Hospital photo updated successfully",data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating photo.' });
    }
}

export const handleUpdateHospitalEmail = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        let updatedDetails;
        let newEmail= req.body.newEmail;
        if(!newEmail){
            return res.status(403).json({ error: "Email not provided properly." });
        }
        if(userPayload.role =="hospital"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedDetails= await hospitalService.updateHospitalEmail(userId, newEmail);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Hospital email updated successfully",data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating email.' });
    }
}

export const handleUpdateHospitalPhone = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        let updatedDetails;
        let newPhone= req.body.newPhone;
        if(!newPhone){
            return res.status(403).json({ error: "Phone no. not provided properly." });
        }
        if(userPayload.role =="hospital"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedDetails= await hospitalService.updateHospitalPhone(userId, newPhone);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Hospital phone no. updated successfully",data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating phone no.' });
    }
}

export const handleUpdateHospitalPassword = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        let updatedDetails;
        let newPassword= req.body.newPassword;
        if(!newPassword){
            return res.status(403).json({ error: "Phone no. not provided properly." });
        }
        if(userPayload.role =="hospital"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedDetails= await hospitalService.updateHospitalPassword(userId, newPassword);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Hospital password updated successfully",data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating password.' });
    }
}