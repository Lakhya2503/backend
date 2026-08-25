 const DB_NAME = "laxman";
 const DB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017';
 const PORT = process.env.PORT || 8000;
const API_KEY = process.env.API_KEY || 'default_api_key';

 
export {
    DB_NAME,
    DB_URL,
    PORT,
    API_KEY
}