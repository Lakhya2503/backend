import mongoose from "mongoose";
import  jwt  from "jsonwebtoken";
import bcrypt from 'bcrypt'

import dotenv from "dotenv";

dotenv.config({
    path: "./.env" // Load environment variables from .env file
}); // Load environment variables from .env file


// import { JsonWebTokenError } from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trime: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //cloudanery url
        required: true
    },
    coverImage: {
        type: String,
        required:true
    },
    watchHistory: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
    },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        refreshToken: {
            type: String
    }
        

}, { timestamps: true })

//password encrypt
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

     this.password = await bcrypt.hash(this.password, 10)
    next()
})

//password check
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

// console.log("process.env.ACCESS_TOKEN_SECRET", process.env.ACCESS_TOKEN_SECRET);


userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname : this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECREAT,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)