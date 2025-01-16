import dotenv from 'dotenv';
dotenv.config();

export const SECRET_KEY = process.env.SECRET_KEY;
export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT || 5004;
export const CLIENT_URL = process.env.CLIENT_URL;