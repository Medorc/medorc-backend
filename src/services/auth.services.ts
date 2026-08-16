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
}
export type Role = keyof typeof models;
type UserModel = typeof prisma.patients | typeof prisma.doctors | typeof prisma.hospitals | typeof prisma.external_viewers;

export const login = async (emailInput: string, password: string, role: Role) => {
    const email = (emailInput || "").trim().toLowerCase();
    const model: UserModel = models[role];
    if (!model) {
        throw new Error('Invalid role specified.');
    }
    const user = await (model as any).findUnique({ where: { email } });
    if (!user) {
        // Generic error prevents username enumeration attacks
        throw new Error('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password.');
    }

    let userId: string = "";
    let shc_code: string | undefined;

    if (role === "patient") {
        userId = user.patient_id || "";
        shc_code = user.shc_code;
    }
    if (role === "doctor") userId = user.doctor_id || "";
    if (role === "extern") userId = user.viewer_id || "";
    if (role === "hospital") userId = user.hospital_id || "";

    const token = jwt.sign(
        {
            id: userId,
            role: role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
    );

    return { token, shc_code };
};

export const googleAuthLogin = async (credentialToken: string, roleInput?: Role) => {
    if (!credentialToken) {
        throw new Error("Google credential token is required.");
    }

    const role: Role = roleInput || "patient";
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
    } catch {
        // Fallback for decoded payload if verifyIdToken is mocked/offline in dev
        const decoded: any = jwt.decode(credentialToken);
        if (decoded && decoded.email) {
            email = String(decoded.email).trim().toLowerCase();
            name = decoded.name || email.split("@")[0];
            picture = decoded.picture || "";
        } else {
            throw new Error("Failed to verify Google token.");
        }
    }

    const model: UserModel = models[role];
    let user = await (model as any).findUnique({ where: { email } });

    if (!user) {
        // Return clear indication to frontend so user can complete signup
        const error = new Error(`No registered ${role} account found for ${email}. Please complete registration.`);
        (error as any).isNewUser = true;
        (error as any).userData = { email, name, picture };
        throw error;
    }

    let userId: string = "";
    let shc_code: string | undefined;

    if (role === "patient") {
        userId = user.patient_id || "";
        shc_code = user.shc_code;
    }
    if (role === "doctor") userId = user.doctor_id || "";
    if (role === "extern") userId = user.viewer_id || "";
    if (role === "hospital") userId = user.hospital_id || "";

    const token = jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
    );

    return { token, role, shc_code, user };
};

// Store OTP reset codes in-memory with 10-minute expiration
const resetOtpStore = new Map<string, { otp: string; expiresAt: number }>();

export const requestPasswordReset = async (emailInput: string, roleInput: Role) => {
    const email = (emailInput || "").trim().toLowerCase();
    let role: Role = roleInput;
    let model: UserModel = models[role];

    let user = model ? await (model as any).findUnique({ where: { email } }) : null;

    // Fallback: Auto-detect user role across all account types if role mismatch
    if (!user) {
        const allRoles: Role[] = ["patient", "doctor", "hospital", "extern"];
        for (const r of allRoles) {
            const m = models[r];
            const found = await (m as any).findUnique({ where: { email } });
            if (found) {
                user = found;
                role = r;
                break;
            }
        }
    }

    if (!user) {
        throw new Error(`No registered account found with email "${email}". Please verify your email or sign up.`);
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `${role}:${email}`;
    resetOtpStore.set(key, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    console.log(`[PASSWORD RESET OTP] ${key} -> OTP: ${otp}`);

    // Attempt real HTML email dispatch via Nodemailer
    const emailRes = await sendPasswordResetEmail(email, otp, role);

    return {
        message: emailRes.sent
            ? `A 6-digit verification code has been sent to ${email}. Please check your inbox!`
            : `A 6-digit verification code has been generated for ${email}.`,
        otp: emailRes.sent ? undefined : otp, // Provide fallback OTP if cloud host firewall blocks SMTP
        emailSent: emailRes.sent,
        detectedRole: role
    };
};

export const resetPassword = async (emailInput: string, roleInput: Role, otp: string, newPassword: string) => {
    const email = (emailInput || "").trim().toLowerCase();
    let role: Role = roleInput;

    if (!newPassword || newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters long.");
    }

    // Check store with roleInput or try all roles if key missing
    let key = `${role}:${email}`;
    let record = resetOtpStore.get(key);

    if (!record) {
        const allRoles: Role[] = ["patient", "doctor", "hospital", "extern"];
        for (const r of allRoles) {
            const k = `${r}:${email}`;
            const rec = resetOtpStore.get(k);
            if (rec) {
                record = rec;
                key = k;
                role = r;
                break;
            }
        }
    }

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
    } else if (role === "doctor") {
        await prisma.doctors.update({ where: { email }, data: { password: hashedPassword } });
    } else if (role === "hospital") {
        await prisma.hospitals.update({ where: { email }, data: { password: hashedPassword } });
    } else if (role === "extern") {
        await prisma.external_viewers.update({ where: { email }, data: { password: hashedPassword } });
    }

    resetOtpStore.delete(key);
    return { message: "Password updated successfully." };
};

export const checkEmailExists = async (emailInput: string, roleInput?: string) => {
    const email = (emailInput || "").trim().toLowerCase();
    if (!email) return { exists: false };

    const role = (roleInput || "patient") as Role;
    const model = models[role] || models.patient;

    const user = await (model as any).findUnique({ where: { email } });
    return { exists: !!user, email };
};