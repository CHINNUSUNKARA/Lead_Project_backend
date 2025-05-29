const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Lead = mongoose.model('Lead', leadSchema);
module.exports =Lead
