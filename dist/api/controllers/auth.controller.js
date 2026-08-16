import * as authService from "../../services/auth.services.js";
import {} from "express";
import { createPatient } from "../../services/patient.services.js";
import { createDoctor } from "../../services/doctor.services.js";
import { createHospital } from "../../services/hospital.services.js";
import { createExtern } from "../../services/extern.services.js";
export const handleLogin = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, password, and role are required.' });
        }
        const { token, shc_code } = await authService.login(email, password, role);
        res.status(200).json({
            message: 'User logged in successfully',
            token,
            role,
            shc_code
        });
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
        return res.status(401).json({ error: errorMessage });
    }
};
export const handleGoogleAuth = async (req, res) => {
    try {
        const { credential, role } = req.body;
        if (!credential) {
            return res.status(400).json({ error: "Google credential token is required." });
        }
        const result = await authService.googleAuthLogin(credential, role);
        return res.status(200).json({
            message: "Google Authentication successful",
            token: result.token,
            role: result.role,
            shc_code: result.shc_code
        });
    }
    catch (err) {
        if (err?.isNewUser) {
            return res.status(404).json({
                isNewUser: true,
                error: err.message,
                email: err.userData?.email,
                name: err.userData?.name,
                picture: err.userData?.picture
            });
        }
        const errorMessage = err instanceof Error ? err.message : "Google authentication failed.";
        return res.status(400).json({ error: errorMessage });
    }
};
export const handleCheckEmail = async (req, res) => {
    try {
        const email = String(req.query.email || "");
        const role = String(req.query.role || "patient");
        const result = await authService.checkEmailExists(email, role);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(200).json({ exists: false });
    }
};
export const handleForgotPassword = async (req, res) => {
    try {
        const { email, role } = req.body;
        if (!email || !role) {
            return res.status(400).json({ error: "Email and role are required." });
        }
        const result = await authService.requestPasswordReset(email, role);
        return res.status(200).json(result);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to request password reset.";
        return res.status(400).json({ error: errorMessage });
    }
};
export const handleResetPassword = async (req, res) => {
    try {
        const { email, role, otp, newPassword } = req.body;
        if (!email || !role || !otp || !newPassword) {
            return res.status(400).json({ error: "Email, role, OTP code, and new password are required." });
        }
        const result = await authService.resetPassword(email, role, otp, newPassword);
        return res.status(200).json(result);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to reset password.";
        return res.status(400).json({ error: errorMessage });
    }
};
export const handleSignup = async (req, res) => {
    try {
        const { role, ...userDetails } = req.body;
        if (!role) {
            return res.status(400).json({ error: 'Role is required' });
        }
        let result = null;
        if (role == "patient") {
            result = await createPatient(userDetails);
        }
        else if (role == "doctor") {
            result = await createDoctor(userDetails);
        }
        else if (role == "hospital") {
            result = await createHospital(userDetails);
        }
        else if (role == "extern") {
            result = await createExtern(userDetails);
        }
        else {
            // Handle other roles or throw an error
            return res.status(400).json({ error: 'Invalid role specified' });
        }
        return res.status(201).json({
            message: 'User created successfully',
            data: result,
        });
    }
    catch (err) {
        if (err?.code === 'P2002' && err.meta?.target) {
            const field = err.meta.target[0]; // e.g., 'email' or 'phone_no'
            const friendlyField = field.replace('_', ' '); // 'phone no'
            // Send a specific and helpful error message
            return res.status(409).json({
                error: `An account with this ${friendlyField} already exists.`
            });
        }
        // Fallback for other errors
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
        res.status(400).json({ error: errorMessage });
    }
};
//# sourceMappingURL=auth.controller.js.map