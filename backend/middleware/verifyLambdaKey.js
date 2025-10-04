// middlewares/verifyLambdaKey.js
export const verifyLambdaKey = (req, res, next) => {
  const lambdaKey = req.headers["x-api-key"];

  if (!lambdaKey || lambdaKey !== process.env.LAMBDA_API_KEY) {
    return res.status(403).json({ success: false, message: "Forbidden: Invalid API key" });
  }

  next();
};
