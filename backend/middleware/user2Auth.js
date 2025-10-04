import jwt from "jsonwebtoken";

const user2AuthMiddleware = async (req, res, next) => {
    const user2Token = req.headers.usertoken;
    console.log("user2Token", user2Token);

    if (!user2Token) {
      return res.json({ success: false, message: "Not Authorized user Login Again" });
    }
    try {
      const user2Token_decode = jwt.verify(user2Token, process.env.JWT_SECRET);
      req.user2Id = user2Token_decode.id;
      next();
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error in user2AuthMiddleware" });
    }
  };
  export default user2AuthMiddleware;
