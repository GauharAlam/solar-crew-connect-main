// backend/controllers/engineerController.js
const mongoose = require('mongoose');
const EngineerProfile = require('../models/EngineerProfile');

// @desc    Handle Join Network Form Submission
// @route   POST /api/engineers/join
// @access  Public (or Protected if needed)
exports.joinNetwork = async (req, res) => {
  console.log("Received data for /api/engineers/join:", JSON.stringify(req.body, null, 2));

  const {
    firstName,
    lastName,
    email,
    phone,
    company,
    serviceType,
    experience,
    location,
    specialties,
    termsAgreed,
    marketingOptIn
  } = req.body;

  if (!email || !firstName || !lastName || !termsAgreed) {
      const missing = [];
      if (!email) missing.push('email');
      if (!firstName) missing.push('firstName');
      if (!lastName) missing.push('lastName');
      if (!termsAgreed) missing.push('termsAgreed');
      console.error("Join Network Error: Missing required fields:", missing.join(', '));
      return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}.` });
  }

  try {
    const profileExists = await EngineerProfile.findOne({ email: email.toLowerCase() });
    if (profileExists) {
      console.warn(`Join Network Warning: Profile with email ${email} already exists.`);
      return res.status(400).json({ message: 'Profile with this email already exists.' });
    }

    const newProfile = new EngineerProfile({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      company,
      serviceType,
      experience,
      location,
      specialties: Array.isArray(specialties) ? specialties : (typeof specialties === 'string' ? specialties.split(',').map(s => s.trim()).filter(s => s) : []), // Handle array or string
      termsAgreed: Boolean(termsAgreed),
      marketingOptIn: Boolean(marketingOptIn),
    });

    console.log("Attempting to save profile:", JSON.stringify(newProfile.toObject(), null, 2));

    const savedProfile = await newProfile.save();

    console.log("Profile saved successfully with ID:", savedProfile._id);

    res.status(201).json({
      message: 'Successfully joined the network!',
      profile: savedProfile
    });

  } catch (error) { // Error type defaults to 'any' in JS catch blocks
    console.error('Error during /api/engineers/join process:', error);

    if (error.name === 'ValidationError') {
        console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));

        // No type annotation needed for 'el' here in plain JS
        const messages = Object.values(error.errors).map(
            (el) => el.message // Access the message property directly
        );

        return res.status(400).json({ message: `Validation Error: ${messages.join('. ')}`, errors: error.errors });
    }
    // General server error
    res.status(500).json({ message: 'Server Error saving profile' });
  }
};


// @desc    Get engineer profile by ID
// @route   GET /api/engineers/profile/:id
// @access  Public (or Protected)
exports.getEngineerProfile = async (req, res) => {
  console.log(`Fetching profile for ID: ${req.params.id}`);
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        console.warn(`Invalid ID format received: ${req.params.id}`);
        return res.status(400).json({ message: 'Invalid profile ID format' });
    }
    const profile = await EngineerProfile.findById(req.params.id);
    if (!profile) {
      console.warn(`Profile not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Engineer profile not found' });
    }
    console.log(`Profile found for ID: ${req.params.id}`);
    res.json(profile);
  } catch (error) {
    console.error('Error fetching engineer profile:', error);
     if (error.kind === 'ObjectId') {
         console.error(`ObjectId Error for ID: ${req.params.id}`);
         return res.status(400).json({ message: 'Invalid profile ID format' });
    }
    res.status(500).json({ message: 'Server Error fetching profile' });
  }
};