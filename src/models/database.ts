import { Sequelize } from "sequelize";


export const sequelize = new Sequelize({
  dialect: "mysql", 
  host: "localhost",
  username: "root",
  password: "Saurabh@123", 
  database: "qp_assessment", 
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
