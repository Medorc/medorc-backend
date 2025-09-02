import * as patientService from "../../services/patient.services.js";
import {type Request, type Response} from "express";

export const getProfile = async(req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let patientProfile;

        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            patientProfile = await patientService.fetchProfile(userId);
        } else if (userPayload.role === "doctor" || userPayload.role === "hospital" || userPayload.role === "extern") {
            // Others: must provide shc_code or qr_code in query
            const { shc_code, qr_code } = req.query;

            if (!shc_code && !qr_code) {
                return res.status(400).json({
                    error: "Doctor must provide either shc_code or qr_code in query.",
                });
            }

            patientProfile = await patientService.fetchProfile(
                undefined,
                shc_code as string | undefined,
                qr_code as string | undefined
            );
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }

        return res.status(200).json({ data: patientProfile });
    }
    catch(err){
        res.status(400).json({ error: 'An unexpected error occurred.' });
    }
}

export const getPersonalDetails = async(req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let patientPersonalDetails;

        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            patientPersonalDetails = await patientService.fetchPersonalDetails(userId);
        } else if (userPayload.role === "doctor" || userPayload.role === "hospital" || userPayload.role === "extern") {
            // Others: must provide shc_code or qr_code in query
            const { shc_code, qr_code } = req.query;

            if (!shc_code && !qr_code) {
                return res.status(400).json({
                    error: "Doctor must provide either shc_code or qr_code in query.",
                });
            }

            patientPersonalDetails = await patientService.fetchPersonalDetails(
                undefined,
                shc_code as string | undefined,
                qr_code as string | undefined
            );
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }

        return res.status(200).json({ data: patientPersonalDetails });
    }
    catch(err){
        res.status(400).json({ error: 'An unexpected error occurred.' });
    }
}

export const getBasicDetails = async(req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let patientBasicDetails;

        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            patientBasicDetails = await patientService.fetchBasicDetails(userId);
        } else if (userPayload.role === "doctor" || userPayload.role === "hospital" || userPayload.role === "extern") {
            // Others: must provide shc_code or qr_code in query
            const { shc_code, qr_code } = req.query;

            if (!shc_code && !qr_code) {
                return res.status(400).json({
                    error: "Doctor must provide either shc_code or qr_code in query.",
                });
            }

            patientBasicDetails = await patientService.fetchBasicDetails(
                undefined,
                shc_code as string | undefined,
                qr_code as string | undefined
            );
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }

        return res.status(200).json({ data: patientBasicDetails });
    }
    catch(err){
        res.status(400).json({ error: 'An unexpected error occurred.' });
    }
}

export const getEmergencyContacts = async(req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let patientEmergencyContacts;

        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            patientEmergencyContacts = await patientService.fetchEmergencyContacts(userId);
        } else if (userPayload.role === "doctor" || userPayload.role === "hospital" || userPayload.role === "extern") {
            // Others: must provide shc_code or qr_code in query
            const { shc_code, qr_code } = req.query;

            if (!shc_code && !qr_code) {
                return res.status(400).json({
                    error: "Doctor must provide either shc_code or qr_code in query.",
                });
            }

            patientEmergencyContacts = await patientService.fetchEmergencyContacts(
                undefined,
                shc_code as string | undefined,
                qr_code as string | undefined
            );
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }

        return res.status(200).json({ data: patientEmergencyContacts });
    }
    catch(err){
        res.status(400).json({ error: 'An unexpected error occurred.' });
    }
}

export const getDataLogs = async(req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let patientDataLogs;

        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            patientDataLogs = await patientService.fetchDataLogs(userId);
        } else if (userPayload.role === "doctor" || userPayload.role === "hospital" || userPayload.role === "extern") {
            // Others: must provide shc_code or qr_code in query
            const { shc_code, qr_code } = req.query;

            if (!shc_code && !qr_code) {
                return res.status(400).json({
                    error: "Doctor must provide either shc_code or qr_code in query.",
                });
            }

            patientDataLogs = await patientService.fetchDataLogs(
                undefined,
                shc_code as string | undefined,
                qr_code as string | undefined
            );
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }

        return res.status(200).json({ data: patientDataLogs });
    }
    catch(err){
        res.status(400).json({ error: 'An unexpected error occurred.' });
    }
}

export const togglepatientVisibility = async(req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let updatedPatientVisibility;
        let curVisibility = req.body.curVisibility;
        if(curVisibility===null){
            res.status(400).json({ error: "Visibility does not exist." });
        }
        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedPatientVisibility = await patientService.toggleVisibility(curVisibility,userId);
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }

        return res.status(200).json({ message:"Visibility updated successfully!",data: updatedPatientVisibility});
    }
    catch(err){
        res.status(400).json({ error: "Unable to update patient visibility." });
    }
}

export const updatePatientPhoto = async(req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let updatedPatientPhoto;
        let newPhoto = req.body.newPhoto;
        if(newPhoto===null){
            res.status(400).json({ error: "Photo doesn't provided." });
        }
        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedPatientPhoto = await patientService.updatePhoto(newPhoto,userId);
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }

        return res.status(200).json({ message:"Photo updated successfully!",data: updatedPatientPhoto});
    }
    catch(err){
        res.status(400).json({ error: "Unable to update patient photo." });
    }
}
interface lifestyle{
    smoking: boolean,
    alcoholism: boolean,
    tobacco: boolean,
    exercise: boolean,
    pregnancy: boolean,
    others: string,
    allergy: string,
}
export const updatePatientLifestyle = async(req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let updatedPatientLifestyle;
        let newLifestyle: lifestyle = req.body.newLifestyle;
        if(newLifestyle==null){
            res.status(400).json({ error: "Lifestyle doesn't provided correctly or doesn't exists." });
        }
        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedPatientLifestyle = await patientService.updateLifestyle(newLifestyle,userId);
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({ message:"Lifestyle updated successfully!",data: updatedPatientLifestyle});
    }
    catch(err){
        res.status(400).json({ error: "Unable to update patient Lifestyle." });
    }

}

export const updatePatientEmail = async(req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({error: "Invalid token payload."});
        }

        let updatedPatientEmail;
        let newEmail = req.body.newEmail;
        if (newEmail === null) {
            res.status(400).json({error: "Email not provided."});
        }
        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({error: "User ID missing in token."});
            }
            const userId = String(userPayload.id);
            updatedPatientEmail = await patientService.updateEmail(newEmail, userId);

        } else {
            return res.status(403).json({error: "Unauthorized role."});
        }
        res.status(200).json({message: "Email updated successfully!", data: updatedPatientEmail});
    }
    catch(err){
            res.status(400).json({ error: "Unable to update patient Email." });
        }
}

export const updatePatientPhoneNo = async(req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({error: "Invalid token payload."});
        }

        let updatedPatientPhoneNo;
        let newPhoneNo = req.body.newPhoneNo;
        if ( newPhoneNo=== null) {
            res.status(400).json({error: "Phone No. not provided."});
        }
        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({error: "User ID missing in token."});
            }
            const userId = String(userPayload.id);
            updatedPatientPhoneNo = await patientService.updatePhoneNo(newPhoneNo, userId);

        } else {
            return res.status(403).json({error: "Unauthorized role."});
        }
        res.status(200).json({message: "Phone No. updated successfully!", data: updatedPatientPhoneNo});
    }
    catch(err){
        res.status(400).json({ error: "Unable to update patient Phone No." });
    }
}

export const updatePatientPassword = async(req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({error: "Invalid token payload."});
        }

        let newPassword = req.body.newPassword;
        if ( newPassword=== null) {
            res.status(400).json({error: "Phone No. not provided."});
        }
        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({error: "User ID missing in token."});
            }
            const userId = String(userPayload.id);
            await patientService.updatePassword(newPassword, userId);

        } else {
            return res.status(403).json({error: "Unauthorized role."});
        }
        res.status(200).json({message: "Password updated successfully!"});
    }
    catch(err){
        res.status(400).json({ error: "Unable to update patient Password" });
    }
}

interface emergencyContact{
    full_name:string,
    phone_no:string,
    relation:string
}


export const addPatientEmergencyContact = async(req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({error: "Invalid token payload."});
        }

        let emergencyContact:emergencyContact = req.body.newEmergencyContact;
        let newEmergencyContact;
        if (!emergencyContact) {
            console.log(emergencyContact);
            res.status(400).json({error: "Emergency contact not provided."});
        }
        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({error: "User ID missing in token."});
            }
            const userId = String(userPayload.id);
            newEmergencyContact = await patientService.addEmergencyContact(emergencyContact, userId);

        } else {
            return res.status(403).json({error: "Unauthorized role."});
        }
        res.status(200).json({message: "Emergency contact added successfully!",data: newEmergencyContact});
    }
    catch(err){
        console.error("Error in addPatientEmergencyContact:", err);
        let errorMessage = 'An unexpected error occurred.';

        // Check if the error is from Prisma, e.g., for a unique constraint violation
        if (err && typeof err === 'object' && 'code' in err && err.code === 'P2002') {
            return res.status(409).json({ error: 'A user with this email already exists.' });
        }

        if (err instanceof Error) {
            errorMessage = err.message;
        }
        res.status(400).json({ error: errorMessage || "Unable to add patient Emergency Contact" });
    }
}

export const deletePatientEmergencyContact = async(req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({error: "Invalid token payload."});
        }

        const emg_id: string = req.body.emg_id;
        if (!emg_id) {
            return res.status(400).json({error: "Emergency contact id not provided."});
        }

        if (userPayload.role !== "patient") {
            return res.status(403).json({error: "Unauthorized role."});
        }

        const userId = String(userPayload.id);
        const result = await patientService.deleteEmergencyContact(userId,emg_id);

        if (!result) {
            return res.status(404).json({error: "Emergency contact not found"});
        }

        res.status(200).json({message: "Emergency contact deleted successfully!"});
    } catch (err) {
        console.error("Error in deletePatientEmergencyContact:", err);
        res.status(400).json({ error: err instanceof Error ? err.message : "Unable to delete patient Emergency Contact" });
    }
}