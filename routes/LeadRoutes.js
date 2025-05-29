const express = require('express');
const router = express.Router();
const Lead = require('../models/lead');
const nodemailer = require('nodemailer');

// POST /api/lead — create new lead
router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const lead = new Lead({ name, email, phone, message });
    await lead.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: lead.email, // Or process.env.EMAIL_RECEIVER
  subject: `📬 New Lead from ${name}`,
  html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Lead</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f9fafb; font-family: 'Segoe UI', Tahoma, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
      <tr>
        <td align="center">
          <table style="max-width:600px; background-color:#ffffff; border-radius:12px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.05); width:100%;">
            <tr>
              <td align="center" style="font-size:24px; font-weight:bold; color:#111827; padding-bottom:20px;">
                📥 New Lead Submission
              </td>
            </tr>

            <tr>
              <td style="padding-bottom:16px;">
                <strong style="color:#374151;">Name:</strong>
                <span style="color:#111827; font-size:16px;">${name}</span>
              </td>
            </tr>

            <tr>
              <td style="padding-bottom:16px;">
                <strong style="color:#374151;">Email:</strong>
                <span style="color:#111827; font-size:16px;">${email}</span>
              </td>
            </tr>

            <tr>
              <td style="padding-bottom:16px;">
                <strong style="color:#374151;">Phone:</strong>
                <span style="color:#111827; font-size:16px;">${phone || 'Not provided'}</span>
              </td>
            </tr>

            <tr>
              <td style="padding-bottom:16px;">
                <strong style="color:#374151;">Message:</strong><br>
                <span style="color:#111827; font-size:16px;">${message || 'No message left'}</span>
              </td>
            </tr>

            <tr>
              <td style="text-align:center; font-size:12px; color:#9ca3af; padding-top:20px;">
                This lead was submitted via your website form.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

  </body>
  </html>
  `
});


    res.status(201).json({ success: true, lead });
  } catch (err) {
    console.error('Error saving lead or sending email:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/lead — list all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

module.exports = router;
