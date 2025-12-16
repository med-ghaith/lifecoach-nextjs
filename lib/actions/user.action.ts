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
export async function changePasswordByEmail(
  email: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "Utilisateur non trouvé" };
    }
    // Prevent same password reuse
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return {
        success: false,
        message: "Le nouveau mot de passe doit être différent de l’ancien",
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return {
      success: true,
      message: "Mot de passe modifié avec succès",
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, message: "Erreur du serveur" };
  }
}
