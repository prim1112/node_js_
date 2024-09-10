import express from "express";
import { conn } from "./dbconnect";
export const router = express.Router();

router.get("/all", (req, res) => {
    const sql = "select * from customers";
    conn.query(sql, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  });