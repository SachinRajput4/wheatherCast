import jwt from "jsonwebtoken";

const user1AuthMiddleware = async (req, res, next) => {
    const user1Token = req.headers.user1token;

    if (!user1Token) {
      return res.json({ success: false, message: "Not Authorized user1 Login Again" });
    }
    try {
      const user1Token_decode = jwt.verify(user1Token, process.env.JWT_SECRET);
      req.user1Id = user1Token_decode.id;

      next();
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error in user1AuthMiddleware" });
    }
  };
  export default user1AuthMiddleware;
