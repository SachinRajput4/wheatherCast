import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: {
    type: String,
    validate: {
      validator: (v) => /^[+\d]?(?:[\d-.\s()]*)$/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  ProfilePic: { type: String, default: "" },
  collections: [{ type: String, ref: "Collection" }],
}, { timestamps: true });


const user2Model = mongoose.models.User2 || mongoose.model("User2", userSchema);
export default user2Model;




// // models/User2Model.js
// const mongoose = require('mongoose');

// const User2Schema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String }, // hashed password for login
//   collections: [{ type: String }], // array of collection IDs
// }, { timestamps: true });

// module.exports = mongoose.model('User2', User2Schema);

