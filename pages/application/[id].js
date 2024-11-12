import { useRouter } from 'next/router';
import { MongoClient } from 'mongodb';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { useEffect } from 'react';

const ApplicationDetails = ({ applicationData }) => {
  const generateAndOpenPDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([650, 1000]); // Widened page for better layout
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const titleFontSize = 20;
    const labelFontSize = 12;
    const valueFontSize = 12;
    const margin = 50;
    const labelColumnWidth = 200;
    const valueColumnX = margin + labelColumnWidth + 20;
    let yPosition = height - margin;

    // Title
    page.drawText('Leaving Certificate Form', {
      x: margin,
      y: yPosition,
      size: titleFontSize,
      font: boldFont,
      color: rgb(0, 0.53, 0.71),
    });
    yPosition -= 40;

    // Section header style
    const drawSectionHeader = (text) => {
      yPosition -= 20;
      page.drawText(text, {
        x: margin,
        y: yPosition,
        size: labelFontSize + 2,
        font: boldFont,
        color: rgb(0, 0.2, 0.5),
      });
      yPosition -= 20;
    };

    // Field text style for single-line and multiline fields
    const drawField = (label, value) => {
      if (yPosition < 50) {
        // Only add a new page if there's no space left on the current one
        page.addPage([650, 1000]);
        yPosition = height - margin;
      }

      // Draw the label with bold style
      page.drawText(`${label}:`, {
        x: margin,
        y: yPosition,
        size: labelFontSize,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });

      // Handle multiline text for values (no word splitting)
      const sanitizedValue = (value || 'N/A').replace(/[\r\n]+/g, ' '); // Sanitize newlines
      const words = sanitizedValue.split(' '); // Split the value into words

      let line = '';
      words.forEach((word) => {
        const testLine = line ? `${line} ${word}` : word; // Test line with added word
        const textWidth = font.widthOfTextAtSize(testLine, valueFontSize); // Get width of the test line

        // Check if the line fits within the page width
        if (textWidth < (width - margin - valueColumnX)) {
          line = testLine; // If it fits, keep adding words to the current line
        } else {
          // If the word doesn't fit, draw the current line and move to the next line
          page.drawText(line, {
            x: valueColumnX,
            y: yPosition,
            size: valueFontSize,
            font,
            color: rgb(0, 0, 0),
          });

          // Move the y-position down and set the current word as the new line
          yPosition -= 15;
          line = word;
        }
      });

      // Draw the last line after the loop
      if (line) {
        page.drawText(line, {
          x: valueColumnX,
          y: yPosition,
          size: valueFontSize,
          font,
          color: rgb(0, 0, 0),
        });
        yPosition -= 20; // Adjust space after the field
      }
    };

    // Draw all sections with proper headers and fields

    // Section: Basic Information
    drawSectionHeader('Basic Information');
    drawField('Name of Student', applicationData.name);
    drawField('Mr./Mrs.', applicationData.mrOrMrs);
    drawField('Faculty/School Name', applicationData.facultySchool);
    drawField('Class', applicationData.className);
    drawField('Program', applicationData.program);
    drawField('PRN No', applicationData.prnNo);
    drawField('Result', applicationData.result);
    drawField('Year of Passing', applicationData.yearOfPassing);

    // Section: Application Details
    drawSectionHeader('Application Details');
    drawField('Reason for Applying', applicationData.reasonForApplying);
    drawField('Previous School/College', applicationData.previousSchool);
    drawField('Previous Course', applicationData.previousCourse);
    drawField('Previous College Passing Year', applicationData.previousCollegePassingYear);
    drawField('Date of Admission at MIT-WPU', applicationData.dateOfAdmission);
    drawField('Date of Last Attendance at MIT-WPU', applicationData.dateOfLastAttendance);

    // Section: Personal Details
    drawSectionHeader('Personal Details');
    drawField('Date of Birth', applicationData.dateOfBirth);
    drawField('State, Place of Birth', applicationData.statePlaceOfBirth);
    drawField('Nationality', applicationData.nationality);
    drawField('Religion', applicationData.religion);
    drawField('Caste and Sub Caste', applicationData.casteSubCaste);
    drawField('Permanent Address', applicationData.permanentAddress);
    drawField('Email ID', applicationData.email);
    drawField('Mobile Number', applicationData.mobileNumber);
    drawField("Mother's Name", applicationData.mothersName);
    drawField('Alternate Mobile Number', applicationData.alternateMobileNumber);

    // Save the PDF document and open it in the same tab
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    // Set the current page to the PDF URL
    window.location.href = blobUrl;
  };

  useEffect(() => {
    generateAndOpenPDF();
  }, []);

  return (
    <div>
      <h1>Opening your PDF...</h1>
      <p>The PDF document is opening in the same tab.</p>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('test');
  const collection = db.collection('formdatas');
  
  const applicationData = await collection.findOne({ prnNo: id });
  client.close();

  return {
    props: {
      applicationData: JSON.parse(JSON.stringify(applicationData)),
    },
  };
}

export default ApplicationDetails;
