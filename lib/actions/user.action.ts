import connectDB from "@/lib/mongodb";
import User from "@/database/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export interface LoginResult {
  success: boolean;
  message?: string;
  user?: Omit<typeof User, "password">;
  accessToken?: string;
  refreshToken?: string;
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    await connectDB();

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return { success: false, message: "Utilisateur non trouvé" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: "Mot de passe incorrect" };
    }

    const { password: _, ...userWithoutPassword } = user;

    // Create JWT token
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "1h" }
    );
   
    return { success: true, user: userWithoutPassword, accessToken, refreshToken };
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, message: "Erreur du serveur" };
  }
}
