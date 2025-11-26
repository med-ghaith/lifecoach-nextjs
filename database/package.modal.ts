import { Schema, model, models, Document } from "mongoose";

export interface IPackage extends Document {
  name: string;
  price: number;
  SeanceNumber?: number; // optional because some packages don’t have it
  duration?: string; // optional because some packages don’t have it
  features: string[];
  highlighted?: boolean; // optional
  fullWidth?: boolean; // optional
  badge?: string; // optional
  discount?: number; // optional
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: {
      type: String,
      required: [true, "Le nom du package est requis"],
      trim: true,
    },
    price: {
      type: Number,
      required: [false, "Le prix est requis"],
      trim: true,
    },
    SeanceNumber: {
      type: Number,
      required: [true, "Le SeanceNumber est requis"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "La durée est requise"],
      trim: true,
    },
    badge: {
      type: String,
      required: [false, "La badge est requise"],
      trim: true,
    },
    features: {
      type: [String],
      required: true,
      default: [],
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Package = models.Package || model<IPackage>("Package", PackageSchema);

export default Package;
