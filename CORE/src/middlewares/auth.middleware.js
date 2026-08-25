import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asycnHandler } from "../utils/asycnHandler.js";
import jwt from "jsonwebtoken"
// import { jsonwebtoken as jwt } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env" // Load environment variables from .env file
}); // Load environment variables from .env file

  
export const verifyJWT = asycnHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        if (!token) {
            throw new ApiError(401, "Unauthorised request")
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if (!decodedToken?._id) {
            console.log("Decoded token does not contain user ID");
        }
 
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
     
     if (!user) {
         //Todo : frontend about discuss
         throw new ApiError(401, "User does not exist")
        }
 
        req.user = user;
     next()
   } catch (error) {
        throw new ApiError(401, error.message || "Invalid access token" )
   }

})