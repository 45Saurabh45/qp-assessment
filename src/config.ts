require('dotenv').config()
export const port = process.env.NODE_APP_PORT || 3000;
export const JWT_SECRET = process.env.NODE_APP_JWT_SECRET || "your-secret-key";