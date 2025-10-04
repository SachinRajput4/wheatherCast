import jwt from "jsonwebtoken";
import Collection from "../models/collectionModel.js";
import axios from "axios";
import User1 from "../models/user1Model.js";
import mongoose from "mongoose";

const generateTokenLink = (req, res) => {
  const { CollectionId, expiryHours } = req.body;

  if (!CollectionId || !expiryHours) {
    return res
      .status(400)
      .json({ message: "CollectionId and expiryHours are required" });
  }

  const token = jwt.sign({ CollectionId }, process.env.JWT_SECRET, {
    expiresIn: `${expiryHours}h`,
  });

  const link = `${process.env.frontend_user1_url}/join-attendance-room/?CollectionId=${CollectionId}&token=${token}`;
  res.status(200).json({ link, expiresIn: `${expiryHours} hours` });
};

// Step 2: Receiver uses tokenized link to add student




const presignForUploadS3Index = async (req, res) => {
  const { CollectionId, filename, sid } = req.query;
  const user1Id = req.user1Id;
  if (!CollectionId || !filename || !sid || !user1Id) {
    return res
      .status(400)
      .json({
        message: `${CollectionId}, ${filename}, ${sid}, and ${user1Id} are required`,
      });
  }

  try {
    const presignRes = await axios.get(
      `https://${process.env.aws_API_Key}.execute-api.ap-south-1.amazonaws.com/prod/presign-put-object-index-collectionid?filename=${filename}&objectid=${user1Id}&sid=${sid}&collectionid=${CollectionId}`
    );
    // console.log("Presigned URL:", presignRes.data.uploadUrl);

    res
      .status(200)
      .json({
        uploadUrl: presignRes.data.uploadUrl,
        user1Id: user1Id,
        message: "Student added successfully",
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding student", error: err.message });
  }
};







const addStudentToCollection = async (req, res) => {
  const { user1Id, collectionId } = req.body;

  if (!user1Id || !collectionId) {
    return res.status(400).json({
      success: false,
      message: "user1Id and collectionId are required",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const student = await User1.findById(user1Id).session(session);
    if (!student) throw new Error("Student not found");

    const collection = await Collection.findById(collectionId).session(session);
    if (!collection) throw new Error("Collection not found");

    // Add collectionId to student (if not already exists)
    await User1.updateOne(
      { _id: user1Id },
      { $addToSet: { collections: collectionId } },
      { session }
    );

    // Add student to collection and increment totalStudents atomically
    const updateResult = await Collection.updateOne(
      { _id: collectionId, students: { $ne: user1Id } }, // only if not already there
      {
        $addToSet: { students: user1Id },
        $inc: { totalStudents: 1 },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message:
        updateResult.modifiedCount > 0
          ? "Student added successfully"
          : "Student already exists in collection",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to add student",
      error: err.message,
    });
  }
};


// const addStudentToCollection = async (req, res) => {
//   const { user1Id, collectionId } = req.body;

//   if (!user1Id || !collectionId) {
//     return res
//       .status(400)
//       .json({
//         success: false,
//         message: "user1Id and collectionId are required",
//       });
//   }

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const student = await User1.findById(user1Id).session(session);
//     const collection = await Collection.findById(collectionId).session(session);

//     if (!student || !collection) {
//       throw new Error("Student or Collection not found");
//     }

//     if (!student.collections.includes(collectionId)) {
//       student.collections.push(collectionId);
//       await student.save({ session });
//     }

//     if (!collection.students.includes(user1Id)) {
//       collection.students.push(user1Id);
//       collection.totalStudents += 1; // Increment by 1
//       await collection.save({ session });
//     }

//     await session.commitTransaction();
//     session.endSession();

//     return res
//       .status(200)
//       .json({ success: true, message: "Student added successfully" });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Transaction failed:", err.message);
//     return res
//       .status(500)
//       .json({
//         success: false,
//         message: "Failed to add student",
//         error: err.message,
//       });
//   }
// };

const removeStudentFromCollection = async (req, res) => {
  const { user1Id, collectionId } = req.body;

  if (!user1Id || !collectionId) {
    return res
      .status(400)
      .json({
        success: false,
        message: "user1Id and collectionId are required",
      });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const student = await User1.findById(user1Id).session(session);
    const collection = await Collection.findById(collectionId).session(session);

    if (!student || !collection) {
      throw new Error("Student or Collection not found");
    }

    // 1️⃣ Remove collection from student
    student.collections = student.collections.filter(
      (colId) => colId.toString() !== collectionId.toString()
    );
    await student.save({ session });

    // 2️⃣ Remove student from collection
    collection.students = collection.students.filter(
      (stuId) => stuId.toString() !== user1Id.toString()
    );
    collection.totalStudents = Math.max(0, collection.totalStudents - 1); // Decrement by 1, never below 0
    await collection.save({ session });

    // ✅ Commit
    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json({ success: true, message: "Student removed successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", err.message);
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to remove student",
        error: err.message,
      });
  }
};

export {
  generateTokenLink,
  presignForUploadS3Index,
  addStudentToCollection,
  removeStudentFromCollection,
};
