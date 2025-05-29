const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const leadroutes = require('./routes/LeadRoutes');
const cors = require('cors');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
//cors allow all origins
app.use(cors());
// Middleware
app.use(bodyParser.json());
app.use('/api/lead', leadroutes);

app.get('/', (req, res) => {
  res.send('API is working!');
});
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  // Start server only after DB is connected
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
