import { NextResponse } from 'next/server';
import FormData from '../../../models/FormData';
const PDFDocument = require('pdfkit');

export const GET = async (req) => {
  const { prnNo } = req.query;

  try {
    const application = await FormData.findOne({ prnNo });
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Create a new PDF document
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      const headers = new Headers();
      headers.set('Content-Type', 'application/pdf');
      headers.set('Content-Disposition', `attachment; filename=${prnNo}_application.pdf`);
      return NextResponse.json(pdfBuffer, { status: 200, headers });
    });

    // Add content to PDF
    doc.fontSize(16).text(`Application Details for PRN: ${application.prnNo}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${application.name}`);
    doc.text(`Gender: ${application.mrOrMrs}`);
    doc.text(`Faculty/School: ${application.facultySchool}`);
    doc.text(`Class: ${application.className}`);
    doc.text(`Program: ${application.program}`);
    doc.text(`Year of Passing: ${application.yearOfPassing}`);
    doc.text(`Result: ${application.result}`);
    doc.text(`Reason for Applying: ${application.reasonForApplying}`);
    doc.text(`Previous School: ${application.previousSchool}`);
    doc.text(`Previous Course: ${application.previousCourse}`);
    doc.text(`Previous College Passing Year: ${application.previousCollegePassingYear}`);
    doc.text(`Date of Admission: ${application.dateOfAdmission}`);
    doc.text(`Date of Last Attendance: ${application.dateOfLastAttendance}`);
    doc.text(`Date of Birth: ${application.dateOfBirth}`);
    doc.text(`Place of Birth (State): ${application.statePlaceOfBirth}`);
    doc.text(`Nationality: ${application.nationality}`);
    doc.text(`Religion: ${application.religion}`);
    doc.text(`Caste/Sub-Caste: ${application.casteSubCaste}`);
    doc.text(`Permanent Address: ${application.permanentAddress}`);
    doc.text(`Email: ${application.email}`);
    doc.text(`Mobile Number: ${application.mobileNumber}`);
    doc.text(`Mother's Name: ${application.mothersName}`);
    doc.text(`Alternate Mobile Number: ${application.alternateMobileNumber}`);
    doc.moveDown();

    // Verification Status
    doc.fontSize(14).text('Verification Status:', { underline: true });
    for (const [key, value] of Object.entries(application.verificationStatus)) {
      doc.fontSize(12).text(`${key}: ${value ? 'Verified' : 'Not Verified'}`);
    }

    // Application Status
    doc.moveDown();
    doc.fontSize(12).text(`Application Status: ${application.applicationStatus}`);

    // End the document
    doc.end();
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
};
