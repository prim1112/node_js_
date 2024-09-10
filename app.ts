import express from "express";
import { conn } from "./dbconnect";
import mysql from "mysql";
import bodyParser from "body-parser";
import cors from "cors";
export const app = express();
import { router as customer } from "./default";

app.use(
    cors({
        origin: "*",
    })
);

app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/get", customer);

app.use("/", (req, res) => {
  res.send("Test!!!");
});