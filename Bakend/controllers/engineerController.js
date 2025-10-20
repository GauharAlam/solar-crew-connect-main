// backend/controllers/engineerController.js
const EngineerProfile = require('../models/EngineerProfile'); // Ensure correct path to your model

// @desc    Handle Join Network Form Submission
// @route   POST /api/engineers/join
// @access  Public (or Protected if users must be logged in first)
exports.joinNetwork = async (req, res) => {
  // --- Debug Log 1: Log incoming request body ---
  console.log("Received data for /api/engineers/join:", req.body);

  // Extract data matching your EngineerProfile model and form fields from req.body
  // Make sure these names exactly match the 'name' attributes in your form
  // OR the keys in the JSON object sent from the frontend fetch call.
  const {
    firstName,
    lastName,
    email,
    phone,
    company,
    serviceType,
    experience,
    location,
    specialties, // This might be a comma-separated string or array depending on how you process it
    termsAgreed, // Frontend sends boolean or 'on'/'off' depending on checkbox handling
    marketingOptIn // Frontend sends boolean or 'on'/'off' depending on checkbox handling
    // Add any other fields from your form that match your Mongoose schema
  } = req.body;

  // Basic backend validation (can be expanded)
  if (!email || !firstName || !lastName || !termsAgreed) {
      console.error("Join Network Error: Missing required fields", { email, firstName, lastName, termsAgreed });
      return res.status(400).json({ message: 'Missing required fields (email, name, terms agreement).' });
  }

  try {
    // Optional: Check if a profile with this email already exists
    const profileExists = await EngineerProfile.findOne({ email: email.toLowerCase() }); // Case-insensitive check
    if (profileExists) {
      console.warn(`Join Network Warning: Profile with email ${email} already exists.`);
      return res.status(400).json({ message: 'Profile with this email already exists.' });
    }

    // Create a new profile instance
    // Map frontend data carefully to schema fields
    const newProfile = new EngineerProfile({
      firstName,
      lastName,
      email: email.toLowerCase(), // Store email consistently
      phone, // Optional field
      company, // Optional field
      serviceType,
      experience,
      location,
      // Handle specialties: If it's a string, split it; otherwise, use directly if it's an array
      specialties: typeof specialties === 'string' ? specialties.split(',').map(s => s.trim()).filter(s => s) : specialties,
      termsAgreed: Boolean(termsAgreed), // Convert 'on' or true to boolean
      marketingOptIn: Boolean(marketingOptIn), // Convert 'on' or true to boolean
      // Set defaults for fields not coming from the form if necessary
      // e.g., rating: 0, total_projects: 0, availability: 'available'
    });

    // --- Debug Log 2: Log the profile object before saving ---
    console.log("Attempting to save profile:", JSON.stringify(newProfile.toObject(), null, 2));


    // Save the profile to the database
    const savedProfile = await newProfile.save();

    // --- Debug Log 3: Log successful save ---
    console.log("Profile saved successfully with ID:", savedProfile._id);

    res.status(201).json({
      message: 'Successfully joined the network!',
      profile: savedProfile // Send back the created profile data
    });

  } catch (error) {
    // --- Debug Log 4: Log any error during the process ---
    console.error('Error during /api/engineers/join process:', error);

    // Provide more specific error messages if possible (e.g., validation errors)
    if (error.name === 'ValidationError') {
        // Log validation errors specifically
        console.error("Validation Errors:", error.errors);
        return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    // General server error
    res.status(500).json({ message: 'Server Error saving profile' });
  }
};


// @desc    Get engineer profile by ID
// @route   GET /api/engineers/profile/:id
// @access  Public (or Protected)
exports.getEngineerProfile = async (req, res) => {
  console.log(`Fetching profile for ID: ${req.params.id}`); // Log request
  try {
    // Check if the ID is potentially valid before querying
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        console.warn(`Invalid ID format received: ${req.params.id}`);
        return res.status(400).json({ message: 'Invalid profile ID format' });
    }

    const profile = await EngineerProfile.findById(req.params.id);
     // Optional: Populate user details if linked: .populate('user', 'fullName email');

    if (!profile) {
      console.warn(`Profile not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Engineer profile not found' });
    }

    console.log(`Profile found for ID: ${req.params.id}`);
    res.json(profile); // Send the found profile

  } catch (error) {
    console.error('Error fetching engineer profile:', error);
    // Log the specific error kind if available
     if (error.kind === 'ObjectId') {
         console.error(`ObjectId Error for ID: ${req.params.id}`);
         // This might already be caught by the isValid check above, but good as a fallback
         return res.status(400).json({ message: 'Invalid profile ID format' });
    }
    res.status(500).json({ message: 'Server Error fetching profile' });
  }
};

// --- Ensure mongoose is required if not already done globally ---
const mongoose = require('mongoose');