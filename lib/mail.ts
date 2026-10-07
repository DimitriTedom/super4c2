/**
 * ============================================================
 * SUPER4C2 TRANSACTIONAL EMAIL SERVICE
 * Supports SMTP (Resend, Brevo, SendGrid, Postmark, AWS SES, Gmail)
 * Falls back to structured simulation if SMTP env variables are unset.
 * ============================================================
 */

import nodemailer from "nodemailer";

export interface SendMailOptions {
  to: string;
  subject: string;
  headline?: string;
  contentHtml: string;
  ctaText?: string;
  ctaUrl?: string;
}

export async function sendEmail({
  to,
  subject,
  headline,
  contentHtml,
  ctaText,
  ctaUrl,
}: SendMailOptions): Promise<{ ok: boolean; messageId?: string; simulated?: boolean; error?: string }> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM || "Super4C2 <contact@super4c2.com>";

  const fullHtml = generateBrandedEmailHtml({
    subject,
    headline: headline || subject,
    bodyHtml: contentHtml,
    ctaText,
    ctaUrl,
  });

  // If SMTP is not yet configured by the user in .env, simulate cleanly
  if (!host || !user || !pass) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n📧 [EMAIL SIMULÉ - SUPER4C2]`);
      console.log(`➡️ Pour : ${to}`);
      console.log(`📌 Objet : ${subject}`);
      console.log(`🔗 CTA : ${ctaText || "N/A"} (${ctaUrl || "N/A"})`);
      console.log(`---------------------------------------------------\n`);
    }
    return { ok: true, simulated: true, messageId: `sim-${Date.now()}` };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: fullHtml,
    });

    return { ok: true, messageId: info.messageId };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("❌ Erreur envoi email :", errorMsg);
    return { ok: false, error: errorMsg };
  }
}

function generateBrandedEmailHtml(params: {
  subject: string;
  headline: string;
  bodyHtml: string;
  ctaText?: string;
  ctaUrl?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B132B; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
    .header { background: #0B132B; padding: 28px 32px; text-align: center; border-bottom: 3px solid #E51A31; }
    .logo { color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .logo span { color: #E51A31; }
    .content { padding: 36px 32px; line-height: 1.6; font-size: 15px; color: #334155; }
    .headline { font-size: 20px; font-weight: 700; color: #0B132B; margin-top: 0; margin-bottom: 16px; }
    .button-container { text-align: center; margin: 30px 0; }
    .button { background-color: #E51A31; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 2px 8px rgba(229,26,49,0.3); }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">SUPER<span>4C2</span> 🇨🇦</div>
      <div style="color: #94a3b8; font-size: 11px; margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Préparation Officielle TCF & TEF Canada</div>
    </div>
    <div class="content">
      <h1 class="headline">${params.headline}</h1>
      ${params.bodyHtml}
      ${
        params.ctaText && params.ctaUrl
          ? `<div class="button-container"><a href="${params.ctaUrl}" class="button">${params.ctaText} →</a></div>`
          : ""
      }
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Super4C2 — Conforme aux barèmes IRCC Entrée Express.</p>
      <p>Pour toute question pédagogique : <a href="mailto:contact@super4c2.com" style="color:#E51A31;">contact@super4c2.com</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
