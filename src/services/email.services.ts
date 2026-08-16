import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async (toEmail: string, otp: string, role: string) => {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const portEnv = Number(process.env.SMTP_PORT);
    const smtpPort = portEnv && !isNaN(portEnv) ? portEnv : 465;
    const isSecure = smtpPort === 465;

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

    if (smtpUser && smtpPass) {
        try {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                tls: {
                    rejectUnauthorized: false,
                    servername: "smtp.gmail.com"
                },
                // Force IPv4 socket resolution to prevent ENETUNREACH IPv6 errors on Render
                family: 4,
                connectionTimeout: 15000,
                greetingTimeout: 15000,
                socketTimeout: 20000,
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            } as any);

            await transporter.sendMail({
                from: `"Medorc Health Security" <${smtpUser}>`,
                to: toEmail,
                subject: `🔐 ${otp} is your Medorc Password Reset Code`,
                html: htmlContent,
            });

            console.log(`[EMAIL SERVICE SUCCESS] Reset OTP email sent to ${toEmail} via SMTP.`);
            return { sent: true };
        } catch (error) {
            console.error(`[EMAIL SERVICE ERROR] Failed to send email via SMTP:`, error);
        }
    } else {
        console.log(`[EMAIL SERVICE NOTICE] SMTP credentials not set in .env. Logging OTP for local development: ${otp}`);
    }

    return { sent: false };
};
