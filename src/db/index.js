import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`) // Connect to MongoDB using the URL from environment variables
        console.log(`Connected to MongoDB at ${connect.connection.host}:${connect.connection.port}/${DB_NAME}`); // Log successful connection
        
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`); // Log connection error
        process.exit(1) // Re-throw the error to stop the app
    }
}

 
export default connectDB; // Export the connectDB function for use in other files
