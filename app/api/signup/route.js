import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectMongo from '@/lib/mongodb';

export async function POST(req) {
  try {
    await connectMongo();
    const { email, password, type } = await req.json();

    // Validate the type field (it should be either "student" or "faculty")
    if (!['student', 'faculty'].includes(type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid user type' }),
        { status: 400 }
      );
    }

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

    // Create a new user with the dynamic type (student or faculty)
    const newUser = new User({
      email,
      password: hashedPassword,
      type, // Use the passed type field from the frontend
    });

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
