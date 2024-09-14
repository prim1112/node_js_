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

  router.get("/customers", (req, res) => {
    const sql = "select * from customers";
    conn.query(sql, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
  });
  
  // สมัครสมาชิก ได้แล้ว
  router.post("/register", (req, res) => {
    console.log("test");
    const status = "customer";
    const { username, password, email, amount } = req.body;
    const sql = "INSERT INTO customers (username, password, email, status, amount) VALUES (?, ?, ?, ?, ?)";
    conn.query(sql, [username, password, email, status, amount], (err, result) => {
        if (err) res.status(500).json(err);
        else res.status(201).json({ message: "Registered successfully", id: result.insertId });
    });
  });
  
  // 2. // เข้าสู่ระบบ ได้แล้ว
  router.post("/login", (req, res) => {
    const { username, email, password } = req.body;
    const sql = "SELECT * FROM customers WHERE username = ? AND email = ? AND password = ?";
    conn.query(sql, [username, email, password], (err, result) => {
        if (err || result.length === 0) {
            res.status(401).json({ error: "Invalid credentials" });
        } else {
            res.status(200).json({ message: "Login successful", user: result[0] });
        }
    });
  });
  
  // // 11. ลบสมาชิก
  // router.delete("/user/:customer_id", (req, res) => {
  //     const { customer_id } = req.params;
  //     const sql = "DELETE FROM customers WHERE customer_id = ?";
  //     conn.query(sql, [customer_id], (err, result) => {
  //         if (err) res.status(500).json(err);
  //         else res.status(200).json({ message: "User deleted successfully" });
  //     });
  // });
  
  // 12. แก้ไขข้อมูลสมาชิก ได้แล้ว
  router.put("/customer/:customer_id", (req, res) => {
    const { customer_id } = req.params;
    const { username, email, password } = req.body;
    const sql = "UPDATE customers SET username = ?, email = ?, password = ? WHERE customer_id = ?";
    conn.query(sql, [username, email, password, customer_id ], (err, result) => {
        if (err) res.status(500).json(err);
        else res.status(201).json({ message: "User updated successfully" });
    });
  });
  