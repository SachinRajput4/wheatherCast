
import { LambdaClient } from "@aws-sdk/client-lambda";

const REGION = process.env.AWS_REGION || "ap-south-1";

const lambdaClient = new LambdaClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,     
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
  },
});

export { lambdaClient };
