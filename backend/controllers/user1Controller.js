import user1Model from "../models/user1Model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// Register 
const registerUser = async (req, res) => {
  const { name, email, password,phone,fcmToken} = req.body;

  try {
    // if (!fcmToken) {
    //   return res.json({ success: false, message: "FCM token is required" });
    // }

    // Check if the email already exists in the database
    const exists = await user1Model.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "Email already exists" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Invalid email" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = new user1Model({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
      // ProfilePic: ProfilePic,
      fcmToken,
      
    });
    const user = await newuser.save();

    const user1Token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, user1Token });
   
  } catch (error) {
      console.error("Register error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error registering user" });
  }
};

//  Login
const loginUser = async (req, res) => {
  const { email, password,fcmToken } = req.body;
  const User1 = await user1Model.findOne({ email });

  if (!User1 || !(await bcrypt.compare(password, User1.password))) {
    return res.json({ success: false, message: "Invalid credentials or user not exists" });
  }

  const user1Token = jwt.sign({ id: User1._id }, process.env.JWT_SECRET);
  User1.fcmToken = fcmToken;
  await User1.save();

  res.json({ success: true, user1Token });
};




export {loginUser,registerUser};

