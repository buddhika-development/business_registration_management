import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

export async function sendMail({ to, subject, html }) {
    const fromName = process.env.MAIL_FROM_NAME || 'BRN System';
    const fromEmail = process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER;
    const info = await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to, subject, html
    });
    return info?.messageId;
}
