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
    html: `<p>Welcome to Takusu! Click on this <a href="${verificationCode}">LINK</a> to log in the app. <br>Your temporary password is "${tempPass}". <br>After logging in, please immediately change your password. <br>Thank you!</p>`,
  });
};

module.exports = emailsHelper;
