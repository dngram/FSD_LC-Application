// app/home/page.tsx
import Link from 'next/link';
import React from 'react';
import "./styles/styles1.css"; // Import page-specific styles

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Leaving Certificate Portal</h1>
      <h2>Select Your Role:</h2>
      <Link href="/student/login">Student</Link>
      <br />
      <Link href="/faculty/department">Faculty</Link>
    </div>
  );
}
