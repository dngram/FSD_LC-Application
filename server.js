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
    cb(null, 'uploads/'); // Directory for file uploads
  },
  filename: (req, file, cb) => {
    // Access the `prnNo` from the request body
    const prnNo = req.body.prnNo;

    // Ensure `prnNo` exists in the request
    if (!prnNo) {
      return cb(new Error("PRN No is required"));
    }

    // Generate a unique filename based on `prnNo` and fieldname
    let fileType = '';
    switch (file.fieldname) {
      case 'P_Receipt':
        fileType = 'PaymentReceipt';
        break;
      case 'Prev_LC':
        fileType = 'PreviousLC';
        break;
      case 'Pro_Deg_Cer':
        fileType = 'ProvisionalDegreeCertificate';
        break;
      case 'Marksheet':
        fileType = 'Marksheet';
        break;
      case 'ID_Card':
        fileType = 'IDCard';
        break;
      default:
        fileType = 'UnknownFileType';
    }

    // Set filename pattern: PRN_No_FileType_Timestamp
    const uniqueFilename = `${prnNo}_${fileType}_${Date.now()}_${file.originalname}`;
    
    cb(null, uniqueFilename); // Use the unique filename
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
  P_Receipt: String,
  Prev_LC: String,
  Pro_Deg_Cer: String,
  Marksheet: String,
  ID_Card: String,
});

const FormData = mongoose.model('FormData', FormDataSchema);

// Endpoint to handle form submission and file uploads
app.post('/submit', upload.fields([
  { name: 'P_Receipt', maxCount: 1 },
  { name: 'Prev_LC', maxCount: 1 },
  { name: 'Pro_Deg_Cer', maxCount: 1 },
  { name: 'Marksheet', maxCount: 1 },
  { name: 'ID_Card', maxCount: 1 }
]), async (req, res) => {
  try {
    // Create new form data including file paths
    const formData = new FormData({
      ...req.body,
      P_Receipt: req.files['P_Receipt'] ? req.files['P_Receipt'][0].path : '',
      Prev_LC: req.files['Prev_LC'] ? req.files['Prev_LC'][0].path : '',
      Pro_Deg_Cer: req.files['Pro_Deg_Cer'] ? req.files['Pro_Deg_Cer'][0].path : '',
      Marksheet: req.files['Marksheet'] ? req.files['Marksheet'][0].path : '',
      ID_Card: req.files['ID_Card'] ? req.files['ID_Card'][0].path : '',
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
