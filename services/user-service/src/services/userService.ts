import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";

export interface RegisterUserData {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export const registerUser = async (
  userData: RegisterUserData
): Promise<{ user: Partial<IUser>; token: string }> => {
  try {
    console.log("🔄 Registering new user:", userData.email);

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create user
    const user = new User({
      ...userData,
      password: hashedPassword,
    });

    await user.save();
    console.log("✅ User registered successfully:", user.email);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" }
    );

    // Return user data without password
    const { password, ...userWithoutPassword } = user.toObject();

    return {
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    console.log("❌ Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (
  loginData: LoginUserData
): Promise<{ user: Partial<IUser>; token: string }> => {
  try {
    console.log("🔄 User login attempt:", loginData.email);

    // Find user by email
    const user = await User.findOne({ email: loginData.email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    console.log("✅ User login successful:", user.email);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" }
    );

    // Return user data without password
    const { password, ...userWithoutPassword } = user.toObject();

    return {
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    console.log("❌ Error logging in user:", error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<Partial<IUser>> => {
  try {
    console.log("🔄 Fetching user profile:", userId);

    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }

    console.log("✅ User profile fetched successfully");
    return user.toObject();
  } catch (error) {
    console.log("❌ Error fetching user profile:", error);
    throw error;
  }
};
