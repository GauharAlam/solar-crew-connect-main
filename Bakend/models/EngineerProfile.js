// backend/models/EngineerProfile.js
const mongoose = require('mongoose');

const EngineerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  firstName: { type: String, required: [true, 'First name is required'] },
  lastName: { type: String, required: [true, 'Last name is required'] },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
  },
  phone: { type: String },
  company: { type: String },
  // --- CHANGES ARE HERE ---
  serviceType: { type: String }, // Removed 'required'
  experience: { type: String },  // Removed 'required'
  location: { type: String },   // Removed 'required'
  // --- END OF CHANGES ---
  specialties: [String], // Correctly set as Array of Strings
  termsAgreed: { type: Boolean, required: [true, 'You must agree to the terms'] },
  marketingOptIn: { type: Boolean, default: false },
  avatar_url: { type: String },
  bio: { type: String },
  certifications: [String],
  hourly_rate: { type: Number },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  total_projects: { type: Number, default: 0, min: 0 },
  availability: { type: String, enum: ['available', 'busy', 'unavailable'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

EngineerProfileSchema.index({ email: 1 });

module.exports = mongoose.model('EngineerProfile', EngineerProfileSchema);