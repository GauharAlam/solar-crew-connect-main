// backend/controllers/engineerController.js
const EngineerProfile = require('../models/EngineerProfile');

// @desc    Handle Join Network Form Submission
// @route   POST /api/engineers/join
// @access  Public (or Protected if users must be logged in first)
exports.joinNetwork = async (req, res) => {
  // Extract data matching your EngineerProfile model and form fields
  const {
    firstName, lastName, email, phone, company, serviceType,
    experience, location, specialties, termsAgreed, marketingOptIn
    // Add any other fields from your form
  } = req.body;

  try {
    // Optional: Check if a profile with this email already exists
    const profileExists = await EngineerProfile.findOne({ email });
    if (profileExists) {
      return res.status(400).json({ message: 'Profile with this email already exists.' });
    }

    // Create a new profile instance
    const newProfile = new EngineerProfile({
      firstName, lastName, email, phone, company, serviceType,
      experience, location, specialties, termsAgreed, marketingOptIn
      // Map other fields
    });

    // Save the profile to the database
    const savedProfile = await newProfile.save();

    res.status(201).json({
      message: 'Successfully joined the network!',
      profile: savedProfile // Send back the created profile data
    });

  } catch (error) {
    console.error('Error saving engineer profile:', error);
    // Provide more specific error messages if possible (e.g., validation errors)
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server Error saving profile' });
  }
};

exports.getEngineerProfile = async (req, res) => {
  try {
    // Use Mongoose's findById which is common for ID lookups
    // Or findOne if you are searching by a different unique field from the URL param
    const profile = await EngineerProfile.findById(req.params.id);
     // Optional: Populate user details if needed: .populate('user', 'fullName email');

    if (!profile) {
      return res.status(404).json({ message: 'Engineer profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching engineer profile:', error);
    // Handle cases like invalid ID format
    if (error.kind === 'ObjectId') {
         return res.status(400).json({ message: 'Invalid profile ID format' });
    }
    res.status(500).json({ message: 'Server Error fetching profile' });
  }
};