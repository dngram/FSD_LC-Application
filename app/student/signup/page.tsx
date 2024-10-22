// app/student/signup/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import "../login/styles/styles1.css";

export default function StudentSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text(); // Get the response as text
    let data;
    try {
      data = JSON.parse(text); // Try to parse the response
    } catch (error) {
      console.error("Error parsing JSON:", error);
      alert('An error occurred while processing your request.');
      return;
    }

    if (res.ok) {
      alert(data.message);
      router.push('/student/login');
    } else {
      alert(data.message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h1>Student Signup</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Signup</button>
    </form>
  );
}