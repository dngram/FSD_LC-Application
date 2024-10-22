"use client";
import React, { useState } from "react";
import jsPDF from "jspdf";
import Image from "next/image";
import "./styles/styles1.css";

export default function Home() {
  // State variables for form fields
  const [name, setName] = useState("");
  const [mrOrMrs, setMrOrMrs] = useState("");
  const [facultySchool, setFacultySchool] = useState("");
  const [className, setClassName] = useState("");
  const [program, setProgram] = useState("");
  const [prnNo, setPrnNo] = useState("");
  const [result, setResult] = useState("");
  const [yearOfPassing, setYearOfPassing] = useState("");
  const [reasonForApplying, setReasonForApplying] = useState("");
  const [previousSchool, setPreviousSchool] = useState("");
  const [previousCourse, setPreviousCourse] = useState("");
  const [previousCollegePassingYear, setPreviousCollegePassingYear] = useState("");
  const [dateOfAdmission, setDateOfAdmission] = useState("");
  const [dateOfLastAttendance, setDateOfLastAttendance] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [statePlaceOfBirth, setStatePlaceOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [religion, setReligion] = useState("");
  const [casteSubCaste, setCasteSubCaste] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mothersName, setMothersName] = useState("");
  const [alternateMobileNumber, setAlternateMobileNumber] = useState("");

  // State for uploaded files
  const [pdfFile1, setPdfFile1] = useState<File | null>(null);
  const [pdfFile2, setPdfFile2] = useState<File | null>(null);
  const [pdfFile3, setPdfFile3] = useState<File | null>(null);
  const [pdfFile4, setPdfFile4] = useState<File | null>(null);
  const [jpgFile, setJpgFile] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Create a new PDF document
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Leaving Certificate Form", 20, 20);
    const startY = 50;
    const lineHeight = 8;
    const fields = [
      { label: "Name of Student", value: name },
      { label: "Mr./Mrs.", value: mrOrMrs },
      { label: "Faculty/School Name", value: facultySchool },
      { label: "Class", value: className },
      { label: "Program", value: program },
      { label: "PRN No", value: prnNo },
      { label: "Result", value: result },
      { label: "Year of Passing", value: yearOfPassing },
      { label: "Reason for applying T.C./L.C", value: reasonForApplying },
      { label: "Previous School/College name", value: previousSchool },
      { label: "Previous Course", value: previousCourse },
      { label: "Previous College Passing Year", value: previousCollegePassingYear },
      { label: "Date of admission at MIT-WPU", value: dateOfAdmission },
      { label: "Date of Last attendance in MIT-WPU", value: dateOfLastAttendance },
      { label: "Date of Birth", value: dateOfBirth },
      { label: "State, Place of Birth", value: statePlaceOfBirth },
      { label: "Nationality", value: nationality },
      { label: "Religion", value: religion },
      { label: "Caste and Sub Caste", value: casteSubCaste },
      { label: "Permanent Address", value: permanentAddress },
      { label: "Email id", value: email },
      { label: "Mobile number", value: mobileNumber },
      { label: "Mother's Name", value: mothersName },
      { label: "Alternate Mobile number", value: alternateMobileNumber },
    ];

    fields.forEach((field, index) => {
      doc.text(field.label, 20, startY + index * lineHeight);
      doc.text(field.value, 100, startY + index * lineHeight);
    });

    // Save the PDF
    doc.save("lcformgenerated.pdf");

    // Prepare form data for submission (including file uploads)
    const formData = new FormData();
    formData.append("name", name);
    formData.append("mrOrMrs", mrOrMrs);
    formData.append("facultySchool", facultySchool);
    formData.append("className", className);
    formData.append("program", program);
    formData.append("prnNo", prnNo);
    formData.append("result", result);
    formData.append("yearOfPassing", yearOfPassing);
    formData.append("reasonForApplying", reasonForApplying);
    formData.append("previousSchool", previousSchool);
    formData.append("previousCourse", previousCourse);
    formData.append("previousCollegePassingYear", previousCollegePassingYear);
    formData.append("dateOfAdmission", dateOfAdmission);
    formData.append("dateOfLastAttendance", dateOfLastAttendance);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("statePlaceOfBirth", statePlaceOfBirth);
    formData.append("nationality", nationality);
    formData.append("religion", religion);
    formData.append("casteSubCaste", casteSubCaste);
    formData.append("permanentAddress", permanentAddress);
    formData.append("email", email);
    formData.append("mobileNumber", mobileNumber);
    formData.append("mothersName", mothersName);
    formData.append("alternateMobileNumber", alternateMobileNumber);

    if (pdfFile1) formData.append("pdfFile1", pdfFile1);
    if (pdfFile2) formData.append("pdfFile2", pdfFile2);
    if (pdfFile3) formData.append("pdfFile3", pdfFile3);
    if (pdfFile4) formData.append("pdfFile4", pdfFile4);
    if (jpgFile) formData.append("jpgFile", jpgFile);

    // Send form data to the backend server
    try {
      const response = await fetch("http://localhost:5000/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Form data saved:", data);
      } else {
        console.error("Failed to save form data:", data.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="form-container">
      <div className="logo-container">
        {/* Include the logo here */}
        <Image src="/logo.png" alt="Logo" width={100} height={100} />
      </div>
      <h1>Leaving Certificate Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label htmlFor="name">Name of Student:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="mrOrMrs">Mr./Mrs.:</label>
          <input
            id="mrOrMrs"
            type="text"
            value={mrOrMrs}
            onChange={(e) => setMrOrMrs(e.target.value)}
            required
          />

          <label htmlFor="facultySchool">Faculty/School Name:</label>
          <input
            id="facultySchool"
            type="text"
            value={facultySchool}
            onChange={(e) => setFacultySchool(e.target.value)}
            required
          />

          <label htmlFor="className">Class:</label>
          <input
            id="className"
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />

          <label htmlFor="program">Program:</label>
          <input
            id="program"
            type="text"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            required
          />

          <label htmlFor="prnNo">PRN No:</label>
          <input
            id="prnNo"
            type="text"
            value={prnNo}
            onChange={(e) => setPrnNo(e.target.value)}
            required
          />

          <label htmlFor="result">Result:</label>
          <input
            id="result"
            type="text"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            required
          />

          <label htmlFor="yearOfPassing">Year of Passing:</label>
          <input
            id="yearOfPassing"
            type="number"
            value={yearOfPassing}
            onChange={(e) => setYearOfPassing(e.target.value)}
            required
          />

          <label htmlFor="reasonForApplying">
            Reason for applying T.C./L.C & Migration Certificate:
          </label>
          <input
            id="reasonForApplying"
            type="text"
            value={reasonForApplying}
            onChange={(e) => setReasonForApplying(e.target.value)}
            required
          />

          <label htmlFor="previousSchool">
            Previous School/College name before joining MIT-WPU:
          </label>
          <input
            id="previousSchool"
            type="text"
            value={previousSchool}
            onChange={(e) => setPreviousSchool(e.target.value)}
            required
          />

          <label htmlFor="previousCourse">Previous Course:</label>
          <input
            id="previousCourse"
            type="text"
            value={previousCourse}
            onChange={(e) => setPreviousCourse(e.target.value)}
            required
          />

          <label htmlFor="previousCollegePassingYear">
            Previous College Passing Year:
          </label>
          <input
            id="previousCollegePassingYear"
            type="number"
            value={previousCollegePassingYear}
            onChange={(e) => setPreviousCollegePassingYear(e.target.value)}
            required
          />

          <label htmlFor="dateOfAdmission">
            Date of admission at MIT-WPU:
          </label>
          <input
            id="dateOfAdmission"
            type="date"
            value={dateOfAdmission}
            onChange={(e) => setDateOfAdmission(e.target.value)}
            required
          />

          <label htmlFor="dateOfLastAttendance">
            Date of Last attendance in MIT-WPU:
          </label>
          <input
            id="dateOfLastAttendance"
            type="date"
            value={dateOfLastAttendance}
            onChange={(e) => setDateOfLastAttendance(e.target.value)}
            required
          />

          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />

          <label htmlFor="statePlaceOfBirth">
            State, Place of Birth:
          </label>
          <input
            id="statePlaceOfBirth"
            type="text"
            value={statePlaceOfBirth}
            onChange={(e) => setStatePlaceOfBirth(e.target.value)}
            required
          />

          <label htmlFor="nationality">Nationality:</label>
          <input
            id="nationality"
            type="text"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            required
          />

          <label htmlFor="religion">Religion:</label>
          <input
            id="religion"
            type="text"
            value={religion}
            onChange={(e) => setReligion(e.target.value)}
            required
          />

          <label htmlFor="casteSubCaste">Caste and Sub Caste:</label>
          <input
            id="casteSubCaste"
            type="text"
            value={casteSubCaste}
            onChange={(e) => setCasteSubCaste(e.target.value)}
            required
          />

          <label htmlFor="permanentAddress">Permanent Address:</label>
          <textarea
            id="permanentAddress"
            value={permanentAddress}
            onChange={(e) => setPermanentAddress(e.target.value)}
            required
          />

          <label htmlFor="email">Email id:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="mobileNumber">Mobile number:</label>
          <input
            id="mobileNumber"
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />

          <label htmlFor="mothersName">Mother's Name:</label>
          <input
            id="mothersName"
            type="text"
            value={mothersName}
            onChange={(e) => setMothersName(e.target.value)}
            required
          />

          <label htmlFor="alternateMobileNumber">
            Alternate Mobile number:
          </label>
          <input
            id="alternateMobileNumber"
            type="tel"
            value={alternateMobileNumber}
            onChange={(e) => setAlternateMobileNumber(e.target.value)}
          />

<label htmlFor="pdfFile1">Upload Payment Receipt</label>
          <input
            id="pdfFile1"
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile1(e.target.files?.[0] || null)}
          />

          <label htmlFor="pdfFile2">Upload Previous LC</label>
          <input
            id="pdfFile2"
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile2(e.target.files?.[0] || null)}
          />

          <label htmlFor="pdfFile3">Upload Provisional Degree Certificate:</label>
          <input
            id="pdfFile3"
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile3(e.target.files?.[0] || null)}
          />

          <label htmlFor="pdfFile4">Upload Student Marksheet:</label>
          <input
            id="pdfFile4"
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile4(e.target.files?.[0] || null)}
          />

          <label htmlFor="jpgFile">Upload ID Card:</label>
          <input
            id="jpgFile"
            type="file"
            accept=".jpg,.jpeg"
            onChange={(e) => setJpgFile(e.target.files?.[0] || null)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
