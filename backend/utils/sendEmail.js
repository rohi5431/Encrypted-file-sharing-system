const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection once
transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP ERROR:", err.message);
  } else {
    console.log("✅ SMTP READY");
  }
});

const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment variables");
  }

  try {
    const info = await transporter.sendMail({
      from: `"Secure File Share" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html, // optional HTML body
    });

    console.log("✅ Email sent:", info.response);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("❌ Email send error:", err.message);
    return { success: false, error: err.message };
  }
};

module.exports = sendEmail;
