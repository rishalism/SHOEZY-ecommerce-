require('dotenv').config({ path: '.env' });
const nodemailer = require('nodemailer');

const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD;

const sendVerificationEmail = function (email, otp, username) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUsername,
            pass: emailPassword
        }
    });

    const mailOptions = {
        from: emailUsername,
        to: email,
        subject: 'OTP Verification',
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <p style="font-size: 16px; color: #333;">Hi ${username},</p>

            <p style="font-size: 16px; color: #333;">Welcome to Shoezy! To ensure the security of your account, we've generated a one-time verification code for you:</p>

            <p style="font-size: 18px; font-weight: bold; color: #007BFF;">Your OTP: ${otp}</p>

            <p style="font-size: 16px; color: #333;">Please use this unique code on Shoezy to complete your email verification process.</p>

            <p style="font-size: 16px; color: #333;">If you didn't request this code, please ignore this message.</p>

            <p style="font-size: 16px; color: #333;">Cheers,<br>The Shoezy Team</p>
        </div>
    `,
        envelope: {
            from: emailUsername,
            to: [email],
        },
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error(error);
        }
        console.log(`email sent to ${email}`);
    });
};

module.exports = { sendVerificationEmail };
