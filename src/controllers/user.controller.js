import { asycnHandler } from '../utils/asycnHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'

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
    console.log(`fullname: ${fullname}, email: ${email}, username: ${username}, password: ${password}`);
    
    if (
        [fullname,email,username,password].some((fileds)=>fileds?.trime() === "") // check if any field is empty
    ) {
            throw ApiError (400, "All fields are required")
    }

    const existsUser = User.findOne({
        $or: [ { username }, { email } ]
    })

    if (existsUser) {
        throw new ApiError(409, "User already exists with this username or email")
    }
    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // console.log(req.files);
    
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    // console.log(avatar);
    // console.log(coverImage);
    
    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
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

export {
    registerUser
}