import User from "../models/user.model";
import jwt from "jsonwebtoken";

// Middleware to protect routes
 export const  protectRoute = async(req,res,next)=>{
    try {
        const token = req.headers.token;

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = awaitUser.findById(decoded.userId).select("-password")
        if(!user)return res.json({
            success:false , message:"User not found"
        })

        req.user = user;
        next();
    } catch (error) {
        return res.json({success:false , message:error.message});
    }
}
