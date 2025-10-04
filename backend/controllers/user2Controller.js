import user2Model from "../models/user2Model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// Register 
const registerUser = async (req, res) => {
  const { name, email, password,phone,ProfilePic } = req.body;

  try {

    // Check if the email already exists in the database
    const exists = await user2Model.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "Email already exists" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Invalid email" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = new user2Model({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
      ProfilePic: ProfilePic,
      
    });
    const user = await newuser.save();

    const user2Token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, user2Token });
   
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error registering user" });
  }
};

//  Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const User2 = await user2Model.findOne({ email });

  if (!User2 || !(await bcrypt.compare(password, User2.password))) {
    return res.json({ success: false, message: "Invalid credentials or user not exists" });
  }

  const user2Token = jwt.sign({ id: User2._id }, process.env.JWT_SECRET);
  await User2.save();

  res.json({ success: true, user2Token });
};




export {loginUser,registerUser};

