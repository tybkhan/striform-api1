const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  formId: {
    type: String,
    required: true
  },
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isPartial: {
    type: Boolean,
    default: false
  },
  lastQuestionAnswered: Number
});

module.exports = mongoose.model('Response', responseSchema);