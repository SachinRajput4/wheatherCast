// controllers/awsSearchController.js
// import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import {  InvokeCommand } from "@aws-sdk/client-lambda";
import { lambdaClient } from "../config/awsConfig.js";
// const lambda = lambdaClient;

import dotenv from "dotenv";
import axios from "axios";
import Collection from "../models/collectionModel.js";

dotenv.config();

// ✅ Initialize Lambda client with default region
// const lambdaClient = new LambdaClient({
//   region: process.env.AWS_REGION || "ap-south-1",
// });

// ✅ Lambda names with fallbacks
const SEARCH_LAMBDA_NAME =
  process.env.SEARCH_LAMBDA_NAME ||
  "AuraCheck_LambdaFunction_generate_Search_PresignedUrl";

const RESULT_LAMBDA_NAME =
  process.env.RESULT_LAMBDA_NAME || "resultPresignLambda";

/**
 * 🔹 Call Lambda directly to get S3 upload presigned URL
 */
export const searchFace = async (req, res) => {
  try {
    const { filename, collectionId, date, classOrder } = req.body;
    const user2Id = req.user2Id;
    console.log("user2Id", user2Id);

    if (!filename || !collectionId || !date || !classOrder || !user2Id) {
      return res.status(400).json({ error: "Missing parameters" });
    }
    // Fetch collection metadata from MongoDB (prefer cached totalStudents)
    const collection = await Collection.findById(collectionId).lean();
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const totalStudents =
      collection.totalStudents != null
        ? collection.totalStudents
        : Array.isArray(collection.students)
        ? collection.students.length
        : 0;
    console.log("totalStudents", totalStudents);
    const params = {
      FunctionName: SEARCH_LAMBDA_NAME,
      Payload: JSON.stringify({
        filename,
        collectionid: collectionId,
        date,
        classorder: classOrder,
        teacherid: user2Id,
        totalstudents: totalStudents,
      }),
    };

    // 🔹 Invoke Lambda
    const response = await lambdaClient.send(new InvokeCommand(params));

    // 🔹 Safe parse
    const decoded = new TextDecoder("utf-8").decode(response.Payload);
    const payload = JSON.parse(decoded);
    const body =
      typeof payload.body === "string"
        ? JSON.parse(payload.body)
        : payload.body;

    return res
      .status(200)
      .json({
        uploadUrl: body.uploadUrl,
        teacherId: user2Id,
        totalStudents: totalStudents,
      });
  } catch (err) {
    console.error(
      "Presigned URL error:",
      JSON.stringify(err, null, 2) // ✅ Better logging
    );
    res.status(500).json({ error: "Failed to get presigned URL" });
  }
};

/**
 * 🔹 Call Lambda directly to get presigned URL for results,
 * then fetch the result JSON using axios
 */
export const getSearchResults = async (req, res) => {
  try {
    const { filename, collectionId } = req.query;
    if (!filename || !collectionId) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const params = {
      FunctionName: RESULT_LAMBDA_NAME,
      Payload: JSON.stringify({
        filename,
        collectionid: collectionId,
      }),
    };

    // 🔹 Invoke Lambda
    const response = await lambdaClient.send(new InvokeCommand(params));

    // 🔹 Safe parse
    const decoded = new TextDecoder("utf-8").decode(response.Payload);
    const payload = JSON.parse(decoded);
    const body =
      typeof payload.body === "string"
        ? JSON.parse(payload.body)
        : payload.body;

    // 🔹 Use axios to download result JSON
    const resultRes = await axios.get(body.resultUrl);
    return res.status(200).json(resultRes.data);
  } catch (err) {
    console.error(
      "Fetch result error:",
      JSON.stringify(err, null, 2) // ✅ Better logging
    );
    res.status(500).json({ error: "Failed to fetch results" });
  }
};

// // controllers/awsSearchController.js
// import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
// import dotenv from "dotenv";
// import axios from "axios";

// dotenv.config();

// const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });

// /**
//  * 🔹 Call Lambda directly to get S3 upload presigned URL
//  */
// export const searchFace = async (req, res) => {
//   try {
//     const { filename, collectionId, date, classOrder } = req.body;
//     if (!filename || !collectionId || !date || !classOrder) {
//       return res.status(400).json({ error: "Missing parameters" });
//     }

//     const params = {
//       FunctionName: "AuraCheck_LambdaFunction_generate_Search_PresignedUrl", // Replace with your Lambda name
//       Payload: JSON.stringify({
//         filename: filename,
//         collectionid: collectionId,
//         date: date,
//         classorder: classOrder,
//       }),
//     };

//     // 🔹 Invoke Lambda
//     const response = await lambdaClient.send(new InvokeCommand(params));
//     // const payload = JSON.parse(new TextDecoder("utf-8").decode(response.Payload));
//     // const body = JSON.parse(payload.body);
//     const payload = JSON.parse(new TextDecoder("utf-8").decode(response.Payload));
// const body = typeof payload.body === "string" ? JSON.parse(payload.body) : payload.body;

//     return res.status(200).json({ uploadUrl: body.uploadUrl });
//   } catch (err) {
//     console.error("Presigned URL error:", err);
//     res.status(500).json({ error: "Failed to get presigned URL" });
//   }
// };

// /**
//  * 🔹 Call Lambda directly to get presigned URL for results,
//  * then fetch the result JSON using axios
//  */
// export const getSearchResults = async (req, res) => {
//   try {
//     const { filename, collectionId } = req.query;
//     if (!filename || !collectionId) {
//       return res.status(400).json({ error: "Missing parameters" });
//     }

//     const params = {
//       FunctionName: "resultPresignLambda", // Replace with your Lambda name
//       Payload: JSON.stringify({
//         filename,
//         collectionid: collectionId,
//       }),
//     };

//     // 🔹 Invoke Lambda
//     const response = await lambdaClient.send(new InvokeCommand(params));
//     const payload = JSON.parse(new TextDecoder("utf-8").decode(response.Payload));
//     const body = JSON.parse(payload.body);

//     // 🔹 Use axios to download result JSON
//     const resultRes = await axios.get(body.resultUrl);
//     return res.status(200).json(resultRes.data);
//   } catch (err) {
//     console.error("Fetch result error:", err);
//     res.status(500).json({ error: "Failed to fetch results" });
//   }
// };

// // controllers/awsSearchController.js
// import axios from 'axios';

// export const searchFace = async (req, res) => {
//   try {
//     const { filename, collectionId, fileType,date,classOrder} = req.body;
//     if (!filename || !collectionId || !fileType|| !date || !classOrder) {
//       return res.status(400).json({ error: 'Missing parameters' });
//     }

//     // Step 1: Get presigned URL
//     const presignRes = await axios.get(
//       `https://${process.env.aws_API_Key}.execute-api.ap-south-1.amazonaws.com/prod/generate-presigned-url-putobject-s3-search-collectionid?filename=${filename}&collectionid=${collectionId}&date=${date}&classorder=${classOrder}&totalStudent=${totalStudent}`
//     );
//     const presignedUrl = presignRes.data.uploadUrl;
//     return res.status(200).json({ uploadUrl: presignedUrl});
//   } catch (err) {
//     console.error("Presigned URL error:", err);
//     res.status(500).json({ error: "Failed to get presigned URL" });
//   }
// };

// export const getSearchResults = async (req, res) => {
//   try {
//     const { filename, collectionId } = req.query;
//     if (!filename || !collectionId) {
//       return res.status(400).json({ error: 'Missing parameters' });
//     }

//     // Step 2: Get result file URL
//     const resultPresign = await axios.get(
//       `https://${process.env.aws_API_Key}.execute-api.ap-south-1.amazonaws.com/prod/get-results-from-the-result-collectionid?filename=${filename}&collectionid=${collectionId}`
//     );
//     const resultUrl = resultPresign.data.resultUrl;

//     // Step 3: Fetch the result file
//     const resultRes = await axios.get(resultUrl);
//     return res.status(200).json(resultRes.data);
//   } catch (err) {
//     console.error("Fetch result error:", err);
//     res.status(500).json({ error: "Failed to fetch results" });
//   }
// };
