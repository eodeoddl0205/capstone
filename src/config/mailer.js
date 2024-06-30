require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "skoollenGBSW@gmail.com",
        pass: "bttkxxglnauyyaqv",
    },
});

exports.sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: "skoollenGBSW@gmail.com",
            to: to,
            subject: subject,
            text: text,
        });
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};