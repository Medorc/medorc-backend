import * as healthTipService from "../../services/health-tips.service.js";
import {type Request, type Response} from 'express';

export const randomHealthTip = async(req: Request, res: Response) => {
    try{
        const result = await healthTipService.getRandom();
        res.status(200).json({
            status: "success",
            healthTip: result,
        });
    }
    catch(err){
        res.status(500).json({ error: (err as Error).message });
    }
}