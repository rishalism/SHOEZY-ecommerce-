require('dotenv').config({ path: '.env' });
const nodemailer = require('nodemailer');

const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD;
const sendForgotPassOtp = function (email, otp, username) {
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
        subject:'Your Password Reset OTP',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <p style="font-size: 16px; color: #333;">Dear ${username},</p>

                <p style="font-size: 16px; color: #333;">Your OTP to reset your password is: <strong>${otp}</strong></p>

                <p style="font-size: 16px; color: #333;">If you didn't request this, please disregard this email.</p>

                <p style="font-size: 16px; color: #333;">Best,<br>Shoezy</p>
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

module.exports = { sendForgotPassOtp };
