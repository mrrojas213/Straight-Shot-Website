const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone: { type: String, required: true },
  email: {type: String, required: true },
  rental_date: { type: String, required: true},
  reference: { type: String, required: false},
  message: { type: String, required: false}
});

module.exports = mongoose.model('Contact', contactSchema);