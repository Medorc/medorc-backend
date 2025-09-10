import { type Request, type Response } from "express";
import * as orbyService from "../../services/orby.services.js";

export const handleWebhook = async (req: Request, res: Response) => {
    const actionName = req.body.next_action;
    const metadata = req.body.tracker.latest_message.metadata;
    let responseText = "Sorry, I can't handle that action right now.";

    try {
        switch (actionName) {
            case 'action_find_hospital_visit':
                const entities = req.body.tracker.latest_message.entities;
                responseText = await orbyService.findPatientHospitalVisit(entities, metadata.shc_code, metadata.qr_code);
                break;
            case 'action_find_last_record':
                responseText = await orbyService.findPatientLastRecord(metadata.shc_code, metadata.qr_code);
                break;
            case 'action_find_last_hospital_visit':
                responseText = await orbyService.findPatientLastHospitalVisit(metadata.shc_code, metadata.qr_code);
                break;
            case 'action_find_last_hospitalization':
                responseText = await orbyService.findPatientLastHospitalization(metadata.shc_code, metadata.qr_code);
                break;
            case 'action_find_last_surgery':
                responseText = await orbyService.findPatientLastSurgery(metadata.shc_code, metadata.qr_code);
                break;
            case 'action_find_last_activity':
                responseText = await orbyService.findPatientLastActivity(metadata.shc_code, metadata.qr_code);
                break;
            case 'action_check_allergy':
                responseText = await orbyService.checkPatientAllergy(metadata.shc_code, metadata.qr_code);
                break;
            case 'action_check_habits':
                responseText = await orbyService.checkPatientHabits(metadata.shc_code, metadata.qr_code);
                break;
            case 'action_check_pregnancy':
                responseText = await orbyService.checkPatientPregnancy(metadata.shc_code, metadata.qr_code);
                break;
            case 'action_get_patient_overview':
                responseText = await orbyService.getPatientOverview(metadata.shc_code, metadata.qr_code);
                break;
            case 'action_get_contact_info':
                responseText = await orbyService.getPatientContactInfo(metadata.shc_code, metadata.qr_code);
                break;
            case 'action_find_past_diagnoses':
                responseText = await orbyService.findPatientPastDiagnoses(metadata.shc_code, metadata.qr_code);
                break;
            case 'action_find_current_medications':
                responseText = await orbyService.findPatientCurrentMedications(metadata.shc_code, metadata.qr_code);
                break;
            // Add other cases here...
        }
    } catch (error) {
        console.error("Error handling action:", error);
        // It's good practice to also handle the error case with a user-friendly message
        responseText = "I'm sorry, but I encountered an error while processing your request.";
    }

    res.json({
        events: [{ "event": "bot", "text": responseText }]
    });
};