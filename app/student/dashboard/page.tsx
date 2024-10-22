// app/student/dashboard/page.tsx
import Link from 'next/link';
import React from 'react';
import "./styles/styles1.css";
export default function StudentDashboard() {
  return (
    <div>
      <h1>Student Dashboard</h1>
      <Link href="/student/dashboard/form">Fill Form</Link>
      <br />
      <Link href="/student/check-status">Check Status</Link>
      <br />
      <Link href="/student/download-lc">Download LC</Link>
    </div>
  );
}
