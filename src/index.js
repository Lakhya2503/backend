import mongoose, { connect } from "mongoose";
// import { DB_NAME } from "./constants.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env" // Load environment variables from .env file
}); // Load environment variables from .env file


connectDB()// Call the connectDB function to establish a connection to MongoDB
    .then(() => {
        app.listen(process.env.PORT || 8000, (() => {
            console.log("Server runing at port:  "+ process.env.PORT );
        }))
    })
    .catch((error) => {
        console.log(`mongodb connection failed ${error.message}`);
        
    })


/*
(async () => { // async IIFE to handle async/await
    // Load environment variables from .env file
    try {
        await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`) //connect to MongoDB 
        console.log(`Connected to MongoDB at ${process.env.DB_URL}/${DB_NAME}`);
        app.on("error", (error) => {    // Handle errors in the app
            // Log the error message
            console.log(`Error in app: ${error.message}`);
            throw error;
        })

        app.listen(process.env.PORT, () => { // Start the server
            console.log(`app is listing in port ${process.env.PORT}`); // Log server start
        });

    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`);   // Log connection error
        throw error ; // Re-throw the error to stop the app
    }
})()
*/