// Shared "From" header for all outgoing emails (alerts, contact form, daily cron).
// Display name stays constant even before a custom domain is verified in Resend —
// the address falls back to Resend's sandbox sender until RESEND_FROM_EMAIL points
// at a verified domain (e.g. alerts@sardhahab.com).
export const EMAIL_FROM = `سعر الذهب | SARD <${process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"}>`;
