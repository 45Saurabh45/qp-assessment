import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();
const host = process.env.DB_HOST || "localhost";
const username = process.env.DB_USERNAME || "root";
const password = process.env.DB_PASSWORD || "Saurabh@123";
const database = process.env.DB_NAME || "qp_assessment";
export const sequelize = new Sequelize({
  dialect:"mysql", 
  host: host,
  username: username,
  password: password,
  database: database,
  logging: false, 
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection successful.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
