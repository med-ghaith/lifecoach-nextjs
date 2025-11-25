"use server";
import Package, { IPackage } from "@/database/package.modal";
import connectDB from "../mongodb";

interface PackageInput {
  name: string;
  price: number;
  SeanceNumber: number;
  duration: string;
  features: string[];
  highlighted?: boolean;
  fullWidth?: boolean;
  remis?: number;
}
// create package
export async function createPackage(
  data: PackageInput
): Promise<IPackage | null> {
  try {
    await connectDB();

    const newPackage = await Package.create(data);
    return newPackage;
  } catch (error) {
    console.error("Error creating package:", error);
    return null;
  }
}

//get all packages
export async function getAllPackages(): Promise<IPackage[]> {
  try {
    await connectDB();

    const packages = await Package.find().sort({
      price:1
    });
    return JSON.parse(JSON.stringify(packages));
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
}
