const mongoose = require('mongoose');
const workflowConfigSchema = new mongoose.Schema({
  name: String,
  description: String,
  webhookUrl: { type: String, unique: true },
  emailEnabled: Boolean,
  databaseEnabled: Boolean,
  notificationEnabled: Boolean,
  active: Boolean,
  lastTriggered: Date,
  totalExecutions: { type: Number, default: 0 },
}, {
  timestamps: true
});

const WorkflowConfig = mongoose.model('WorkflowConfig', workflowConfigSchema);
module.exports = WorkflowConfig;