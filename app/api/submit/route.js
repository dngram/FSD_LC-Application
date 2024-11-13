import mongoose from 'mongoose';
import multer from 'multer';
import AWS from 'aws-sdk';
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
  Prov_Cert: String,  // File URL for provisional certificate
  Marksheet: String,   // File URL for marksheet
  Fee_Receipt: String, // File URL for fee receipt
  Prev_LC: String,     // File URL for previous LC
  ID_Card: String,     // File URL for ID card
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

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Configure multer to store files in memory (for S3 upload)
const storage = multer.memoryStorage();
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

    // Second pass: handle files and upload to AWS S3
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        try {
          const fileBuffer = Buffer.from(await value.arrayBuffer());
          const filename = `${formFields.prnNo || 'unknown'}_${key}_${Date.now()}_${value.name}`;

          // Upload to S3
          const s3Params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME, // Your S3 bucket name
            Key: `uploads/${filename}`, // File path inside S3
            Body: fileBuffer, // File content as a buffer
            ContentType: value.type, // MIME type of the file
          };

          const uploadResult = await s3.upload(s3Params).promise();
          console.log(`File uploaded to S3: ${uploadResult.Location}`);
          
          // Store the S3 URL in the 'files' object
          files[key] = uploadResult.Location; // S3 URL of the uploaded file
        } catch (error) {
          console.error(`Error uploading file ${key} to S3:`, error);
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
