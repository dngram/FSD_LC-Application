const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

// Initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Set up file storage using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination directory for uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Use unique filenames
  }
});

const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/leaving_certificate_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Create a schema and model for form data including file paths
const FormDataSchema = new mongoose.Schema({
  name: String,
  mrOrMrs: String,
  facultySchool: String,
  className: String,
  program: String,
  prnNo: String,
  result: String,
  yearOfPassing: String,
  reasonForApplying: String,
  previousSchool: String,
  previousCourse: String,
  previousCollegePassingYear: String,
  dateOfAdmission: String,
  dateOfLastAttendance: String,
  dateOfBirth: String,
  statePlaceOfBirth: String,
  nationality: String,
  religion: String,
  casteSubCaste: String,
  permanentAddress: String,
  email: String,
  mobileNumber: String,
  mothersName: String,
  alternateMobileNumber: String,
  // File paths for the uploaded PDF and JPG files
  pdfFile1: String,
  pdfFile2: String,
  pdfFile3: String,
  pdfFile4: String,
  jpgFile: String,
});

const FormData = mongoose.model('FormData', FormDataSchema);

// Endpoint to handle form submission and file uploads
app.post('/submit', upload.fields([
  { name: 'pdfFile1', maxCount: 1 },
  { name: 'pdfFile2', maxCount: 1 },
  { name: 'pdfFile3', maxCount: 1 },
  { name: 'pdfFile4', maxCount: 1 },
  { name: 'jpgFile', maxCount: 1 }
]), async (req, res) => {
  try {
    // Create new form data including file paths
    const formData = new FormData({
      ...req.body,
      pdfFile1: req.files['pdfFile1'] ? req.files['pdfFile1'][0].path : '',
      pdfFile2: req.files['pdfFile2'] ? req.files['pdfFile2'][0].path : '',
      pdfFile3: req.files['pdfFile3'] ? req.files['pdfFile3'][0].path : '',
      pdfFile4: req.files['pdfFile4'] ? req.files['pdfFile4'][0].path : '',
      jpgFile: req.files['jpgFile'] ? req.files['jpgFile'][0].path : '',
    });

    // Save the form data to the database
    await formData.save();
    res.status(200).json({ message: 'Data saved successfully!' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Serve the uploads folder to access uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
