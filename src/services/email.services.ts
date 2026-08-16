export const sendPasswordResetEmail = async (toEmail: string, otp: string, role: string) => {
    const brevoApiKey = (process.env.BREVO_API_KEY || "").trim();
    const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_USER || "ilakkiyanj03@gmail.com";

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

    if (brevoApiKey) {
        try {
            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "api-key": brevoApiKey,
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({
                    sender: { name: "Medorc Health Security", email: senderEmail },
                    to: [{ email: toEmail }],
                    subject: `🔐 ${otp} is your Medorc Password Reset Code`,
                    htmlContent: htmlContent
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`[BREVO API SUCCESS] Email delivered directly to ${toEmail}:`, data);
                return { sent: true };
            } else {
                const errorText = await response.text();
                console.error(`[BREVO API ERROR] HTTP ${response.status}:`, errorText);
            }
        } catch (err) {
            console.error(`[BREVO EXCEPTION]`, err);
        }
    } else {
        console.error(`[BREVO NOTICE] BREVO_API_KEY is missing from environment variables.`);
    }

    return { sent: false };
};
