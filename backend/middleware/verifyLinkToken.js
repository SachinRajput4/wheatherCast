import jwt from "jsonwebtoken";

 const verifyLinkToken = async (req, res) => {
  const { token, CollectionId } = req.query;

  if (!token || !CollectionId) {
    return res.status(400).json({ message: "Missing token or CollectionId" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.CollectionId !== CollectionId) {
      return res.status(403).json({ message: "Token does not match collection" });
    }

    return res.status(200).json({ message: "Token verified", valid: true });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export default verifyLinkToken;



// import jwt from "jsonwebtoken";

// const verifyLinkToken = (req, res, next) => {
//   const token = req.query.token || req.headers.authorization?.split(" ")[1];
//   const { CollectionId } = req.params;

//   if (!token) {
//     return res.status(401).json({ message: "Token missing" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.CollectionId !== CollectionId) {
//       return res.status(403).json({ message: "Invalid collection for this token" });
//     }

//     req.CollectionId = decoded.CollectionId;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Token expired or invalid" });
//   }
// };

// export default verifyLinkToken;
