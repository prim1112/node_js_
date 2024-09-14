import express from "express";
import { conn } from "./dbconnect";
import mysql from "mysql";
import bodyParser from "body-parser";
import cors from "cors";
export const app = express();
import { router as customer } from "./default";
// import { router as lotto } from "./lotto";
import { router as createlotto } from "./createlotto";
import { router as lotto } from "./lotto";
import { router as orders } from "./orders";
import { router as lottorandom } from "./lottorandom";
import { router as reset} from "./reset";
import { router as check} from "./check";
//import { router as drawLotto} from "./drawLott

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
app.use("/get", customer);
app.use("/lotto", lotto);
app.use("/orders", orders);
app.use("/create", createlotto);
app.use("/random", lottorandom);
app.use("/reset", reset);
app.use("/check", check);

app.use("/", (req, res) => {
  res.send("Test!!!");
});