import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';  // Import path module
import { mkdir, writeFile } from 'fs/promises';  // Import mkdir and writeFile from fs/promises
import { NextResponse } from 'next/server';

// Initialize MongoDB connection
let mongoConnection = null;

async function connectToMongoDB() {
  if (mongoConnection) {
    return mongoConnection;
  }

  try {
    mongoConnection = await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
    return mongoConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Define the Schema
const FormDataSchema = new mongoose.Schema({
  name: String,
  mrOrMrs: String,
  facultySchool: String,
  className: String,
  program: String,
  prnNo: { type: String, unique: true, required: true },
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
  Prov_Cert: String,  // File path for provisional certificate
  Marksheet: String,   // File path for marksheet
  Fee_Receipt: String, // File path for fee receipt
  Prev_LC: String,     // File path for previous LC
  ID_Card: String,     // File path for ID card
  verificationStatus: {
    HoS: { type: Boolean, default: false },
    Librarian: { type: Boolean, default: false },
    Accounts: { type: Boolean, default: false },
    Gymkhana: { type: Boolean, default: false },
    ProgramOffice: { type: Boolean, default: false },
    Dean: { type: Boolean, default: false },
  },
  applicationStatus: { type: String, default: "Pending" },
  officialEmail: String
});

// Initialize model (prevent multiple model compilation)
const FormData = mongoose.models.FormData || mongoose.model('FormData', FormDataSchema);

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to the root uploads folder
    cb(null, path.join(process.cwd(), 'uploads')); // Correct location
  },
  filename: (req, file, cb) => {
    const prnNo = req.body.prnNo;
    const fileType = file.fieldname;
    const uniqueName = `${prnNo}_${fileType}_${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// Helper function to handle file upload
function runMiddleware(req, middleware) {
  return new Promise((resolve, reject) => {
    middleware(req, {
      end: (error) => {
        if (error) reject(error);
        resolve();
      },
      setHeader: () => {},
    }, (error) => {
      if (error) reject(error);
      resolve();
    });
  });
}

export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectToMongoDB();

    const formData = await req.formData();
    const files = {};
    const formFields = {};

    // First pass: collect all form fields (non-file fields)
    for (const [key, value] of formData.entries()) {
      if (!(value instanceof File)) {
        formFields[key] = value;
      }
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }

    // Second pass: handle files with access to formFields (including PRN)
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        try {
          const filename = `${formFields.prnNo || 'unknown'}_${key}_${Date.now()}_${value.name}`;
          const filepath = path.join(uploadsDir, filename);

          const bytes = await value.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          // Write file to the uploads directory
          await writeFile(filepath, buffer);
          
          // Store the public URL path (used later to store in DB)
          files[key] = `/uploads/${filename}`; // This URL path can be accessed by users
            
          console.log(`File saved: ${filepath}`);
        } catch (error) {
          console.error(`Error saving file ${key}:`, error);
          throw error;
        }
      }
    }

    // Create new form data document
    const formDataDoc = new FormData({
      ...formFields,
      Prov_Cert: files['Prov_Cert'] || '',
      Marksheet: files['Marksheet'] || '',
      Fee_Receipt: files['Fee_Receipt'] || '',
      Prev_LC: files['Prev_LC'] || '',
      ID_Card: files['ID_Card'] || ''
    });

    // Save to database
    await formDataDoc.save();

    return NextResponse.json(
      { 
        message: 'Data saved successfully!',
        savedFiles: files 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing form:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '8mb',
  },
};
