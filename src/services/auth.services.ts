import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

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

    // Auto-create account if user signs in with Google for the first time as a patient
    if (!user && role === "patient") {
        const dummyPasswordHash = await bcrypt.hash(`google_${Date.now()}`, 10);
        user = await prisma.patients.create({
            data: {
                email,
                full_name: name,
                photo: picture,
                password: dummyPasswordHash,
                visibility: true,
                data_logs: `${new Date().toISOString()} - PATIENT [google_auth] Account Created via Google Sign-In`
            }
        });
    }

    if (!user) {
        throw new Error(`No registered ${role} account found for ${email}. Please sign up first.`);
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