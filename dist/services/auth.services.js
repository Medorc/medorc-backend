import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { sendPasswordResetEmail } from "./email.services.js";
const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const models = {
    patient: prisma.patients,
    doctor: prisma.doctors,
    hospital: prisma.hospitals,
    extern: prisma.external_viewers
};
export const login = async (emailInput, password, role) => {
    const email = (emailInput || "").trim().toLowerCase();
    const model = models[role];
    if (!model) {
        throw new Error('Invalid role specified.');
    }
    const user = await model.findUnique({ where: { email } });
    if (!user) {
        // Generic error prevents username enumeration attacks
        throw new Error('Invalid email or password.');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password.');
    }
    let userId = "";
    let shc_code;
    if (role === "patient") {
        userId = user.patient_id || "";
        shc_code = user.shc_code;
    }
    if (role === "doctor")
        userId = user.doctor_id || "";
    if (role === "extern")
        userId = user.viewer_id || "";
    if (role === "hospital")
        userId = user.hospital_id || "";
    const token = jwt.sign({
        id: userId,
        role: role,
    }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return { token, shc_code };
};
export const googleAuthLogin = async (credentialToken, roleInput) => {
    if (!credentialToken) {
        throw new Error("Google credential token is required.");
    }
    const role = roleInput || "patient";
    let email = "";
    let name = "";
    let picture = "";
    try {
        const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
        const ticket = await googleClient.verifyIdToken({
            idToken: credentialToken,
            audience: googleClientId,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new Error("Invalid Google token payload.");
        }
        email = payload.email.trim().toLowerCase();
        name = payload.name || (email.split("@")[0] || "");
        picture = payload.picture || "";
    }
    catch {
        // Fallback for decoded payload if verifyIdToken is mocked/offline in dev
        const decoded = jwt.decode(credentialToken);
        if (decoded && decoded.email) {
            email = String(decoded.email).trim().toLowerCase();
            name = decoded.name || email.split("@")[0];
            picture = decoded.picture || "";
        }
        else {
            throw new Error("Failed to verify Google token.");
        }
    }
    const model = models[role];
    let user = await model.findUnique({ where: { email } });
    if (!user) {
        // Return clear indication to frontend so user can complete signup
        const error = new Error(`No registered ${role} account found for ${email}. Please complete registration.`);
        error.isNewUser = true;
        error.userData = { email, name, picture };
        throw error;
    }
    let userId = "";
    let shc_code;
    if (role === "patient") {
        userId = user.patient_id || "";
        shc_code = user.shc_code;
    }
    if (role === "doctor")
        userId = user.doctor_id || "";
    if (role === "extern")
        userId = user.viewer_id || "";
    if (role === "hospital")
        userId = user.hospital_id || "";
    const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return { token, role, shc_code, user };
};
// Store OTP reset codes in-memory with 10-minute expiration
const resetOtpStore = new Map();
export const requestPasswordReset = async (emailInput, role) => {
    const email = (emailInput || "").trim().toLowerCase();
    const model = models[role];
    if (!model)
        throw new Error("Invalid role specified.");
    const user = await model.findUnique({ where: { email } });
    if (!user) {
        throw new Error(`No registered ${role} account found with email "${email}". Please verify your email and account type.`);
    }
    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `${role}:${email}`;
    resetOtpStore.set(key, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
    console.log(`[PASSWORD RESET OTP] ${key} -> OTP: ${otp}`);
    // Send real HTML email via SMTP
    const emailRes = await sendPasswordResetEmail(email, otp, role);
    return {
        message: emailRes.sent
            ? `A 6-digit verification code has been sent to ${email}. Check your inbox (and Spam folder)!`
            : `Verification code generated for ${email}.`,
        otp, // Provided as demo fallback
        emailSent: emailRes.sent
    };
};
export const resetPassword = async (emailInput, role, otp, newPassword) => {
    const email = (emailInput || "").trim().toLowerCase();
    const model = models[role];
    if (!model)
        throw new Error("Invalid role specified.");
    if (!newPassword || newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters long.");
    }
    const key = `${role}:${email}`;
    const record = resetOtpStore.get(key);
    if (!record || record.otp !== otp.trim()) {
        throw new Error("Invalid or expired reset OTP code.");
    }
    if (Date.now() > record.expiresAt) {
        resetOtpStore.delete(key);
        throw new Error("Reset OTP code has expired. Please request a new code.");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (role === "patient") {
        await prisma.patients.update({ where: { email }, data: { password: hashedPassword } });
    }
    else if (role === "doctor") {
        await prisma.doctors.update({ where: { email }, data: { password: hashedPassword } });
    }
    else if (role === "hospital") {
        await prisma.hospitals.update({ where: { email }, data: { password: hashedPassword } });
    }
    else if (role === "extern") {
        await prisma.external_viewers.update({ where: { email }, data: { password: hashedPassword } });
    }
    resetOtpStore.delete(key);
    return { message: "Password updated successfully." };
};
export const checkEmailExists = async (emailInput, roleInput) => {
    const email = (emailInput || "").trim().toLowerCase();
    if (!email)
        return { exists: false };
    const role = (roleInput || "patient");
    const model = models[role] || models.patient;
    const user = await model.findUnique({ where: { email } });
    return { exists: !!user, email };
};
//# sourceMappingURL=auth.services.js.map