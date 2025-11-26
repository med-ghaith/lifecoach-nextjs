import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import User from "../database/user.model";
import connectDB from "../lib/mongodb";
import bcrypt from "bcryptjs";
async function seedUsers() {
  try {
    await connectDB();
    // Check if user already exists
    const existingUser = await User.findOne({ email: "admin@example.com" });
    if (existingUser) {
      console.log("User already exists. Skipping seeding.");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create user
    const user = new User({
      email: "admin@example.com",
      password: hashedPassword,
    });

    await user.save();

    console.log("User seeded successfully:", user.email);
  } catch (error) {
    console.error("Error seeding user:", error);
  } finally {
    process.exit();
  }
}

seedUsers();
