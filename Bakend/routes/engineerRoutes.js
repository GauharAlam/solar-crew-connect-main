// backend/routes/engineerRoutes.js
const express = require('express');
const { joinNetwork, getEngineerProfile } = require('../controllers/engineerController');
const router = express.Router();

// You might add authentication middleware here later if needed
// const { protect } = require('../middleware/authMiddleware');
// router.post('/join', protect, joinNetwork);

router.post('/join', joinNetwork); 
router.get('/profile/:id', getEngineerProfile);

module.exports = router;