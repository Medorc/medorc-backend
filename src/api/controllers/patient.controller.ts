import * as patientService from "../../services/patient.services.js";
import { type Request, type Response } from "express";
import type { EmergencyContact, Lifestyle, PatientIdentifier, SearchOptions } from "../../types/application.js";

export const handleGetPatientProfile = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;

        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let patientProfile;

        // 1. Fetch Profile Logic
        if (userPayload.role === "patient") {
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            patientProfile = await patientService.getPatientProfile(userId);
        } else if (["doctor", "hospital", "extern"].includes(userPayload.role as string)) {
            const shc_code = typeof req.query.shc_code === 'string' ? req.query.shc_code : undefined;
            const qr_code = typeof req.query.qr_code === 'string' ? req.query.qr_code : undefined;

            if (!shc_code && !qr_code) {
                return res.status(400).json({
                    error: "Must provide either shc_code or qr_code in query parameters.",
                });
            }

            patientProfile = await patientService.getPatientProfile(
                undefined,
                shc_code,
                qr_code
            );
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }

        // 2. Logging Logic (Only runs if a profile was successfully found)
        if (patientProfile) {
            try {
                const visitorId = (userPayload as any).id;
                const visitorRole = (userPayload as any).role;

                // We only log if the visitor is NOT the patient themselves
                if (visitorRole !== "patient") {
                    let patientIdentifier: PatientIdentifier = {};

                    // Re-extract codes for logging scope
                    const shc_code = typeof req.query.shc_code === 'string' ? req.query.shc_code : undefined;
                    const qr_code = typeof req.query.qr_code === 'string' ? req.query.qr_code : undefined;

                    patientIdentifier = { shc_code, qr_code };

                    const logMessage = `${new Date().toISOString()} - ${visitorRole.toUpperCase()} [${visitorId}] visited your profile`;

                    // Fire-and-forget logging
                    await patientService.addPatientDataLog(patientIdentifier, logMessage);
                }
            } catch (logError) {
                console.error("Failed to add data log:", logError);
                // We do not stop the response if logging fails
            }
        }

        // --- THE FIX IS HERE ---
        // Send patientProfile directly, not wrapped in { data: ... }
        return res.status(200).json(patientProfile);

    } catch (err) {
        console.error("Controller Error:", err);
        return res.status(500).json({ error: 'An unexpected error occurred.' });
    }
};

export const handleGetPatientPersonalDetails = async (req: Request, res: Response) => {
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
            patientPersonalDetails = await patientService.getPatientPersonalDetails(userId);
        } else if (userPayload.role === "doctor" || userPayload.role === "hospital" || userPayload.role === "extern") {
            // Others: must provide shc_code or qr_code in query
            const { shc_code, qr_code } = req.query;

            if (!shc_code && !qr_code) {
                return res.status(400).json({
                    error: "Doctor must provide either shc_code or qr_code in query.",
                });
            }

            patientPersonalDetails = await patientService.getPatientPersonalDetails(
                undefined,
                shc_code as string | undefined,
                qr_code as string | undefined
            );
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }

        return res.status(200).json({ data: patientPersonalDetails });
    }
    catch (err) {
        res.status(400).json({ error: 'An unexpected error occurred.' });
    }
}

export const handleGetPatientBasicDetails = async (req: Request, res: Response) => {
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
            patientBasicDetails = await patientService.getPatientBasicDetails(userId);
        } else if (userPayload.role === "doctor" || userPayload.role === "hospital" || userPayload.role === "extern") {
            // Others: must provide shc_code or qr_code in query
            const { shc_code, qr_code } = req.query;

            if (!shc_code && !qr_code) {
                return res.status(400).json({
                    error: "Doctor must provide either shc_code or qr_code in query.",
                });
            }

            patientBasicDetails = await patientService.getPatientBasicDetails(
                undefined,
                shc_code as string | undefined,
                qr_code as string | undefined
            );
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }

        return res.status(200).json({ data: patientBasicDetails });
    }
    catch (err) {
        res.status(400).json({ error: 'An unexpected error occurred.' });
    }
}

export const handleGetPatientEmergencyContacts = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let patientIdentifier: PatientIdentifier = {};

        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            patientIdentifier.patient_id = String(userPayload.id);
        } else if (userPayload.role === "doctor" || userPayload.role === "hospital" || userPayload.role === "extern") {
            // Others: must provide shc_code or qr_code in query
            const { shc_code, qr_code } = req.query;

            if (!shc_code && !qr_code) {
                return res.status(400).json({
                    error: "Doctor must provide either shc_code or qr_code in query.",
                });
            }

            if (shc_code) patientIdentifier.shc_code = shc_code as string;
            if (qr_code) patientIdentifier.qr_code = qr_code as string;

        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }
        const patientEmergencyContacts = await patientService.getPatientEmergencyContacts(patientIdentifier);
        return res.status(200).json({ data: patientEmergencyContacts });
    }
    catch (err) {
        res.status(400).json({ error: 'An unexpected error occurred.' });
    }
}

export const handleGetPatientDataLogs = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let patientIdentifier: PatientIdentifier = {};

        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            patientIdentifier.patient_id = String(userPayload.id);
        } else if (userPayload.role === "doctor" || userPayload.role === "hospital" || userPayload.role === "extern") {
            // Others: must provide shc_code or qr_code in query
            const { shc_code, qr_code } = req.query;

            if (!shc_code && !qr_code) {
                return res.status(400).json({
                    error: "Doctor must provide either shc_code or qr_code in query.",
                });
            }

            if (shc_code) patientIdentifier.shc_code = shc_code as string;
            if (qr_code) patientIdentifier.qr_code = qr_code as string;

        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }
        const patientDataLogs = await patientService.getPatientDataLogs(patientIdentifier);
        return res.status(200).json({ data: patientDataLogs });
    }
    catch (err) {
        res.status(400).json({ error: 'An unexpected error occurred.' });
    }
}

export const handleUpdatePatientVisibility = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let updatedPatientVisibility;

        let curVisibility = req.body.curVisibility;

        if (curVisibility === null) {
            res.status(400).json({ error: "Visibility does not exist." });
        }
        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedPatientVisibility = await patientService.updatePatientVisibility(curVisibility, userId);
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }

        return res.status(200).json({ message: "Visibility updated successfully!", data: updatedPatientVisibility });
    }
    catch (err) {
        res.status(400).json({ error: "Unable to update patient visibility." });
    }
}

export const handleUpdatePatientPhoto = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let updatedPatientPhoto;
        let newPhoto = req.body.newPhoto;
        if (newPhoto === null) {
            res.status(400).json({ error: "Photo doesn't provided." });
        }
        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedPatientPhoto = await patientService.updatePatientPhoto(newPhoto, userId);
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }

        return res.status(200).json({ message: "Photo updated successfully!", data: updatedPatientPhoto });
    }
    catch (err) {
        res.status(400).json({ error: "Unable to update patient photo." });
    }
}

export const handleUpdatePatientLifestyle = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let updatedPatientLifestyle;
        let newLifestyle: Lifestyle = req.body.newLifestyle;
        if (newLifestyle == null) {
            res.status(400).json({ error: "Lifestyle doesn't provided correctly or doesn't exists." });
        }
        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedPatientLifestyle = await patientService.updatePatientLifestyle(newLifestyle, userId);
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({ message: "Lifestyle updated successfully!", data: updatedPatientLifestyle });
    }
    catch (err) {
        res.status(400).json({ error: "Unable to update patient Lifestyle." });
    }

}

export const handleUpdatePatientEmail = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let updatedPatientEmail;
        let newEmail = req.body.newEmail;
        if (newEmail === null) {
            res.status(400).json({ error: "Email not provided." });
        }
        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedPatientEmail = await patientService.updatePatientEmail(newEmail, userId);

        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({ message: "Email updated successfully!", data: updatedPatientEmail });
    }
    catch (err) {
        res.status(400).json({ error: "Unable to update patient Email." });
    }
}

export const handleUpdatePatientPhoneNo = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let updatedPatientPhoneNo;
        let newPhoneNo = req.body.newPhone;
        if (newPhoneNo === null) {
            res.status(400).json({ error: "Phone No. not provided." });
        }
        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            updatedPatientPhoneNo = await patientService.updatePatientPhoneNo(newPhoneNo, userId);

        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({ message: "Phone No. updated successfully!", data: updatedPatientPhoneNo });
    }
    catch (err) {
        res.status(400).json({ error: "Unable to update patient Phone No." });
    }
}

export const handleUpdatePatientPassword = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let newPassword = req.body.newPassword;
        if (newPassword === null) {
            res.status(400).json({ error: "Phone No. not provided." });
        }
        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            await patientService.updatePatientPassword(newPassword, userId);

        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({ message: "Password updated successfully!" });
    }
    catch (err) {
        res.status(400).json({ error: "Unable to update patient Password" });
    }
}



export const handleAddPatientEmergencyContact = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        let emergencyContact: EmergencyContact = req.body.newEmergencyContact;
        let newEmergencyContact;
        if (!emergencyContact) {

            res.status(400).json({ error: "Emergency contact not provided." });
        }
        if (userPayload.role === "patient") {
            // Patient: must have user id in token
            if (!userPayload.id) {
                return res.status(400).json({ error: "User ID missing in token." });
            }
            const userId = String(userPayload.id);
            newEmergencyContact = await patientService.addPatientEmergencyContact(emergencyContact, userId);

        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }
        res.status(200).json({ message: "Emergency contact added successfully!", data: newEmergencyContact });
    }
    catch (err) {
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

export const handleDeletePatientEmergencyContact = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        if (!userPayload || typeof userPayload !== "object") {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        const emg_id: string = req.body.emg_id;
        if (!emg_id) {
            return res.status(400).json({ error: "Emergency contact id not provided." });
        }

        if (userPayload.role !== "patient") {
            return res.status(403).json({ error: "Unauthorized role." });
        }

        const userId = String(userPayload.id);
        const result = await patientService.deletePatientEmergencyContact(userId, emg_id);

        if (!result) {
            return res.status(404).json({ error: "Emergency contact not found" });
        }

        res.status(200).json({ message: "Emergency contact deleted successfully!" });
    } catch (err) {
        console.error("Error in deletePatientEmergencyContact:", err);
        res.status(400).json({ error: err instanceof Error ? err.message : "Unable to delete patient Emergency Contact" });
    }
}

export const handleCreatePatientRecord = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        const {
            basicDetails,
            hospitalizationDetails,
            surgeryDetails,
            documents,
            shc_code, // Doctor/Hospital will provide this in the body
            qr_code   // Or this
        } = req.body;
        console.log(req.body);
        console.log(req.user);
        if (!basicDetails) {
            return res.status(400).json({ error: 'basicDetails are required.' });
        }

        if (typeof userPayload !== 'object' || !userPayload) {
            return res.status(403).json({ error: 'Invalid token payload.' });
        }

        let patientIdentifier: PatientIdentifier = {};

        if (userPayload.role === 'patient') {
            if (!('id' in userPayload)) {
                return res.status(400).json({ error: 'Patient ID missing in token.' });
            }
            patientIdentifier = { patient_id: String(userPayload.id) };
        } else if (['doctor', 'hospital'].includes(userPayload.role as string)) {
            if (!shc_code && !qr_code) {
                return res.status(400).json({
                    error: "An 'shc_code' or 'qr_code' must be provided in the request body for this role.",
                });
            }
            patientIdentifier = { shc_code, qr_code };
        } else {
            return res.status(403).json({ error: 'Your role is not authorized to perform this action.' });
        }

        // Call the service with the correct patient identifier, record data, AND the creator's payload
        const newRecord = await patientService.createPatientRecord(
            patientIdentifier,
            {
                basicDetails,
                hospitalizationDetails,
                surgeryDetails,
                documents
            },
            userPayload // This is the required addition
        );
        //--LOGGING CALL
        try {

            const creatorId = (userPayload as any).id;
            const creatorRole = (userPayload as any).role;

            const logMessage = `${new Date().toISOString()} - ${creatorRole.toUpperCase()} [${creatorId}] created a new record [${newRecord.record_id}]]`;

            // Call the logging service (fire-and-forget)
            await patientService.addPatientDataLog(patientIdentifier, logMessage);
        }
        catch (logError) {
            console.error("Failed to add data log:", logError);
        }
        return res.status(201).json({
            message: 'Record created successfully.',
            data: { record_id: newRecord.record_id }
        });

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while creating the record.' });
    }
};

export const handleAddPatientHospitalizationDetails = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        const hospitalizationDetails = req.body.hospitalizationDetails;
        const record_id = req.params.record_id;
        if (!hospitalizationDetails) {
            res.status(400).json({ error: 'Hospitalization details & record_id is required.' });
        }
        if (!record_id) {
            res.status(400).json({ error: "Record id must be provided." });
        }
        if (typeof userPayload !== 'object' || !userPayload) {
            return res.status(403).json({ error: 'Invalid token payload.' });
        }
        const newHospitalizationDetails = await patientService.addPatientHospitalizationDetails(record_id!, hospitalizationDetails);
        //--LOGGING CALL
        try {
            let patientIdentifier: PatientIdentifier = {};
            const shc_code = req.body.shc_code;
            const qr_code = req.body.qr_code;
            if (userPayload.role === 'patient') {
                if (!('id' in userPayload)) {
                    return res.status(400).json({ error: 'Patient ID missing in token.' });
                }
                patientIdentifier = { patient_id: String(userPayload.id) };
            } else if (['doctor', 'hospital'].includes(userPayload.role as string)) {
                if (!shc_code && !qr_code) {
                    return res.status(400).json({
                        error: "An 'shc_code' or 'qr_code' must be provided in the request body for this role.",
                    });
                }
                patientIdentifier = { shc_code, qr_code };
            } else {
                return res.status(403).json({ error: 'Your role is not authorized to perform this action.' });
            }

            const creatorId = (userPayload as any).id;
            const creatorRole = (userPayload as any).role;

            const logMessage = `${new Date().toISOString()} - ${creatorRole.toUpperCase()} [${creatorId}] Added hospitalization details to record_id [${record_id}]]`;

            // Call the logging service (fire-and-forget)
            await patientService.addPatientDataLog(patientIdentifier, logMessage);
        }
        catch (logError) {
            console.error("Failed to add data log:", logError);
        }
        return res.status(201).json({ message: 'Hospitalization details added successfully.', data: newHospitalizationDetails });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while adding hospitalization details.' });
    }
}

export const handleAddPatientSurgeryDetails = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        const surgeryDetails = req.body.surgeryDetails;
        const record_id = req.params.record_id;
        if (!surgeryDetails || !record_id) {
            return res.status(400).json({ error: 'SurgeryDetails & record_id must be provided.' });
        }
        if (typeof userPayload !== 'object' || !userPayload) {
            return res.status(403).json({ error: 'Invalid token payload.' });
        }
        const newSurgeryDetails = await patientService.addPatientSurgeryDetails(record_id!, surgeryDetails);
        //LOGGING CALL
        try {
            let patientIdentifier: PatientIdentifier = {};
            const shc_code = req.body.shc_code;
            const qr_code = req.body.qr_code;
            if (userPayload.role === 'patient') {
                if (!('id' in userPayload)) {
                    return res.status(400).json({ error: 'Patient ID missing in token.' });
                }
                patientIdentifier = { patient_id: String(userPayload.id) };
            } else if (['doctor', 'hospital'].includes(userPayload.role as string)) {
                if (!shc_code && !qr_code) {
                    return res.status(400).json({
                        error: "An 'shc_code' or 'qr_code' must be provided in the request body for this role.",
                    });
                }
                patientIdentifier = { shc_code, qr_code };
            } else {
                return res.status(403).json({ error: 'Your role is not authorized to perform this action.' });
            }

            const creatorId = (userPayload as any).id;
            const creatorRole = (userPayload as any).role;

            const logMessage = `${new Date().toISOString()} - ${creatorRole.toUpperCase()} [${creatorId}] Added surgery details to record_id [${record_id}]]`;

            // Call the logging service (fire-and-forget)
            await patientService.addPatientDataLog(patientIdentifier, logMessage);
        }
        catch (logError) {
            console.error("Failed to add data log:", logError);
        }
        return res.status(201).json({ message: 'Surgery Details added successfully.', data: newSurgeryDetails });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while creating the record.' });
    }
}

export const handleAddPatientPrescription = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        const record_id = req.params.record_id;
        const { prescription_url, shc_code, qr_code } = req.body;

        if (!prescription_url) {
            return res.status(400).json({ error: 'Prescription url & record_id must be provided.' });
        }
        if (typeof userPayload !== 'object' || !userPayload) {
            return res.status(403).json({ error: 'Invalid token payload.' });
        }
        const newDocument = await patientService.addPatientPrescription(record_id!, prescription_url);
        //LOGGING CALL
        try {
            let patientIdentifier: PatientIdentifier = {};
            if (userPayload.role === 'patient') {
                if (!('id' in userPayload)) {
                    return res.status(400).json({ error: 'Patient ID missing in token.' });
                }
                patientIdentifier = { patient_id: String(userPayload.id) };
            } else if (['doctor', 'hospital'].includes(userPayload.role as string)) {
                if (!shc_code && !qr_code) {
                    return res.status(400).json({
                        error: "An 'shc_code' or 'qr_code' must be provided in the request body for this role.",
                    });
                }
                patientIdentifier = { shc_code, qr_code };
            } else {
                return res.status(403).json({ error: 'Your role is not authorized to perform this action.' });
            }

            const creatorId = (userPayload as any).id;
            const creatorRole = (userPayload as any).role;

            const logMessage = `${new Date().toISOString()} - ${creatorRole.toUpperCase()} [${creatorId}] Added prescription to record_id [${record_id}]]`;

            // Call the logging service (fire-and-forget)
            await patientService.addPatientDataLog(patientIdentifier, logMessage);
        }
        catch (logError) {
            console.error("Failed to add prescription", logError);
        }
        return res.status(201).json({ message: 'Prescription added successfully.', data: newDocument });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while adding prescription.' });
    }
}

export const handleRemovePatientPrescription = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        const record_id = req.params.record_id;
        const { shc_code, qr_code } = req.body;
        if (typeof userPayload !== 'object' || !userPayload) {
            return res.status(403).json({ error: 'Invalid token payload.' });
        }
        const updatedDoc = await patientService.removePatientPrescription(record_id!);
        //LOGGING CALL
        try {
            let patientIdentifier: PatientIdentifier = {};
            if (userPayload.role === 'patient') {
                if (!('id' in userPayload)) {
                    return res.status(400).json({ error: 'Patient ID missing in token.' });
                }
                patientIdentifier = { patient_id: String(userPayload.id) };
            } else if (['doctor', 'hospital'].includes(userPayload.role as string)) {
                if (!shc_code && !qr_code) {
                    return res.status(400).json({
                        error: "An 'shc_code' or 'qr_code' must be provided in the request body for this role.",
                    });
                }
                patientIdentifier = { shc_code, qr_code };
            } else {
                return res.status(403).json({ error: 'Your role is not authorized to perform this action.' });
            }

            const creatorId = (userPayload as any).id;
            const creatorRole = (userPayload as any).role;

            const logMessage = `${new Date().toISOString()} - ${creatorRole.toUpperCase()} [${creatorId}] removed prescription from record_id [${record_id}]]`;

            // Call the logging service (fire-and-forget)
            await patientService.addPatientDataLog(patientIdentifier, logMessage);
        }
        catch (logError) {
            console.error("Failed to prescription", logError);
        }
        return res.status(201).json({ message: 'Prescription removed successfully.', data: updatedDoc });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while removing prescription.' });
    }
}

export const handleAddPatientLabResults = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        const record_id = req.params.record_id;
        const { lab_results_url, shc_code, qr_code } = req.body;

        if (!lab_results_url) {
            return res.status(400).json({ error: 'Lab results url & record_id must be provided.' });
        }
        if (typeof userPayload !== 'object' || !userPayload) {
            return res.status(403).json({ error: 'Invalid token payload.' });
        }
        const newDocument = await patientService.addPatientLabResults(record_id!, lab_results_url);
        //LOGGING CALL
        try {
            let patientIdentifier: PatientIdentifier = {};
            if (userPayload.role === 'patient') {
                if (!('id' in userPayload)) {
                    return res.status(400).json({ error: 'Patient ID missing in token.' });
                }
                patientIdentifier = { patient_id: String(userPayload.id) };
            } else if (['doctor', 'hospital'].includes(userPayload.role as string)) {
                if (!shc_code && !qr_code) {
                    return res.status(400).json({
                        error: "An 'shc_code' or 'qr_code' must be provided in the request body for this role.",
                    });
                }
                patientIdentifier = { shc_code, qr_code };
            } else {
                return res.status(403).json({ error: 'Your role is not authorized to perform this action.' });
            }

            const creatorId = (userPayload as any).id;
            const creatorRole = (userPayload as any).role;

            const logMessage = `${new Date().toISOString()} - ${creatorRole.toUpperCase()} [${creatorId}] Added Lab results to record_id [${record_id}]]`;

            // Call the logging service (fire-and-forget)
            await patientService.addPatientDataLog(patientIdentifier, logMessage);
        }
        catch (logError) {
            console.error("Failed to add lab results", logError);
        }
        return res.status(201).json({ message: 'Lab results added successfully.', data: newDocument });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while adding lab results.' });
    }
}

export const handleRemovePatientLabResults = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        const record_id = req.params.record_id;
        const { shc_code, qr_code } = req.body;
        if (typeof userPayload !== 'object' || !userPayload) {
            return res.status(403).json({ error: 'Invalid token payload.' });
        }
        const updatedDoc = await patientService.removePatientLabResults(record_id!);
        //LOGGING CALL
        try {
            let patientIdentifier: PatientIdentifier = {};
            if (userPayload.role === 'patient') {
                if (!('id' in userPayload)) {
                    return res.status(400).json({ error: 'Patient ID missing in token.' });
                }
                patientIdentifier = { patient_id: String(userPayload.id) };
            } else if (['doctor', 'hospital'].includes(userPayload.role as string)) {
                if (!shc_code && !qr_code) {
                    return res.status(400).json({
                        error: "An 'shc_code' or 'qr_code' must be provided in the request body for this role.",
                    });
                }
                patientIdentifier = { shc_code, qr_code };
            } else {
                return res.status(403).json({ error: 'Your role is not authorized to perform this action.' });
            }

            const creatorId = (userPayload as any).id;
            const creatorRole = (userPayload as any).role;

            const logMessage = `${new Date().toISOString()} - ${creatorRole.toUpperCase()} [${creatorId}] removed lab results from record_id [${record_id}]]`;

            // Call the logging service (fire-and-forget)
            await patientService.addPatientDataLog(patientIdentifier, logMessage);
        }
        catch (logError) {
            console.error("Failed to prescription", logError);
        }
        return res.status(201).json({ message: 'Lab results removed successfully.', data: updatedDoc });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while removing lab results.' });
    }
}

export const handleUpdatePatientRecordVisibility = async (req: Request, res: Response) => {
    try {
        const curVisibility = req.body.curVisibility;
        const record_id = req.params.record_id;
        if (!record_id || curVisibility == null) {
            return res.status(403).json({ error: 'CurVisibility & record_id must be provided.' });
        }
        const result = await patientService.updatePatientRecordVisibility(record_id, curVisibility);
        res.status(200).json({ message: "visibility updated successfully.", data: result });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while updating record visibility.' });
    }

}

export const handleGetPatientRecords = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user;
        const searchOptions: SearchOptions = req.body.searchOptions;
        const shc_code = req.body.shc_code;
        const qr_code = req.body.qr_code;
        const searchQuery = req.body.searchQuery;
        if (typeof userPayload !== 'object' || !userPayload) {
            return res.status(403).json({ error: 'Invalid token payload.' });
        }
        let patientIdentifier: PatientIdentifier = {};
        if (userPayload.role === 'patient') {
            if (!('id' in userPayload)) {
                return res.status(400).json({ error: 'Patient ID missing in token.' });
            }
            patientIdentifier = { patient_id: String(userPayload.id) };
        } else if (['doctor', 'hospital', 'extern'].includes(userPayload.role as string)) {
            if (!shc_code && !qr_code) {
                return res.status(400).json({
                    error: "An 'shc_code' or 'qr_code' must be provided in the request body for this role.",
                });
            }
            patientIdentifier = { shc_code, qr_code };
        } else {
            return res.status(403).json({ error: 'Your role is not authorized to perform this action.' });
        }
        const records = await patientService.getPatientRecords(patientIdentifier, searchOptions, userPayload.role, searchQuery);
        res.status(200).json({ message: 'Records retrived successfully .', data: records });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while retriving health records.' });
    }
}

export const handleGetPatientSurgeryDetails = async (req: Request, res: Response) => {
    try {
        const record_id = req.params.record_id;
        if (!record_id) {
            return res.status(403).json({ error: 'record Id must be provided' });
        }
        const surgeryDetails = await patientService.getPatientSurgeryDetails(record_id);
        if (!surgeryDetails) {
            return res.status(404).json({ message: 'No surgery details found for this record.' });
        }
        res.status(200).json(surgeryDetails);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while retriving surgery details .' });
    }
}

export const handleGetPatientHospitalizationDetails = async (req: Request, res: Response) => {
    try {
        const record_id = req.params.record_id;
        if (!record_id) {
            return res.status(403).json({ error: 'record Id must be provided' });
        }
        const hospitalizationDetails = await patientService.getPatientHospitalizationDetails(record_id);
        if (!hospitalizationDetails) {
            return res.status(404).json({ message: 'No hospitalization details found for this record.' });
        }
        res.status(200).json(hospitalizationDetails);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while retriving hospitalization details .' });
    }
}

export const handleGetPatientDocuments = async (req: Request, res: Response) => {
    try {
        const record_id = req.params.record_id;
        if (!record_id) {
            return res.status(403).json({ error: 'record Id must be provided' });
        }
        const documents = await patientService.getPatientDocuments(record_id);
        if (!documents) {
            return res.status(404).json({ message: 'No documents found for this record.' });
        }
        res.status(200).json(documents);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred while retriving documents .' });
    }
}