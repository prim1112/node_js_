import express from "express";
import { conn } from "./dbconnect";
import mysql from "mysql";
import bodyParser from "body-parser";
import cors from "cors";
export const app = express();
import { router as customer } from "./default";
// import { router as lotto } from "./lotto";
import { router as createlotto } from "./createlotto";
app.use(
    cors({
        origin: "*",
    })
);

app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/customer", customer);
app.use("/create", createlotto);
// app.use("/lotto", lotto);

app.use("/", (req, res) => {
  res.send("Test!!!");
});