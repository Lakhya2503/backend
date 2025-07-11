import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asycnHandler } from "../utils/asycnHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asycnHandler(async (req, res, next) => {
   try {
     const token =  req.cookies?.accessToken || req.header(
         "Authorization"
     )?.replace("Bearer ", "")
     
     if (!token) {
         throw new ApiError(401, "Access token is required")
     }
 
       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
       
 
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