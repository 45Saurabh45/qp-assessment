import * as express from "express";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import { sequelize } from "./models/database";
import { port } from "./config";
import router from "./routes"; 

const app = express();

app.use(bodyParser.json());
app.use("/api", router); 

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message });
});


sequelize
  .authenticate()
  .then(async () => {
    console.log("Database connected successfully!");

   
    await sequelize.sync({ alter: true }); 
    console.log("Models synchronized with the database!");

 
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

export default app;
