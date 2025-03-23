import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  try {
    //get token
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token)
      return res.status(401).json({
        message: "No authentication token, access denied",
      });
    // verity token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find the user
    const user = await User.findById(decoded.userId).select(-password);
    if (!user) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Token is not valid" });
  }
};

export default protectRoute;
