// backend/models/EngineerProfile.js
const mongoose = require('mongoose');

const EngineerProfileSchema = new mongoose.Schema({
  // Link to the User model if an engineer is also a user
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Fields from your JoinNetwork form
  firstName: { type: String }, // Assuming you'll split fullName
  lastName: { type: String },
  email: { type: String, required: true, unique: true }, // Ensure consistency
  phone: { type: String },
  company: { type: String },
  serviceType: { type: String },
  experience: { type: String }, // Or Number if storing years directly
  location: { type: String },
  specialties: { type: String }, // Consider making this an array: [String]
  termsAgreed: { type: Boolean, default: false },
  marketingOptIn: { type: Boolean, default: false },
  // Add other fields from EngineerProfile.tsx if needed
  avatar_url: { type: String },
  bio: { type: String },
  certifications: [String],
  hourly_rate: { type: Number },
  rating: { type: Number, default: 0 },
  total_projects: { type: Number, default: 0 },
  availability: { type: String, enum: ['available', 'busy', 'unavailable'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EngineerProfile', EngineerProfileSchema);