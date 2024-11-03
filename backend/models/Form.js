const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  questions: [{
    id: String,
    type: String,
    question: String,
    options: [String],
    statement: String,
    image: {
      url: String,
      placement: String,
      position: String
    },
    fileUploadConfig: {
      maxFiles: Number,
      acceptedFileTypes: [String],
      maxFileSize: Number
    }
  }],
  responseCount: {
    type: Number,
    default: 0
  },
  buttonText: String,
  textAlign: String,
  submitButtonColor: String,
  titleColor: String,
  questionColor: String,
  descriptionColor: String,
  redirectUrl: String,
  capturePartialSubmissions: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Form', formSchema);