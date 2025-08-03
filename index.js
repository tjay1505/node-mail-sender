const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Allow both localhost and deployed portfolio domain
app.use(cors({
  origin: ['http://localhost:4200', 'https://vimalraj-vb.github.io']
}));

app.use(express.json());

app.post('/send-mail', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'to, subject, and text are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Contact Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: '✅ Email sent successfully!', info });
  } catch (error) {
    console.error('❌ Email Error:', error);
    res.status(500).json({ error: 'Failed to send email', detail: error.message });
  }
});

const PORT = 2917;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
