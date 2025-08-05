const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Allow both localhost and deployed portfolio domain
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://node-mail-sender-three.vercel.app",
      "https://www.kisstech.in",
    ], // Add deployed domain here if needed
  })
);

app.use(express.json());

app.post("/send-mail", async (req, res) => {
  const { firstName, lastName, email, phone, course, message } = req.body;

  // Validate required fields
  if (!firstName || !email || !message) {
    return res
      .status(400)
      .json({ error: "firstName, email, and message are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subject = "New Campus Contact Form Submission";
    const text = `
Name: ${firstName} ${lastName || ""}
Email: ${email}
Phone: ${phone || "N/A"}
Course: ${course || "N/A"}
Message: ${message}
    `;

    const mailOptions = {
      from: `"Contact Support" <${process.env.EMAIL_USER}>`,
      to: "kisstechnungabakkam@gmail.com", // Or use a dynamic `to` if needed
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "✅ Email sent successfully!", info });
  } catch (error) {
    console.error("❌ Email Error:", error);
    res
      .status(500)
      .json({ error: "Failed to send email", detail: error.message });
  }
});

const PORT = 2917;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
