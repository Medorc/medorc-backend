import { Resend } from "resend";
import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async (toEmail: string, otp: string, role: string) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #0d9488; margin: 0; font-size: 24px;">MEDORC</h1>
        <p style="color: #64748b; margin: 5px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Health Orchestrator</p>
      </div>
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; text-align: center; border: 1px solid #f1f5f9;">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 18px;">Password Reset Request</h2>
        <p style="color: #334155; font-size: 14px; line-height: 1.5;">You requested a password reset for your Medorc <strong>${role.toUpperCase()}</strong> account (<code>${toEmail}</code>).</p>
        <div style="margin: 25px 0;">
          <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0d9488; background-color: #ccfbf1; padding: 10px 20px; border-radius: 8px; border: 1px border #99f6e4; display: inline-block;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 12px;">This verification OTP code is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} Medorc Health Orchestration Platform. All rights reserved.
      </div>
    </div>
    `;

    // Priority 1: Resend HTTPS REST API (Port 443 - 100% Reliable on Render/Cloud)
    if (resendApiKey) {
        try {
            const resend = new Resend(resendApiKey);
            let { data, error } = await resend.emails.send({
                from: "Medorc Health Security <onboarding@resend.dev>",
                to: [toEmail],
                subject: `🔐 ${otp} is your Medorc Password Reset Code`,
                html: htmlContent,
            });

            // Resend test domain restriction: if sending to unverified external email in test mode, deliver copy to account owner
            if (error && error.message?.includes("testing emails")) {
                console.warn(`[RESEND TEST MODE] Forwarding verification code to account owner email (noreply.medorc@gmail.com)`);
                const retry = await resend.emails.send({
                    from: "Medorc Health Security <onboarding@resend.dev>",
                    to: ["noreply.medorc@gmail.com"],
                    subject: `🔐 [For ${toEmail}] ${otp} is your Medorc Password Reset Code`,
                    html: htmlContent,
                });
                data = retry.data;
                error = retry.error;
            }

            if (!error && data) {
                console.log(`[RESEND API SUCCESS] Email dispatched via Resend:`, data);
                return { sent: true };
            } else if (error) {
                console.error(`[RESEND API ERROR]`, error);
            }
        } catch (resendError) {
            console.error(`[RESEND EXCEPTION]`, resendError);
        }
    }

    // Priority 2: Nodemailer SMTP Fallback
    if (smtpUser && smtpPass) {
        try {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                tls: { rejectUnauthorized: false },
                auth: { user: smtpUser, pass: smtpPass },
            } as any);

            await transporter.sendMail({
                from: `"Medorc Health Security" <${smtpUser}>`,
                to: toEmail,
                subject: `🔐 ${otp} is your Medorc Password Reset Code`,
                html: htmlContent,
            });

            console.log(`[SMTP SUCCESS] Reset OTP email sent to ${toEmail} via SMTP.`);
            return { sent: true };
        } catch (smtpError) {
            console.error(`[SMTP ERROR] Failed to send via SMTP:`, smtpError);
        }
    }

    return { sent: false };
};
