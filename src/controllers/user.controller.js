import { asycnHandler } from '../utils/asycnHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from "jsonwebtoken"

const genrateAccessAndRefreshTokens = async (userId) =>{
    try {
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        user.refreshToken = refreshToken
        await  user.save({ validateBeforSave: false })

        return {
            accessToken,
            refreshToken
        }

    } catch (error) {
        throw new ApiError(500, "Internal server error")
    }
}

const registerUser = asycnHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists : username, email
    // check for images
    // check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field frome response
    // check for user creation
    // return res

    

    const { fullname, email, username, password } = req.body
    
    if (
        [fullname,email,username,password].some((field)=>field?.trim() === "") // check if any field is empty
    ) {
            throw new ApiError (400, "All fields are required")
    }

    const existsUser = await User.findOne({
        $or: [ { username }, { email } ]
    })

    if (existsUser) {
        throw new ApiError(409, "User already exists with this username or email")
    }
    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log(avatarLocalPath);
    
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // console.log(req.files);
    // console.log(`42 ${process.env.CLOUDINARY_CLOUD_NAME}`);
    
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    // console.log(uploadOnCloudinary);
    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    console.log("52 avatar",avatar);
    console.log("53 coverimage" ,coverImage.url);
    
    if (!avatar) {
        throw new ApiError(400, "Avatar is required 51")
    }
    

   const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
   })
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    if (!createdUser) {
        throw new ApiError(500, "User creation failed")
    }

    return res.status(201).json(
        new ApiResponse(
            200,
            createdUser,
            "User created successfully"
        )
    )  
})

const loginUser = asycnHandler(async (req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token genrate
    // send cookie
    
    const { email, username, password } = req.body
    
    if (!(username || email)) {
         throw new ApiError(400,"username and email is required")
    }

    const user = await User.findOne({
        $or: [{ username } , { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if (!isPasswordValid) {
        throw new ApiError(404, "Password incorrect")
    }

    const { accessToken, refreshToken } = await genrateAccessAndRefreshTokens(user._id) // generate tokens
    
    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken")
    console.log("loggedInUser", loggedInUser);
    

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user : loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        )
}) 

const logoutUser = asycnHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, {
        $set: {
            refreshToken: undefined
        }
    },
        {
            new: true
        },
        
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asycnHandler( async (req,res) => {
    const incomingRefreshToken = req.coockie.refreshToken || req.body.refreshToken
    
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized reuest")
    }

   try {
     const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.ACCESS_TOKEN_SECRET
     )
 
     const user = await User.findById(decodedToken?._id)
 
     if (!user) {
         throw new ApiError(401, "Invalid Refresh Token")
     }
 
     if (incomingRefreshToken !== user._id.refreshAccessToken) {
         throw new ApiError(401, "Refresh token is expired or used")
     }
 
     const options = {
         httpOnly: true,
         secure : true
     }
 
     const { accessToken, newRefreshToken } = await genrateAccessAndRefreshTokens(user._id)
 
     return res
         .status(200)
         .coockie("accessToken", accessToken , options)
         .coockie("refreshToken", newRefreshToken , options)
         .json(
             new ApiResponse(
                 200,
                 {
                     accessToken,
                     newRefreshToken
                 },
                 "Access token refreshed"
             )
         )
   } catch (error) {
    throw new ApiError(401, error.message || "Invalid access token")
   }

})

const changeCurrentPassword = asycnHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    
    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(401, "user not found")
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password change Sccessfully"))
})

const getCurrentUser = asycnHandler(async (req, res) => {
    return res.
        status(200).
        json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

const updateAccountDetails = asycnHandler(async (req, res) => {
    const { fullname, email } = req.body

    if (!(fullname || email)) {
        throw new ApiError(400 , "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email
            }
        },
        { new : true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details update successfully"))
})

const updateUserAvatar = asycnHandler(async(req, res)=> {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar) {
        throw new ApiError(400, " Error while uploading on avatar ")
    }

    const user = await User
        .findByIdAndUpdate(req.user?._id, {
            $set : {
            avatar : avatar.url
            }
        }, { new: true })
        .select("-password")
    
    return res.status(200).json(new ApiResponse(200,user,"avatar update Successfully"))
})

const updateCoverImage = asycnHandler(async(req, res)=> {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400, "coverImage file missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage) {
        throw new ApiError(400, " Error while uploading on coverImage ")
    }

    const user = await User
        .findByIdAndUpdate(req.user?._id, {
            $set : {
            coverImage : coverImage.url
            }
        }, { new: true })
        .select("-password")
    
     return res.status(200).json(new ApiResponse(200,user,"CoverImage update Successfully"))
    
})


export {
    registerUser,
    loginUser,  
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImage
}