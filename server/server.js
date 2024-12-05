const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/biodataApp')
  .then(() => console.log('Connected to MongoDB 😁'))
  .catch(err => console.log(err));

// Schema definition for biodata
const biodataSchema = mongoose.Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  placeOfBirth: { type: String, required: true },
  timeOfBirth: { type: String, required: true },
  rashi: { type: String, required: true },
  height: { type: String, required: true },
  education: { type: String, required: true },
  salary: { type: String, required: true },
  contactNo: { type: String, required: true },
  photo: { type: String, default: null }
});

const Bio = mongoose.model('Bio', biodataSchema);

// Middleware setup
app.use(cors());
app.use(express.json()); // to parse JSON bodies

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Setup file upload destination using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'), // File upload location
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`) // File name pattern
});

const upload = multer({ storage });

// Endpoint to handle biodata submission and file upload
app.post('/upload', upload.single('photo'), async (req, res) => {
  const { name, dateOfBirth, placeOfBirth, timeOfBirth, rashi, height, education, salary, contactNo } = req.body;
  const photo = req.file ? req.file.path : null;

  // Create the user object to be saved to the database
  const user = new Bio({
    name,
    dateOfBirth,
    placeOfBirth,
    timeOfBirth,
    rashi,
    height,
    education,
    salary,
    contactNo,
    photo
  });

  try {
    await user.save();
    res.status(200).json({ message: 'Biodata and photo uploaded successfully', user });
  } catch (err) {
    console.error('Error uploading biodata:', err); // Log the error
    res.status(500).json({ message: 'Error uploading biodata', error: err });
  }
});

// Endpoint to get all profiles
app.get('/profiles', async (req, res) => {
  try {
    const profiles = await Bio.find();
    res.status(200).json(profiles);
  } catch (err) {
    console.error('Error fetching profiles:', err); // Log the error
    res.status(500).json({ message: 'Error fetching profiles', error: err });
  }
});

// Endpoint to get a single profile by ID
app.get('/profiles/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const profile = await Bio.findById(id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (err) {
    console.error('Error fetching profile by ID:', err); // Log the error
    res.status(500).json({ message: 'Error fetching profile details', error: err });
  }
});

// Start the server
const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
