import express, { Express, Request, Response } from "express";
import "reflect-metadata";
import dotenv from "dotenv";
import swagger from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import morgan from "morgan";

import { AppDataSource } from './datasource';
import userRoutes from './routes/userRoutes';

AppDataSource.initialize()
  .then(() => {
      // here you can start to work with your database
      console.log("Database is connected")
  })
  .catch((error) => console.log(error))

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
    },

  },
  apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(options);




const app: Express = express();

app.use(express.json());
app.use(morgan("dev"));
const port = process.env.PORT || 3000;
app.use("/api-docs", swagger.serve, swagger.setup(swaggerSpec));
app.use("/api/", userRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);

});

//TODO : Authorization, Authentication ,CRUD of users,One to one relation ship with users
