// models/CollectionModel.js
import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
  collection_id: { type: String, required: true },
  user2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User2', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User1' }],
  totalStudents: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false }
});

export default mongoose.model('Collection', CollectionSchema);
  
