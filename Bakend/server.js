// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const engineerRoutes = require('./routes/engineerRoutes');

const app = express();

// Body parser middleware
app.use(express.json());

// Enable CORS
// Configure CORS more strictly for production!
app.use(cors()); // Allow all origins for development

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/engineers', engineerRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));