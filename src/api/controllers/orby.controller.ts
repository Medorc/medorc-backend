import { type Request, type Response } from "express";
import * as orbyService from "../../services/orby.services.js";

type RasaEntity = {
    entity: string;
    value: any;
    // You can add other properties like start, end, etc. if you need them
};

export const handleWebhook = async (req: Request, res: Response) => {
    const actionName = req.body.next_action;
    const metadata = req.body.tracker.latest_message.metadata;
    let responseText = "Sorry, I can't handle that action right now.";

    try {
        switch (actionName) {
            case 'action_find_hospital_visit':
                let entitiesForHospitalVisit = req.body.tracker.latest_message.entities;
                responseText = await orbyService.findPatientHospitalVisit(entitiesForHospitalVisit, metadata.shc_code, metadata.qr_code);
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
            case 'action_find_doctor_visit':
                let entitiesForDoctorVisit: RasaEntity[] = req.body.tracker.latest_message.entities || [];
                console.log(entitiesForDoctorVisit);
                if (entitiesForDoctorVisit.length > 1) {
                    const combinedName = entitiesForDoctorVisit.map(e => e.value).join(' ');
                    entitiesForDoctorVisit = [{
                        entity: 'doctor_name',
                        value: combinedName
                    }];
                }
                responseText = await orbyService.findPatientDoctorVisit(entitiesForDoctorVisit, metadata.shc_code, metadata.qr_code);
                break;
            case 'action_find_lab_results':
                const labResultsEntities = req.body.tracker.latest_message.entities || [];
                responseText = await orbyService.findPatientLabResults(labResultsEntities, metadata.shc_code, metadata.qr_code);
                break;
            case 'action_find_emergency_contact':
                const emgEntities = req.body.tracker.latest_message.entities || [];
                responseText = await orbyService.findPatientEmergencyContact(emgEntities, metadata.shc_code, metadata.qr_code);
                break;
            case 'action_get_health_tip':
                const healthTipEntities = req.body.tracker.latest_message.entities || [];
                responseText = await orbyService.getHealthTip(healthTipEntities);
                break;
            case 'action_find_specialist':
                const doctorEntities = req.body.tracker.latest_message.entities || [];
                responseText = await orbyService.findSpecialistDoctor(doctorEntities);
                break;
            case 'action_find_hospital':
                const findHospitalEntities = req.body.tracker.latest_message.entities || [];
                responseText = await orbyService.findHospital(findHospitalEntities);
                break;
            case 'action_get_record_count':
                const recordEntities = req.body.tracker.latest_message.entities || [];
                responseText = await orbyService.getRecordCount(recordEntities, metadata.shc_code, metadata.qr_code);
                break;
            case 'action_find_treatments_for_diagnosis':
                const findTreatmentEntities = req.body.tracker.latest_message.entities || [];
                responseText = await orbyService.findTreatmentsForDiagnosis(findTreatmentEntities, metadata.shc_code, metadata.qr_code);
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