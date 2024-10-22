// app/faculty/[dept]/dashboard/page.tsx
"use client";
import Link from 'next/link';
import "C:\Users\Dheeraj Sharma\fsd_mp\app\faculty\academic dept\dashboard\styles/styles1.css";
import React from 'react';
export default function FacultyDashboard() {
  return (
    <div>
      <h1>Faculty Dashboard</h1>
      <Link href="/faculty/academic dept/applications">Students Applications</Link>
      <br />
      <Link href="/faculty/academic dept/upload-notice">Upload Notice</Link>
    </div>
  );
}
