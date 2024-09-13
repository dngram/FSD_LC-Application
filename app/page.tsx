"use client";
import React, { useState } from 'react';
import jsPDF from 'jspdf';

export default function Home() {
  // State variables for all form fields
  const [name, setName] = useState('');
  const [mrOrMrs, setMrOrMrs] = useState('');
  const [facultySchool, setFacultySchool] = useState('');
  const [className, setClassName] = useState('');
  const [program, setProgram] = useState('');
  const [prnNo, setPrnNo] = useState('');
  const [result, setResult] = useState('');
  const [yearOfPassing, setYearOfPassing] = useState('');
  const [reasonForApplying, setReasonForApplying] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [previousCourse, setPreviousCourse] = useState('');
  const [previousCollegePassingYear, setPreviousCollegePassingYear] = useState('');
  const [dateOfAdmission, setDateOfAdmission] = useState('');
  const [dateOfLastAttendance, setDateOfLastAttendance] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [statePlaceOfBirth, setStatePlaceOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [religion, setReligion] = useState('');
  const [casteSubCaste, setCasteSubCaste] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [mothersName, setMothersName] = useState('');
  const [alternateMobileNumber, setAlternateMobileNumber] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Create a new PDF document
    const doc = new jsPDF();

    // Add title to the PDF
    doc.setFontSize(20);
    doc.text('Leaving Certificate Form', 20, 30);

    // Add table content
    doc.setFontSize(10);
    const startY = 50;
    const lineHeight = 8;
    const fields = [
      { label: 'Name of Student', value: name },
      { label: 'Mr./Mrs.', value: mrOrMrs },
      { label: 'Faculty/School Name', value: facultySchool },
      { label: 'Class', value: className },
      { label: 'Program', value: program },
      { label: 'PRN No', value: prnNo },
      { label: 'Result', value: result },
      { label: 'Year of Passing', value: yearOfPassing },
      { label: 'Reason for applying T.C./L.C', value: reasonForApplying },
      { label: 'Previous School/College name', value: previousSchool },
      { label: 'Previous Course', value: previousCourse },
      { label: 'Previous College Passing Year', value: previousCollegePassingYear },
      { label: 'Date of admission at MIT-WPU', value: dateOfAdmission },
      { label: 'Date of Last attendance in MIT-WPU', value: dateOfLastAttendance },
      { label: 'Date of Birth', value: dateOfBirth },
      { label: 'State, Place of Birth', value: statePlaceOfBirth },
      { label: 'Nationality', value: nationality },
      { label: 'Religion', value: religion },
      { label: 'Caste and Sub Caste', value: casteSubCaste },
      { label: 'Permanent Address', value: permanentAddress },
      { label: 'Email id', value: email },
      { label: 'Mobile number', value: mobileNumber },
      { label: "Mother's Name", value: mothersName },
      { label: 'Alternate Mobile number', value: alternateMobileNumber },
    ];

    fields.forEach((field, index) => {
      doc.text(field.label, 20, startY + index * lineHeight);
      doc.text(field.value, 100, startY + index * lineHeight);
    });


    // Save the PDF
    doc.save('lcformgenerated.pdf');

    // Prepare form data for submission
    const formData = {
      name,
      mrOrMrs,
      facultySchool,
      className,
      program,
      prnNo,
      result,
      yearOfPassing,
      reasonForApplying,
      previousSchool,
      previousCourse,
      previousCollegePassingYear,
      dateOfAdmission,
      dateOfLastAttendance,
      dateOfBirth,
      statePlaceOfBirth,
      nationality,
      religion,
      casteSubCaste,
      permanentAddress,
      email,
      mobileNumber,
      mothersName,
      alternateMobileNumber,
    };

    // Send form data to the backend server
    try {
      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Form data saved:', data);
      } else {
        console.error('Failed to save form data:', data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div>
      <h1>Leaving Certificate Form</h1>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="name">Name of Student:</label></td>
              <td>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="mrOrMrs">Mr./Mrs.:</label></td>
              <td>
                <select
                  id="mrOrMrs"
                  value={mrOrMrs}
                  onChange={(e) => setMrOrMrs(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="facultySchool">Faculty/School Name:</label></td>
              <td>
                <input
                  id="facultySchool"
                  type="text"
                  value={facultySchool}
                  onChange={(e) => setFacultySchool(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="className">Class:</label></td>
              <td>
                <select
                  id="className"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="FY">FY</option>
                  <option value="SY">SY</option>
                  <option value="TY">TY</option>
                  <option value="FnY">FnY</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="program">Program:</label></td>
              <td>
                <input
                  id="program"
                  type="text"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="prnNo">PRN No:</label></td>
              <td>
                <input
                  id="prnNo"
                  type="text"
                  value={prnNo}
                  onChange={(e) => setPrnNo(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="result">Result:</label></td>
              <td>
                <select
                  id="result"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="yearOfPassing">Year of Passing:</label></td>
              <td>
                <input
                  id="yearOfPassing"
                  type="number"
                  min="1900"
                  max="2099"
                  value={yearOfPassing}
                  onChange={(e) => setYearOfPassing(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="reasonForApplying">Reason for applying T.C./L.C & Migration Certificate:</label></td>
              <td>
                <input
                  id="reasonForApplying"
                  type="text"
                  value={reasonForApplying}
                  onChange={(e) => setReasonForApplying(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="previousSchool">Previous School/College name before joining MIT-WPU:</label></td>
              <td>
                <input
                  id="previousSchool"
                  type="text"
                  value={previousSchool}
                  onChange={(e) => setPreviousSchool(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="previousCourse">Previous Course:</label></td>
              <td>
                <input
                  id="previousCourse"
                  type="text"
                  value={previousCourse}
                  onChange={(e) => setPreviousCourse(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="previousCollegePassingYear">Previous College Passing Year:</label></td>
              <td>
                <input
                  id="previousCollegePassingYear"
                  type="number"
                  min="1900"
                  max="2099"
                  value={previousCollegePassingYear}
                  onChange={(e) => setPreviousCollegePassingYear(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="dateOfAdmission">Date of admission at MIT-WPU:</label></td>
              <td>
                <input
                  id="dateOfAdmission"
                  type="date"
                  value={dateOfAdmission}
                  onChange={(e) => setDateOfAdmission(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="dateOfLastAttendance">Date of Last attendance in MIT-WPU:</label></td>
              <td>
                <input
                  id="dateOfLastAttendance"
                  type="date"
                  value={dateOfLastAttendance}
                  onChange={(e) => setDateOfLastAttendance(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="dateOfBirth">Date of Birth:</label></td>
              <td>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="statePlaceOfBirth">State, Place of Birth:</label></td>
              <td>
                <input
                  id="statePlaceOfBirth"
                  type="text"
                  value={statePlaceOfBirth}
                  onChange={(e) => setStatePlaceOfBirth(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="nationality">Nationality:</label></td>
              <td>
                <input
                  id="nationality"
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="religion">Religion:</label></td>
              <td>
                <input
                  id="religion"
                  type="text"
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="casteSubCaste">Caste and Sub Caste:</label></td>
              <td>
                <input
                  id="casteSubCaste"
                  type="text"
                  value={casteSubCaste}
                  onChange={(e) => setCasteSubCaste(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="permanentAddress">Permanent Address:</label></td>
              <td>
                <input
                  id="permanentAddress"
                  type="text"
                  value={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="email">Email id:</label></td>
              <td>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="mobileNumber">Mobile number:</label></td>
              <td>
                <input
                  id="mobileNumber"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="mothersName">Mother's Name:</label></td>
              <td>
                <input
                  id="mothersName"
                  type="text"
                  value={mothersName}
                  onChange={(e) => setMothersName(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="alternateMobileNumber">Alternate Mobile number:</label></td>
              <td>
                <input
                  id="alternateMobileNumber"
                  type="tel"
                  value={alternateMobileNumber}
                  onChange={(e) => setAlternateMobileNumber(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
