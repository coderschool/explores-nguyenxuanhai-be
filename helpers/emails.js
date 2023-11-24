const { createTransport } = require("nodemailer");
const env = process.env;

const emailsHelper = {};

// send mail
const transporter = createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: env.EMAIL,
    pass: env.SMTP_PASSWORD,
  },
});

emailsHelper.sendInvitationLink = async function (
  toEmail,
  verificationCode,
  tempPass
) {
  await transporter.sendMail({
    from: env.EMAIL,
    to: toEmail,
    subject: "Confirm your email with Tasuku",
    html: `<p>Welcome to Tasuku! Click on this <a href="${verificationCode}">LINK</a> to log in the app. <br>Your temporary password is "${tempPass}". <br>After logging in, please immediately change your password. <br>Thank you!</p>`,
  });
};

emailsHelper.sendUserConfirmationLink = async function (
  toEmail,
  verificationCode
) {
  await transporter.sendMail({
    from: env.EMAIL,
    to: toEmail,
    subject: "Confirm your email with Tasuku",
    html: `<p>Welcome to Tasuku! Click on this <a href="${verificationCode}">LINK</a> to verify your email. <br>Thank you!</p>`,
  });
};

emailsHelper.sendResetLink = async function (toEmail, resetLink) {
  await transporter.sendMail({
    from: env.EMAIL,
    to: toEmail,
    subject: "Reset password for Tasuku account",
    html: `<p>Welcome back to Tasuku! Click on this <a href="${resetLink}">LINK</a> to go to reset password page. <br>Thank you!</p>`,
  });
};

module.exports = emailsHelper;
