
import {  InvokeCommand } from "@aws-sdk/client-lambda";
import { lambdaClient } from "../config/awsConfig.js";


const REGION = process.env.AWS_REGION || "ap-south-1";
const LAMBDA_NAME = process.env.ATTENDANCE_QUERY_LAMBDA || "AuraCheck_to_Fetch_Attendance_by_Date_month_collection_student";

const lambda = lambdaClient;

function decodePayload(payload) {
  if (!payload) return null;
  const text = Buffer.from(payload).toString("utf8");
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function invokeLambda(payloadObj) {
  const cmd = new InvokeCommand({
    FunctionName: LAMBDA_NAME,
    Payload: Buffer.from(JSON.stringify(payloadObj)), // ✅ no wrapping
  });

  const resp = await lambda.send(cmd);

  if (resp.FunctionError) {
    const errPayload = decodePayload(resp.Payload);
    throw new Error(`Lambda FunctionError: ${JSON.stringify(errPayload)}`);
  }

  const decoded = decodePayload(resp.Payload);
  if (decoded && typeof decoded === "object" && "statusCode" in decoded && "body" in decoded) {
    let body = decoded.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch {}
    }
    return { statusCode: decoded.statusCode, body };
  }

  return { statusCode: 200, body: decoded };
}

// Controllers

const getCollectionByDate = async (req, res) => {
  try {
    const { collectionId, date } = req.query;
    if (!collectionId || !date) {
      return res.status(400).json({ error: "Missing required query params: collectionId, date" });
    }
    const lambdaResp = await invokeLambda({
      queryType: "BY_DATE_COLLECTION",
      collectionId,
      date,
    });
    console.log("Lambda Response:", lambdaResp);

    return res.status(lambdaResp.statusCode).json(lambdaResp.body);
  } catch (err) {
    console.error("getCollectionByDate error:", err);
    return res.status(500).json({ error: "Failed to fetch attendance by date", details: err.message });
  }
};

const getCollectionByMonth = async (req, res) => {
  try {
    const { collectionId, month } = req.query;
    if (!collectionId || !month) {
      return res.status(400).json({ error: "Missing required query params: collectionId, month" });
    }
    const lambdaResp = await invokeLambda({
      queryType: "BY_MONTH_COLLECTION",
      collectionId,
      month,
    });
    return res.status(lambdaResp.statusCode).json(lambdaResp.body);
  } catch (err) {
    console.error("getCollectionByMonth error:", err);
    return res.status(500).json({ error: "Failed to fetch attendance by month", details: err.message });
  }
};

const getStudentByMonth = async (req, res) => {
  try {
    const { studentId, month, collectionId } = req.query;
    if (!studentId || !month || !collectionId) {
      return res.status(400).json({ error: "Missing required query params: studentId, month, collectionId" });
    }
    const lambdaResp = await invokeLambda({
      queryType: "BY_MONTH_STUDENT",
      collectionId,
      studentId,
      month,
    });
    return res.status(lambdaResp.statusCode).json(lambdaResp.body);
  } catch (err) {
    console.error("getStudentByMonth error:", err);
    return res.status(500).json({ error: "Failed to fetch student attendance by month", details: err.message });
  }
};

const getStudentByDate = async (req, res) => {
  try {
    const { studentId, date, collectionId } = req.query;
    if (!studentId || !date || !collectionId) {
      return res.status(400).json({ error: "Missing required query params: studentId, date, collectionId" });
    }
    const lambdaResp = await invokeLambda({
      queryType: "BY_DATE_STUDENT",
      collectionId,
      studentId,
      date,
    });
    return res.status(lambdaResp.statusCode).json(lambdaResp.body);
  } catch (err) {
    console.error("getStudentByDate error:", err);
    return res.status(500).json({ error: "Failed to fetch student attendance by date", details: err.message });
  }
};

export { getCollectionByDate, getCollectionByMonth, getStudentByMonth, getStudentByDate };





















// import axios from 'axios';

// // controllers/attendanceController.js
// import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

// const REGION = process.env.AWS_REGION || "ap-south-1";
// const LAMBDA_NAME = process.env.ATTENDANCE_QUERY_LAMBDA || "AuraCheck_Lambda_Fun_to_Fetch_Attendance_by_Date_and_Collection";

// const lambda = new LambdaClient({ region: REGION });

// /**
//  * Decode Lambda Invoke Payload (Uint8Array) into JS value.
//  * If payload is JSON-stringified, parse it.
//  */
// function decodePayload(payload) {
//   if (!payload) return null;
//   // payload can be Uint8Array / ArrayBuffer; Buffer handles it
//   const text = Buffer.from(payload).toString("utf8");
//   try {
//     return JSON.parse(text);
//   } catch (e) {
//     // not a JSON string — return raw text
//     return text;
//   }
// }

// /**
//  * Invoke the Lambda synchronously and return parsed result.
//  * Throws on Lambda FunctionError.
//  */
// async function invokeLambda(payloadObj) {
//   const cmd = new InvokeCommand({
//     FunctionName: LAMBDA_NAME,
//     // InvocationType: "RequestResponse", 
//     Payload: Buffer.from(JSON.stringify({
//         queryStringParameters: payloadObj,   // 👈 wrap here to mimic API Gateway
//       })),
//   });

//   const resp = await lambda.send(cmd);

//   // If Lambda signaled a function error (unhandled exception)
//   if (resp.FunctionError) {
//     const errPayload = decodePayload(resp.Payload);
//     const message = typeof errPayload === "string" ? errPayload : JSON.stringify(errPayload);
//     throw new Error(`Lambda FunctionError: ${message}`);
//   }

//   const decoded = decodePayload(resp.Payload);

//   // If Lambda returns an API-style envelope { statusCode, body }
//   if (decoded && typeof decoded === "object" && "statusCode" in decoded && "body" in decoded) {
//     let body = decoded.body;
//     if (typeof body === "string") {
//       // body may be stringified JSON
//       try { body = JSON.parse(body); } catch (e) { /* leave as string */ }
//     }
//     return { statusCode: decoded.statusCode, body };
//   }

//   // Otherwise return decoded directly
//   return { statusCode: 200, body: decoded };
// }










// const getTeacherAttendance = async (req, res) => {
//   try {
//     const { collectionId, attendanceDate } = req.query;

//     if (!collectionId || !attendanceDate) {
//       return res.status(400).json({ error: 'Missing collectionId or attendanceDate' });
//     }

//     const lambdaUrl = `https://${process.env.aws_API_Key}.execute-api.ap-south-1.amazonaws.com/prod/view-attendance-history-collection-date`;

//     const response = await axios.get(lambdaUrl, {
//       params: { collectionId, attendanceDate },
//     });

//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error('Error fetching teacher attendance:', error.message);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// };

// const getStudentAttendance = async (req, res) => {
//   try {
//     const { studentId, collectionId } = req.query;

//     if (!studentId || !collectionId) {
//       return res.status(400).json({ error: 'Missing studentId or collectionId' });
//     }

//     const lambdaUrl = `https://${process.env.aws_API_Key}.execute-api.ap-south-1.amazonaws.com/prod/view-attendance-history-student-date`;

//     const response = await axios.get(lambdaUrl, {
//       params: { studentId, collectionId },
//     });

//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error('Error fetching student attendance:', error.message);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// };







// /* ----- Controllers ----- */

// /**
//  * GET /api/attendance/collection/by-date?collectionId=COL&date=YYYY-MM-DD
//  */
// const getCollectionByDate = async (req, res) => {
//   try {
//     const { collectionId, date } = req.query;
//     if (!collectionId || !date) {
//       return res.status(400).json({ error: "Missing required query params: collectionId, date" });
//     }

//     const lambdaResp = await invokeLambda({
//       queryType: "BY_DATE_COLLECTION",
//       collectionId,
//       date,
//     });

//     return res.status(lambdaResp.statusCode || 200).json(lambdaResp.body);
//   } catch (err) {
//     console.error("getCollectionByDate error:", err);
//     return res.status(500).json({ error: "Failed to fetch attendance by date", details: err.message });
//   }
// }

// /**
//  * GET /api/attendance/collection/by-month?collectionId=COL&month=YYYY-MM
//  */
// const getCollectionByMonth = async (req, res) => {
//   try {
//     const { collectionId, month } = req.query;
//     if (!collectionId || !month) {
//       return res.status(400).json({ error: "Missing required query params: collectionId, month" });
//     }

//     const lambdaResp = await invokeLambda({
//       queryType: "BY_MONTH_COLLECTION",
//       collectionId,
//       month,
//     });

//     return res.status(lambdaResp.statusCode || 200).json(lambdaResp.body);
//   } catch (err) {
//     console.error("getCollectionByMonth error:", err);
//     return res.status(500).json({ error: "Failed to fetch attendance by month", details: err.message });
//   }
// }

// /**
//  * GET /api/attendance/student/by-month?studentId=STU&month=YYYY-MM
//  */
// const getStudentByMonth = async (req, res) => {
//   try {
//     const { studentId, month } = req.query;
//     if (!studentId || !month) {
//       return res.status(400).json({ error: "Missing required query params: studentId, month" });
//     }

//     const lambdaResp = await invokeLambda({
//       queryType: "BY_MONTH_STUDENT",
//       studentId,
//       month,
//     });

//     return res.status(lambdaResp.statusCode || 200).json(lambdaResp.body);
//   } catch (err) {
//     console.error("getStudentByMonth error:", err);
//     return res.status(500).json({ error: "Failed to fetch student attendance by month", details: err.message });
//   }
// }

// /**
//  * GET /api/attendance/student/by-date?studentId=STU&date=YYYY-MM-DD
//  */
// const getStudentByDate = async (req, res) => {
//   try {
//     const { studentId, date } = req.query;
//     if (!studentId || !date) {
//       return res.status(400).json({ error: "Missing required query params: studentId, date" });
//     }

//     const lambdaResp = await invokeLambda({
//       queryType: "BY_DATE_STUDENT",
//       studentId,
//       date,
//     });

//     return res.status(lambdaResp.statusCode || 200).json(lambdaResp.body);
//   } catch (err) {
//     console.error("getStudentByDate error:", err);
//     return res.status(500).json({ error: "Failed to fetch student attendance by date", details: err.message });
//   }
// }




// export { getTeacherAttendance, getStudentAttendance, getCollectionByDate, getCollectionByMonth, getStudentByMonth, getStudentByDate };
