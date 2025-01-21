import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  footer: { type: String, required: true },
  images: [String],
});

export const Email = mongoose.model("Email", emailSchema);
