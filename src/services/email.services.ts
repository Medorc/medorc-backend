import { Resend } from "resend";

export const sendPasswordResetEmail = async (toEmail: string, otp: string, role: string) => {
    const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
    if (!resendApiKey) {
        console.error("[RESEND SERVICE NOTICE] RESEND_API_KEY is missing from environment variables.");
        return { sent: false };
    }
    const resend = new Resend(resendApiKey);

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #0d9488; margin: 0; font-size: 24px;">MEDORC</h1>
        <p style="color: #64748b; margin: 5px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Health Orchestrator</p>
      </div>
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; text-align: center; border: 1px solid #f1f5f9;">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 18px;">Password Reset Request</h2>
        <p style="color: #334155; font-size: 14px; line-height: 1.5;">You requested a password reset for your Medorc <strong>${role.toUpperCase()}</strong> account (<code>${toEmail}</code>).</p>
        <div style="margin: 25px 0;">
          <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0d9488; background-color: #ccfbf1; padding: 10px 20px; border-radius: 8px; border: 1px solid #99f6e4; display: inline-block;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 12px;">This verification OTP code is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} Medorc Health Orchestration Platform. All rights reserved.
      </div>
    </div>
    `;

    // 1. Try Resend REST API direct to requested recipient
    try {
        const { data, error } = await resend.emails.send({
            from: "Medorc Health Security <onboarding@resend.dev>",
            to: [toEmail],
            subject: `🔐 ${otp} is your Medorc Password Reset Code`,
            html: htmlContent,
        });

        if (!error && data) {
            console.log(`[RESEND API SUCCESS] Email delivered directly to ${toEmail}:`, data);
            return { sent: true };
        } else if (error) {
            console.warn(`[RESEND NOTICE] ${error.message}`);
        }
    } catch (resendErr) {
        console.warn(`[RESEND EXCEPTION]`, resendErr);
    }

    // 2. Fallback: Nodemailer SMTPS Port 465 IPv4 (Can send to ANY email address in the world!)
    const smtpUser = process.env.SMTP_USER || "noreply.medorc@gmail.com";
    const smtpPass = process.env.SMTP_PASS || "pqjjirwouvsjhlrq";

    if (smtpUser && smtpPass) {
        try {
            const nodemailer = await import("nodemailer");
            const dns = await import("dns");

            const transporter = nodemailer.default.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                lookup: (hostname: string, options: any, callback: any) => {
                    dns.lookup(hostname, { family: 4 }, (err, address, family) => {
                        callback(err, address, family);
                    });
                },
                tls: { rejectUnauthorized: false, servername: "smtp.gmail.com" },
                connectionTimeout: 10000,
                auth: { user: smtpUser, pass: smtpPass.replace(/\s+/g, "") },
            } as any);

            await transporter.sendMail({
                from: `"Medorc Health Security" <${smtpUser}>`,
                to: toEmail,
                subject: `🔐 ${otp} is your Medorc Password Reset Code`,
                html: htmlContent,
            });

            console.log(`[SMTP SMTPS SUCCESS] Email delivered directly to ${toEmail} via Gmail SMTP.`);
            return { sent: true };
        } catch (smtpErr) {
            console.error(`[SMTP ERROR]`, smtpErr);
        }
    }

    return { sent: false };
};
