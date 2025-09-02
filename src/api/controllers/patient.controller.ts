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