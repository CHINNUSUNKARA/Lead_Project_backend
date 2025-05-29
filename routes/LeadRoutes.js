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
    // Save lead to DB
    const lead = new Lead({ name, email, phone, message });
    await lead.save();

    // Send to n8n webhook
    await axios.post('https://varunkumarsunkara39.app.n8n.cloud/webhook/api/lead', {
      name,
      email,
      phone,
      message
    });

    res.status(201).json({ success: true, lead });
  } catch (err) {
    console.error(`Error saving lead or sending to n8n:`, err);
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
