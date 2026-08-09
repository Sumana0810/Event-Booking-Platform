const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Create Gmail transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Check email configuration when the server starts
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Email configuration error:", error);
    } else {
        console.log("✅ Email server is ready to send messages");
    }
});

// Send booking confirmation email
const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        const mailOptions = {
            from: `"EventBooking" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    padding: 20px;
                ">
                    <h2>Hi ${userName}!</h2>

                    <p>
                        Your booking for the event
                        <strong>${eventTitle}</strong>
                        has been successfully confirmed.
                    </p>

                    <p>
                        Thank you for choosing
                        <strong>EventBooking</strong>.
                    </p>

                    <p>
                        We hope you enjoy the event!
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        console.log(
            "✅ Booking email sent successfully to:",
            userEmail
        );

    } catch (error) {
        console.error(
            "❌ Error sending booking email:",
            error
        );

        throw error;
    }
};

// Send OTP email
const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title =
            type === "account_verification"
                ? "Verify Your EventBooking Account"
                : "EventBooking Booking Verification";

        const msg =
            type === "account_verification"
                ? "Please use the following OTP to verify your new EventBooking account."
                : "Please use the following OTP to verify and confirm your event booking.";

        const mailOptions = {
            from: `"EventBooking" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: title,
            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 20px;
                    background-color: #ffffff;
                ">

                    <h2 style="
                        color: #111111;
                    ">
                        ${title}
                    </h2>

                    <p style="
                        color: #555555;
                        font-size: 16px;
                    ">
                        ${msg}
                    </p>

                    <div style="
                        margin: 20px auto;
                        padding: 15px;
                        font-size: 28px;
                        font-weight: bold;
                        background: #f4f4f4;
                        width: max-content;
                        letter-spacing: 6px;
                        border-radius: 8px;
                        border: 2px dashed #2563eb;
                        color: #2563eb;
                    ">
                        ${otp}
                    </div>

                    <p style="
                        color: #999999;
                        font-size: 13px;
                    ">
                        This OTP is valid for
                        <strong>5 minutes</strong>.
                        Please do not share it with anyone.
                    </p>

                    <p style="
                        color: #999999;
                        font-size: 12px;
                    ">
                        If you didn't request this,
                        you can safely ignore this email.
                    </p>

                    <hr style="
                        margin: 25px 0;
                        border: none;
                        border-top: 1px solid #eeeeee;
                    ">

                    <p style="
                        font-size: 14px;
                        color: #666666;
                    ">
                        Thanks,<br>
                        <strong>EventBooking Team</strong>
                    </p>

                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        console.log(
            `✅ OTP sent successfully to ${userEmail} for ${type}`
        );

    } catch (error) {
        console.error(
            "❌ Error sending OTP email:",
            error
        );

        // Send the error back to auth.js
        // so registration doesn't say
        // "OTP sent" when email actually failed.
        throw error;
    }
};

module.exports = {
    sendBookingEmail,
    sendOTPEmail
};
