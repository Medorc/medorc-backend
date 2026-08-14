import { type Request, type Response } from "express";
import * as orbyService from "../../services/orby.services.js";

type RasaEntity = {
    entity: string;
    value: any;
    // You can add other properties like start, end, etc. if you need them
};

export const handleWebhook = async (req: Request, res: Response) => {
    const actionName = req.body?.next_action;
    const latestMsg = req.body?.tracker?.latest_message || {};
    const metadata = latestMsg.metadata || {};
    const tracker = req.body?.tracker || {};

    const shc_code = metadata.shc_code || tracker.sender_id || req.body?.sender_id || tracker.slots?.shc_code;
    const qr_code = metadata.qr_code || tracker.slots?.qr_code;

    let responseText = "Sorry, I can't handle that action right now.";

    try {
        switch (actionName) {
            case 'action_find_hospital_visit':
                let entitiesForHospitalVisit = latestMsg.entities || [];
                responseText = await orbyService.findPatientHospitalVisit(entitiesForHospitalVisit, shc_code, qr_code);
                break;
            case 'action_find_last_record':
                responseText = await orbyService.findPatientLastRecord(shc_code, qr_code);
                break;
            case 'action_find_last_hospital_visit':
                responseText = await orbyService.findPatientLastHospitalVisit(shc_code, qr_code);
                break;
            case 'action_find_last_hospitalization':
                responseText = await orbyService.findPatientLastHospitalization(shc_code, qr_code);
                break;
            case 'action_find_last_surgery':
                responseText = await orbyService.findPatientLastSurgery(shc_code, qr_code);
                break;
            case 'action_find_last_activity':
                responseText = await orbyService.findPatientLastActivity(shc_code, qr_code);
                break;
            case 'action_check_allergy':
                responseText = await orbyService.checkPatientAllergy(shc_code, qr_code);
                break;
            case 'action_check_habits':
                responseText = await orbyService.checkPatientHabits(shc_code, qr_code);
                break;
            case 'action_check_pregnancy':
                responseText = await orbyService.checkPatientPregnancy(shc_code, qr_code);
                break;
            case 'action_get_patient_overview':
                responseText = await orbyService.getPatientOverview(shc_code, qr_code);
                break;
            case 'action_get_contact_info':
                responseText = await orbyService.getPatientContactInfo(shc_code, qr_code);
                break;
            case 'action_find_past_diagnoses':
                responseText = await orbyService.findPatientPastDiagnoses(shc_code, qr_code);
                break;
            case 'action_find_current_medications':
                responseText = await orbyService.findPatientCurrentMedications(shc_code, qr_code);
                break;
            case 'action_find_doctor_visit':
                let entitiesForDoctorVisit: RasaEntity[] = latestMsg.entities || [];
                if (entitiesForDoctorVisit.length > 1) {
                    const combinedName = entitiesForDoctorVisit.map(e => e.value).join(' ');
                    entitiesForDoctorVisit = [{
                        entity: 'doctor_name',
                        value: combinedName
                    }];
                }
                responseText = await orbyService.findPatientDoctorVisit(entitiesForDoctorVisit, shc_code, qr_code);
                break;
            case 'action_find_lab_results':
                const labResultsEntities = latestMsg.entities || [];
                responseText = await orbyService.findPatientLabResults(labResultsEntities, shc_code, qr_code);
                break;
            case 'action_find_emergency_contact':
                const emgEntities = latestMsg.entities || [];
                responseText = await orbyService.findPatientEmergencyContact(emgEntities, shc_code, qr_code);
                break;
            case 'action_get_health_tip':
                const healthTipEntities = latestMsg.entities || [];
                responseText = await orbyService.getHealthTip(healthTipEntities);
                break;
            case 'action_find_specialist':
                const doctorEntities = latestMsg.entities || [];
                responseText = await orbyService.findSpecialistDoctor(doctorEntities);
                break;
            case 'action_find_hospital':
                const findHospitalEntities = latestMsg.entities || [];
                responseText = await orbyService.findHospital(findHospitalEntities);
                break;
            case 'action_get_record_count':
                const recordEntities = latestMsg.entities || [];
                responseText = await orbyService.getRecordCount(recordEntities, shc_code, qr_code);
                break;
            case 'action_find_treatments_for_diagnosis':
                const findTreatmentEntities = latestMsg.entities || [];
                responseText = await orbyService.findTreatmentsForDiagnosis(findTreatmentEntities, shc_code, qr_code);
                break;
            // Add other cases here...
        }
    } catch (error) {
        console.error("Error handling action:", error);
        // It's good practice to also handle the error case with a user-friendly message
        responseText = "I'm sorry, but I encountered an error while processing your request.";
    }

    res.json({
        responses: [{ "text": responseText }],
        events: [{ "event": "bot", "text": responseText }]
    });
};