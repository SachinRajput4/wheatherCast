// models/User1Model.js
import mongoose from "mongoose";
const User1Schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  facePic: { type: String, default: "" },
  password: { type: String, required: true },
  fcmToken: { type: String },
  collections: [{ type: String, ref: "Collection" }],
}, { timestamps: true });

const user1Model = mongoose.models.User1 || mongoose.model("User1", User1Schema);
export default user1Model;
