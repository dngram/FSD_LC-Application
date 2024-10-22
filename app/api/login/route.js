// app/api/login/route.js

import connectMongo from '@/lib/mongodb';  // Ensure the path is correct
import User from '@/models/User';         // Ensure the path is correct
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';              // Assuming you're using bcrypt for password hashing

export async function POST(req) {
  try {
    // Parse the request body
    const { email, password } = await req.json();

    // Connect to MongoDB
    await connectMongo();

    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return NextResponse.json({ message: 'Incorrect password' }, { status: 401 });
    }

    // Respond with success (e.g., send token or session setup can go here)
    return NextResponse.json({ message: 'Login successful', user: existingUser }, { status: 200 });
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
