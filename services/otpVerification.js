require('dotenv').config({ path: '.env' });
const nodemailer = require('nodemailer');

const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD;
const sendVerificationEmail = function (email, otp,username) {
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
        text: `Hi [${username}],

        Your OTP for Shoezy: ${otp}
        
        Use this code on Shoezy to complete your email verification.
        
        Cheers,
        The Shoezy Team`,
        envelope: {
            from: emailUsername,
            to: [email],
        },
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error(error);
        }
        console.log(`email sent to ${email}` );
    });
};

module.exports = { sendVerificationEmail };
