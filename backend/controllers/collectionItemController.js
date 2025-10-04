import { InvokeCommand } from "@aws-sdk/client-lambda";
import { lambdaClient } from "../config/awsConfig.js";


// Initialize Lambda client (v3)
// const lambdaClient = new LambdaClient({
//   region: process.env.AWS_REGION || "ap-south-1",
// });

const LAMBDA_FUNCTION_NAME =
  process.env.FACES_LAMBDA_NAME || "your-lambda-function-name";

// Controller 1: Get faces by collection (basic)
const getFacesByCollection = async (req, res) => {
  const { collectionId } = req.query;

  if (!collectionId) {
    return res.status(400).json({ error: "Missing collectionId" });
  }

  const payload = {
    queryStringParameters: { collectionId },
  };

  try {
    const command = new InvokeCommand({
      FunctionName: LAMBDA_FUNCTION_NAME,
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    const response = await lambdaClient.send(command);

    // Parse Lambda payload
    const parsed = JSON.parse(new TextDecoder("utf-8").decode(response.Payload));
    const body =
      typeof parsed.body === "string" ? JSON.parse(parsed.body) : parsed.body;

    return res.status(parsed.statusCode || 200).json(body ?? {});
  } catch (error) {
    console.error("Lambda invoke error:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch faces from Lambda" });
  }
};

// Controller 2: Paginated fetch from DynamoDB via Lambda
const get_face_recognition_table1_data = async (req, res) => {
  try {
    const { collectionId, limit = 20, lastKey } = req.query;

    if (!collectionId) {
      return res.status(400).json({ error: "collectionId is required" });
    }

    const payload = {
      queryStringParameters: {
        collectionId,
        limit,
        lastKey,
      },
    };

    const command = new InvokeCommand({
      FunctionName:
        process.env.FACES_TABLE1_LAMBDA_NAME ||
        "AuraCheck_get_items_from_face_recognition_table1",
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    const response = await lambdaClient.send(command);

    const result = JSON.parse(
      new TextDecoder("utf-8").decode(response.Payload)
    );

    if (result.statusCode !== 200) {
      return res.status(result.statusCode).json(JSON.parse(result.body));
    }

    return res.json(JSON.parse(result.body));
  } catch (err) {
    console.error("Error invoking Lambda:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Controller 3: Delete face from collection
const deleteFaceFromCollection = async (req, res) => {
  const { RekognitionId, user1Id, CollectionId, s3_key } = req.body;

  if (!RekognitionId || !user1Id || !CollectionId || !s3_key) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const payload = {
      body: JSON.stringify({
        RekognitionId,
        user1Id,
        CollectionId,
        s3_key,
      }),
    };

    const command = new InvokeCommand({
      FunctionName:
        process.env.DELETE_FACE_LAMBDA_NAME || "AuraCheck_LambdaFunction_delete_face_from_Collection",
      InvocationType: "RequestResponse",
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    const response = await lambdaClient.send(command);

    const parsed = JSON.parse(new TextDecoder("utf-8").decode(response.Payload));
    const body =
      typeof parsed.body === "string" ? JSON.parse(parsed.body) : parsed.body;

    return res.status(parsed.statusCode || 200).json(body ?? {});
  } catch (error) {
    console.error("Lambda invoke error:", error);
    return res
      .status(500)
      .json({ error: "Failed to delete face from Lambda", details: error.message });
  }
};

export {
  getFacesByCollection,
  get_face_recognition_table1_data,
  deleteFaceFromCollection,
};









// import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

// // Initialize Lambda client (v3)
// const lambdaClient = new LambdaClient({
//   region: process.env.AWS_REGION || "ap-south-1",
// });

// const LAMBDA_FUNCTION_NAME =
//   process.env.FACES_LAMBDA_NAME || "your-lambda-function-name";

// // Controller 1: Get faces by collection (basic)
// const getFacesByCollection = async (req, res) => {
//   const { collectionId } = req.query;

//   if (!collectionId) {
//     return res.status(400).json({ error: "Missing collectionId" });
//   }

//   const payload = {
//     queryStringParameters: { collectionId },
//   };

//   try {
//     const command = new InvokeCommand({
//       FunctionName: LAMBDA_FUNCTION_NAME,
//       Payload: Buffer.from(JSON.stringify(payload)),
//     });

//     const response = await lambdaClient.send(command);

//     // Parse Lambda payload
//     const parsed = JSON.parse(new TextDecoder("utf-8").decode(response.Payload));
//     const body =
//       typeof parsed.body === "string" ? JSON.parse(parsed.body) : parsed.body;

//     return res.status(parsed.statusCode || 200).json(body ?? {});
//   } catch (error) {
//     console.error("Lambda invoke error:", error);
//     return res
//       .status(500)
//       .json({ error: "Failed to fetch faces from Lambda" });
//   }
// };

// // Controller 2: Paginated fetch from DynamoDB via Lambda
// const get_face_recognition_table1_data = async (req, res) => {
//   try {
//     const { collectionId, limit = 20, lastKey } = req.query;

//     if (!collectionId) {
//       return res.status(400).json({ error: "collectionId is required" });
//     }

//     const payload = {
//       queryStringParameters: {
//         collectionId,
//         limit,
//         lastKey,
//       },
//     };


    
//     const command = new InvokeCommand({
//       FunctionName:
//         process.env.FACES_TABLE1_LAMBDA_NAME ||
//         "AuraCheck_get_items_from_face_recognition_table1",
//       Payload: Buffer.from(JSON.stringify(payload)),
//     });

//     const response = await lambdaClient.send(command);

//     const result = JSON.parse(
//       new TextDecoder("utf-8").decode(response.Payload)
//     );

//     if (result.statusCode !== 200) {
//       return res.status(result.statusCode).json(JSON.parse(result.body));
//     }

//     return res.json(JSON.parse(result.body));
//   } catch (err) {
//     console.error("Error invoking Lambda:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// export { getFacesByCollection, get_face_recognition_table1_data };





