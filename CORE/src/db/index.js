import mongoose from "mongoose";
import { DB_NAME, DB_URL } from "../constants.js";

const connectDB = async () => {
  try {
    /* Connect to MongoDB using the URL from environment variables  */
    const connect = await mongoose.connect(
      `${DB_URL}/${DB_NAME}`
    );
    console.log(
      `Connected to MongoDB at ${connect.connection.host}:${connect.connection.port}/${DB_NAME}`
    );
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    /* process exit greasfully on mongodb connection have in error otherwise it's continously run and database will crash */
    process.exit(1);
  }
};

export default connectDB;
