import bcrypt from "bcryptjs";
import connectDB from "../mongodb";
import User, { IUser } from "@/database/user.model";

export interface LoginResult {
  success: boolean;
  user?: Omit<IUser, "password">; // omit password when returning user
  message?: string;
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "Utilisateur non trouvé" };
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: "Mot de passe incorrect" };
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = JSON.parse(
      JSON.stringify(user)
    );

    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, message: "Erreur du serveur" };
  }
}
