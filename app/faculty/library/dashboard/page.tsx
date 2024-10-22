// app/faculty/[dept]/dashboard/page.tsx
"use client";
import "./styles/styles1.css";
import Link from 'next/link';
import React from 'react';
export default function FacultyDashboard() {
  return (
    <div>
      <h1>Faculty Dashboard</h1>
      <Link href="/faculty/library/applications">Students Applications</Link>
      <br />
      <Link href="/faculty/library/upload-notice">Upload Notice</Link>
    </div>
  );
}
