"use server";
import Package, { IPackage } from "@/database/package.modal";
import connectDB from "../mongodb";
import { PackageType } from "@/types";

export interface PackageInput {
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
): Promise<PackageType | null> {
  try {
    await connectDB();

    const newPackage = await Package.create(data);
    return JSON.parse(JSON.stringify(newPackage));
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
      price: 1,
    });
    return JSON.parse(JSON.stringify(packages));
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
}
export async function updatePackage(
  id: string,
  data: Partial<PackageInput>
): Promise<PackageType | null> {
  try {
    await connectDB();
    const updatedPackage = await Package.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updatedPackage ? JSON.parse(JSON.stringify(updatedPackage)) : null;
  } catch (error) {
    console.error("Error updating package:", error);
    return null;
  }
}

export async function deletePackage(id: string): Promise<boolean> {
  try {
    await connectDB();
    const result = await Package.findByIdAndDelete(id);
    return result ? true : false;
  } catch (error) {
    console.error("Error deleting package:", error);
    return false;
  }
}
