// app/api/signup/route.js

import connectMongo from '@/lib/mongodb';  // Ensure path is correct
import User from '@/models/User';         // Ensure path is correct
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';              // Assuming you're using bcrypt for password hashing


export async function POST(req) {
  try {
    await connectMongo();
    const { email, password } = await req.json();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword });
    const savedUser = await newUser.save();

    console.log("User successfully saved:", savedUser);
    return new Response(JSON.stringify(savedUser), { status: 201 });
  } catch (error) {
    console.error("Error in signup:", error);
    return new Response(
      JSON.stringify({ error: 'Failed to sign up' }),
      { status: 500 }
    );
  }
}