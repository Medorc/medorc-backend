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