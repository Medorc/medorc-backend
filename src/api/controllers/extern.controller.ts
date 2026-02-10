import {type Request, type Response} from 'express';
import * as externService from "../../services/extern.services.js";
import type {DoctorProfileCredentials, OrganizationDetails} from "../../types/application.js";
import * as doctorService from "../../services/doctor.services.js";
import * as hospitalService from "../../services/hospital.services.js";

export const handleGetExternProfile = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        let externProfile;
        if(userPayload.role =="extern"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            externProfile = await externService.getExternProfile(userId);
        }
        else if(["doctor", "hospital", "patient"].includes(userPayload.role)){
            const userId = req.query.viewer_id;
            if(!userId){return res.status(400).json({ error: "Viewer id must be provided" });}
            externProfile = await externService.getExternProfile(String(userId));
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Extern profile retrieved successfully",data:externProfile});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while retrieving profile .' });
    }
}

export const handleGetExternPersonalDetails = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        let externPersonalDetails;
        if(userPayload.role =="extern"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            externPersonalDetails = await externService.getExternPersonalDetails(userId);
        }
        else if(["doctor", "hospital", "patient"].includes(userPayload.role)){
            const userId = req.body.viewer_id;
            if(!userId){return res.status(400).json({ error: "Viewer id must be provided" });}
            externPersonalDetails = await externService.getExternPersonalDetails(userId);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Extern personal details retrieved successfully",data:externPersonalDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while retrieving personal details.' });
    }
}

export const handleGetExternOrganizationCredentials = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        let externOrganizationCredentials;
        if(userPayload.role =="extern"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            externOrganizationCredentials = await externService.getExternOrganizationCredentials(userId);
        }
        else if(["doctor", "hospital", "patient"].includes(userPayload.role)){
            const userId = req.body.viewer_id;
            if(!userId){return res.status(400).json({ error: "Viewer id must be provided" });}
            externOrganizationCredentials= await externService.getExternOrganizationCredentials(userId);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Extern organization details retrieved successfully",data:externOrganizationCredentials});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while retrieving organization details.' });
    }
}

export const handleGetExternBasicDetails = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        let externBasicDetails;
        if(userPayload.role =="extern"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            externBasicDetails = await externService.getExternBasicDetails(userId);
        }
        else if(["doctor", "hospital", "patient"].includes(userPayload.role)){
            const userId = req.body.viewer_id;
            if(!userId){return res.status(400).json({ error: "Viewer id must be provided" });}
            externBasicDetails = await externService.getExternBasicDetails(userId);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Extern basic details retrieved successfully",data:externBasicDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while retrieving basic details.' });
    }
}

export const handleUpdateExternOrganizationCredentials = async (req: Request, res: Response) => {
    try{
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }
        if (!userPayload.id) {
            return res.status(400).json({ error: "User ID missing in token." });
        }
        if(userPayload.role !="extern"){
            return res.status(400).json({ error: "Unauthorized role." });
        }
        const userId = String(userPayload.id);
        const newOrganizationCredentials: OrganizationDetails= req.body.newOrganizationCredentials;
        if(!newOrganizationCredentials){
            res.status(400).json({ error: "Organization details not provided correctly" });
        }
        const updatedDetails= await externService.updateExternOrganizationDetails(userId,newOrganizationCredentials);
        return res.status(200).json({message:"Extern organization details updated successfully ", data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating Organization details.' });
    }
}

export const handleUpdateExternVerificationDocuments = async (req: Request, res: Response) => {
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
        if(userPayload.role =="extern"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedDetails= await externService.updateExternVerificationDocuments(userId, newDocument);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Extern verification documents updated successfully",data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating verification documents.' });
    }
}

export const handleUpdateExternPhoto = async (req: Request, res: Response) => {
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
        if(userPayload.role =="extern"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedDetails= await externService.updateExternPhoto(userId, newPhoto);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Extern photo updated successfully",data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating photo.' });
    }
}

export const handleUpdateExternEmail = async (req: Request, res: Response) => {
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
        if(userPayload.role =="extern"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedDetails= await externService.updateExternEmail(userId, newEmail);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Extern email updated successfully",data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating email.' });
    }
}
export const handleUpdateExternPhone = async (req: Request, res: Response) => {
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
        if(userPayload.role =="extern"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedDetails= await externService.updateExternPhone(userId, newPhone);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Extern phone no. updated successfully",data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating phone no.' });
    }
}

export const handleUpdateExternPassword = async (req: Request, res: Response) => {
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
        if(userPayload.role =="extern"){
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedDetails= await externService.updateExternPassword(userId, newPassword);
        }
        else{
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({message:"Extern password updated successfully",data:updatedDetails});
    }
    catch(error){
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating password.' });
    }
}