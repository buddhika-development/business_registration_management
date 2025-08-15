import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({ // Fixed: createTransport not createTransporter
    service: 'gmail',
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: 'vidu.umalya2003@gmail.com',
        pass: 'jvus fmha khwo qesc' // Use 'pass' instead of 'password'
    }
});

// Make the function async and add error handling
async function sendMail(to, sub, msg) {
    try {
        const info = await transporter.sendMail({
            from: 'vidu.umalya2003@gmail.com', // Add from field
            to: to,
            subject: sub,
            html: msg
        });
        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

// Use async/await when calling
sendMail("dedimunigeviduni@gmail.com", "This is subject", "This is a test message")
    .catch(console.error);