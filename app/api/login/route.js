import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectMongo from '@/lib/mongodb';

export async function POST(req) {
  try {
    await connectMongo();
    const { email, password, type } = await req.json();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    // Check if the account type matches
    if (user.type !== type) {
      return new Response(
        JSON.stringify({ error: `You are not authorized as a ${type}` }),
        { status: 403 }
      );
    }

    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 400 }
      );
    }

    // If everything is correct
    console.log("User logged in:", user);
    return new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 });
  } catch (error) {
    console.error("Error in login:", error);
    return new Response(
      JSON.stringify({ error: 'Login failed' }),
      { status: 500 }
    );
  }
}
