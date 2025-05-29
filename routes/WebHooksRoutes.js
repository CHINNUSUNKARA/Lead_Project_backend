const express = require('express');
const router = express.Router();
const WorkflowConfig = require('../models/WebhookSchema');
// Create a new workflow
router.post('/', async (req, res) => {
  const {
    name,
    description,
    webhookUrl,
    emailEnabled,
    databaseEnabled,
    notificationEnabled,
    active,
  } = req.body;

  if (!name || !description || !webhookUrl) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const newWorkflow = await WorkflowConfig.create({
      data: {
        name,
        description,
        webhookUrl,
        emailEnabled,
        databaseEnabled,
        notificationEnabled,
        active,
        totalExecutions: 0,
      },
    });
    res.status(201).json(newWorkflow);
  } catch (error) {
    res.status(500).json({ message: 'Error creating workflow', error });
  }
});

// Get all workflows
router.get('/', async (_req, res) => {
  try {
    const workflows = await WorkflowConfig.findMany();
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workflows', error });
  }
});

// Get workflow by ID
router.get('/:id', async (req, res) => {
  try {
    const workflow = await WorkflowConfig.findUnique({
      where: { id: req.params.id },
    });

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    res.json(workflow);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workflow', error });
  }
});

// Update workflow
router.put('/:id', async (req, res) => {
  try {
    const updated = await WorkflowConfig.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating workflow', error });
  }
});

// Delete workflow
router.delete('/:id', async (req, res) => {
  try {
    await WorkflowConfig.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workflow', error });
  }
});

module.exports = router;
