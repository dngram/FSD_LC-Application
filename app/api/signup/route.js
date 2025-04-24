import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectMongo from '@/lib/mongodb';

export async function POST(req) {
  try {
    await connectMongo();
    const { email, password } = await req.json();

    const emailRoleMapping = {
      'hos@mitwpu.edu.in': 'HoS',
      'librarian@mitwpu.edu.in': 'Librarian',
      'accounts@mitwpu.edu.in': 'Accounts',
      'gymkhana@mitwpu.edu.in': 'Gymkhana',
      'programoffice@mitwpu.edu.in': 'ProgramOffice',
      'dean@mitwpu.edu.in': 'Dean'
    };

    let role = emailRoleMapping[email.toLowerCase()];
    
    if (!role) {
      role = 'student';
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      type: role 
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
