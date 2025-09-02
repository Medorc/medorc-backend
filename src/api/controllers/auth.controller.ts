import * as authService from "../../services/auth.services.js";
import {type Request, type Response} from "express";
import {createPatient} from "../../services/patient.services.js";

export const signinUser = async (req: Request, res: Response) => {
    try{
        const {email, password, role} = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, password, and role are required.' });
        }
        const {token} = await authService.login(email,password,role);
        res.status(200).json({
            message: 'User logged in successfully',
            token
        });
    }catch (err){
        let errorMessage = 'An unexpected error occurred.';

        // Type Guard: Check if `err` is an Error object
        if (err instanceof Error) {
            errorMessage = err.message;
        }

        if (errorMessage === 'Invalid credentials.') {
            return res.status(401).json({ error: errorMessage }); // 401 Unauthorized
        }

        if (errorMessage === 'Invalid user specified.' || errorMessage === 'Invalid role specified.') {
            return res.status(404).json({ error: errorMessage }); // 404 Not Found
        }

        // For all other unexpected errors, send a 500
        console.error(err); // It's good practice to log the actual error on the server
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export const signupUser = async(req: Request,res: Response)=>{
    try {
        const {role, ...userDetails} = req.body;
        if (!role) {
            return res.status(400).json({error: 'Role is required'});
        }
        let result = null;

        if (role == "patient") {
            result = await createPatient(userDetails);
        }else {
            // Handle other roles or throw an error
            return res.status(400).json({ error: 'Invalid role specified' });
        }

        return res.status(201).json({
            message: 'User created successfully',
            data: result,
        });

    }catch (err) {
        let errorMessage = 'An unexpected error occurred.';

        // Check if the error is from Prisma, e.g., for a unique constraint violation
        if (err && typeof err === 'object' && 'code' in err && err.code === 'P2002') {
            return res.status(409).json({ error: 'A user with this email already exists.' });
        }

        if (err instanceof Error) {
            errorMessage = err.message;
        }

        // Return a 400 for client-side errors or 500 for server errors
        res.status(400).json({ error: errorMessage });
    }

}