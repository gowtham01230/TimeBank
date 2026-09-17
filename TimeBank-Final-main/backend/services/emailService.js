
const nodemailer = require('nodemailer');

// Configure your email transport using nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendNegativeFeedbackAlert = async (feedback, reviewedUser, reviewer, job) => {
    const service = await require('../models/Service').findById(job.service);

    const mailOptions = {
        from: `TimeBank Alerts <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: '[TimeBank Alert] Negative Feedback Received',
        html: `
            <h1>Negative Feedback Alert</h1>
            <p>A user has received a low rating, which may require your review.</p>
            <hr>
            <h3>Details:</h3>
            <ul>
                <li><b>Reviewed User:</b> ${reviewedUser.name} (${reviewedUser.email})</li>
                <li><b>Reviewer:</b> ${reviewer.name} (${reviewer.email})</li>
                <li><b>Job:</b> "${service.title}"</li>
                <li><b>Rating:</b> <strong>${feedback.rating} / 5 stars</strong></li>
                <li><b>Comment:</b> "${feedback.comment || 'No comment provided.'}"</li>
            </ul>
            <hr>
            <p>Please log in to the admin dashboard to review this user's activity and take action if necessary.</p>
        `,
    };
    
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Admin alert email sent: %s', info.messageId);
        if (process.env.EMAIL_HOST && process.env.EMAIL_HOST.includes('ethereal.email')) {
             console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error("Failed to send admin alert email:", error);
        // Do not throw error, just log it, so the feedback process is not interrupted
    }
};