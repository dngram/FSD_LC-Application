// app/faculty/[dept]/login/page.tsx
"use client";
import "./styles/styles1.css";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
export default function FacultyLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    // Replace with your actual login logic
    if (email && password) {
      router.push('/faculty/library/dashboard'); // Adjust based on department
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Faculty Login</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
}
