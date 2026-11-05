const transporter = require("../config/emailConfig");

function createEmailService(emailTransporter) {

    async function sendEmail(mailOptions) {

        try {
            const info = await emailTransporter.sendMail(mailOptions);

            console.log("Email sent successfully:", info.messageId);

            return info;

        } catch (error) {

            console.error("Email sending failed:", error.message);

            throw error;
        }
    }

    return sendEmail;
}

const sendEmail = createEmailService(transporter);

sendEmail.createEmailService = createEmailService;

module.exports = sendEmail;