import {} from "express";
import * as orbyService from "../../services/orby.services.js";
export const handleWebhook = async (req, res) => {
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
                let entitiesForDoctorVisit = latestMsg.entities || [];
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
    }
    catch (error) {
        console.error("Error handling action:", error);
        // It's good practice to also handle the error case with a user-friendly message
        responseText = "I'm sorry, but I encountered an error while processing your request.";
    }
    res.json({
        responses: [{ "text": responseText }],
        events: []
    });
};
const RASA_SERVER_URL = process.env.RASA_URL || "https://medorc-orby-chatbot.onrender.com";
export const handleOrbyChat = async (req, res) => {
    const { sender, message, shc_code, qr_code, metadata } = req.body || {};
    const text = (message || "").trim();
    const activeShc = shc_code || metadata?.shc_code;
    const activeQr = qr_code || metadata?.qr_code;
    const senderId = sender || `orby_${activeShc || "user"}`;
    if (!text) {
        return res.json({ responses: [{ text: "Please enter a question or message." }] });
    }
    // Try forwarding to RASA REST webhook
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const rasaRes = await fetch(`${RASA_SERVER_URL.replace(/\/$/, '')}/webhooks/rest/webhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sender: senderId,
                message: text,
                metadata: {
                    shc_code: activeShc,
                    qr_code: activeQr
                }
            }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (rasaRes.ok) {
            const data = await rasaRes.json();
            if (Array.isArray(data) && data.length > 0) {
                return res.json({ responses: data });
            }
        }
    }
    catch (err) {
        console.warn("Rasa server unavailable, using direct fallback:", err.message);
    }
    // Direct fallback using intent matching and orbyService
    let responseText = "";
    const lower = text.toLowerCase();
    try {
        if (lower.includes("allergy") || lower.includes("allergies")) {
            responseText = await orbyService.checkPatientAllergy(activeShc, activeQr);
        }
        else if (lower.includes("medication") || lower.includes("meds") || lower.includes("prescription") || lower.includes("medicine")) {
            responseText = await orbyService.findPatientCurrentMedications(activeShc, activeQr);
        }
        else if (lower.includes("emergency") || lower.includes("contact")) {
            responseText = await orbyService.findPatientEmergencyContact([], activeShc, activeQr);
        }
        else if (lower.includes("tip") || lower.includes("advice") || lower.includes("health tip")) {
            responseText = await orbyService.getHealthTip([]);
        }
        else if (lower.includes("hospitalization") || lower.includes("admitted")) {
            responseText = await orbyService.findPatientLastHospitalization(activeShc, activeQr);
        }
        else if (lower.includes("surgery") || lower.includes("operation")) {
            responseText = await orbyService.findPatientLastSurgery(activeShc, activeQr);
        }
        else if (lower.includes("visit") || lower.includes("hospital")) {
            responseText = await orbyService.findPatientLastHospitalVisit(activeShc, activeQr);
        }
        else if (lower.includes("doctor")) {
            responseText = await orbyService.findPatientDoctorVisit([], activeShc, activeQr);
        }
        else if (lower.includes("lab") || lower.includes("report") || lower.includes("result")) {
            responseText = await orbyService.findPatientLabResults([], activeShc, activeQr);
        }
        else if (lower.includes("diagnos")) {
            responseText = await orbyService.findPatientPastDiagnoses(activeShc, activeQr);
        }
        else if (lower.includes("overview") || lower.includes("summary") || lower.includes("profile")) {
            responseText = await orbyService.getPatientOverview(activeShc, activeQr);
        }
        else if (lower.includes("habit") || lower.includes("smoking") || lower.includes("alcohol")) {
            responseText = await orbyService.checkPatientHabits(activeShc, activeQr);
        }
        else if (lower.includes("pregnancy") || lower.includes("pregnant")) {
            responseText = await orbyService.checkPatientPregnancy(activeShc, activeQr);
        }
        else if (lower.includes("count") || lower.includes("how many record")) {
            responseText = await orbyService.getRecordCount([], activeShc, activeQr);
        }
        else if (lower.includes("treatment")) {
            responseText = await orbyService.findTreatmentsForDiagnosis([], activeShc, activeQr);
        }
        else if (lower.includes("activity") || lower.includes("last record") || lower.includes("recent record") || lower.includes("latest record") || lower.includes("history") || lower.includes("recent")) {
            responseText = await orbyService.findPatientLastRecord(activeShc, activeQr);
        }
        else {
            responseText = `Hello! I'm Orby, your Medorc AI Assistant. How can I help you today? You can ask me about:\n` +
                `• **Allergies**: "What are my allergies?"\n` +
                `• **Medications**: "List my active medications"\n` +
                `• **Emergency Contacts**: "Show my emergency contacts"\n` +
                `• **Hospital Visits**: "Show my last hospital visit"\n` +
                `• **Past Diagnoses**: "What are my past diagnoses?"\n` +
                `• **Health Tips**: "Give me a health tip"`;
        }
    }
    catch (fallbackErr) {
        console.error("Error executing direct intent fallback:", fallbackErr);
        responseText = "I'm sorry, I encountered an error processing your query. Please try again.";
    }
    return res.json({
        responses: [{ text: responseText }]
    });
};
//# sourceMappingURL=orby.controller.js.map