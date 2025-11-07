import mongoose, { Schema, Model, Document } from "mongoose";

export interface ISurname extends Document {
  key: string;
  surname: string;
  shortSummary: string;
  description: string;
  origin: string;
  published: boolean;
}

const SurnameSchema = new Schema<ISurname>(
  {
    key: { type: String, required: true },
    surname: { type: String, required: true },
    shortSummary: String,
    description: String,
    origin: String,
    published: Boolean,
  },
  { timestamps: true }
);

const Surname =
  (mongoose.models.surnames as Model<ISurname>) ||
  mongoose.model<ISurname>("surnames", SurnameSchema);

export default Surname;
