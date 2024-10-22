// app/faculty/department/page.tsx
import "./styles/styles1.css";
import Link from 'next/link';
import React from 'react';
export default function FacultyDepartment() {
  return (
    <div>
      <h1>Select Department</h1>
      <Link href="/faculty/admin/login">Admin</Link>
      <br />
      <Link href="/faculty/library/login">Library</Link>
      <br />
      <Link href="/faculty/academic_dept/login">Academic Department</Link>
    </div>
  );
}
