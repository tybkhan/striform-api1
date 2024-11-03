const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Form = require('../models/Form');

// Get all responses for a form
router.get('/form/:formId', async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new response
router.post('/', async (req, res) => {
  try {
    const response = new Response(req.body);
    const newResponse = await response.save();

    // Update form response count
    await Form.findOneAndUpdate(
      { id: req.body.formId },
      { $inc: { responseCount: 1 } }
    );

    res.status(201).json(newResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;