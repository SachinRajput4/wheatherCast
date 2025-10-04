// controllers/analyticsController.js
// import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import {InvokeCommand } from "@aws-sdk/client-lambda";
import { lambdaClient } from "../config/awsConfig.js";
const REGION = process.env.AWS_REGION || "ap-south-1";
const LAMBDA_NAME = process.env.SESSION_ANALYTICS_LAMBDA || "AuraCheck_to_Fetch_Session_Analytics";

const lambda = lambdaClient;

// const lambda = new LambdaClient({ region: REGION });

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
    Payload: Buffer.from(JSON.stringify(payloadObj)),
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

// Controller functions

const getSessionByMonth = async (req, res) => {
  try {
    const { collectionId, month } = req.query;
    if (!collectionId || !month) {
      return res.status(400).json({ error: "collectionId and month required" });
    }
    const lambdaResp = await invokeLambda({ queryType: "BY_MONTH_SUMMARY", collectionId, month });
    return res.status(lambdaResp.statusCode).json(lambdaResp.body);
  } catch (err) {
    console.error("getSessionByMonth error:", err);
    return res.status(500).json({ error: "Failed to fetch session analytics", details: err.message });
  }
};

const getSessionByDate = async (req, res) => {
  try {
    const { collectionId, date } = req.query;
    if (!collectionId || !date) {
      return res.status(400).json({ error: "collectionId and date required" });
    }
    const lambdaResp = await invokeLambda({ queryType: "BY_DATE_SUMMARY", collectionId, date });
    return res.status(lambdaResp.statusCode).json(lambdaResp.body);
  } catch (err) {
    console.error("getSessionByDate error:", err);
    return res.status(500).json({ error: "Failed to fetch session analytics by date", details: err.message });
  }
};

const getSessionDetail = async (req, res) => {
  try {
    const { collectionId, date, classOrder } = req.query;
    if (!collectionId || !date || !classOrder) {
      return res.status(400).json({ error: "collectionId, date and classOrder required" });
    }
    const lambdaResp = await invokeLambda({ queryType: "BY_SESSION_DETAIL", collectionId, date, classOrder });
    return res.status(lambdaResp.statusCode).json(lambdaResp.body);
  } catch (err) {
    console.error("getSessionDetail error:", err);
    return res.status(500).json({ error: "Failed to fetch session detail", details: err.message });
  }
};
const getSessionDatesByMonth = async (req, res) => {
  try {
    const { collectionId, month } = req.query;
    if (!collectionId || !month) {
      return res.status(400).json({ error: "collectionId and month required" });
    }
    const lambdaResp = await invokeLambda({ 
      queryType: "BY_MONTH_DATES", 
      collectionId, 
      month 
    });
    return res.status(lambdaResp.statusCode).json(lambdaResp.body);
  } catch (err) {
    console.error("getSessionDatesByMonth error:", err);
    return res.status(500).json({ error: "Failed to fetch session dates", details: err.message });
  }
};

export { getSessionByMonth, getSessionByDate, getSessionDetail, getSessionDatesByMonth };
