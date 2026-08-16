import * as healthTipService from "../../services/health-tips.service.js";
import {} from 'express';
export const randomHealthTip = async (req, res) => {
    try {
        const result = await healthTipService.getRandom();
        res.status(200).json({
            status: "success",
            healthTip: result,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//# sourceMappingURL=health-tips.controller.js.map