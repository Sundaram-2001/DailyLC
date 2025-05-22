import express from "express";
import bodyParser from "body-parser";
import routes from "./routes/routes.js";
import './scheduler.js'
import cors from "cors";

const app = express();


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


app.use("/data", routes);

app.listen(3000, () => {
  console.log("listening on 3k..");
});
