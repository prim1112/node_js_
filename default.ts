import express from "express";
import { conn } from "./dbconnect";
export const router = express.Router();

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

router.get("/lottery_numbers", (req, res) => {
    const sql = "SELECT * FROM lottery_number";
    conn.query(sql, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

router.get("/orders", (req, res) => {
    const sql = "SELECT * FROM orders";
    conn.query(sql, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

// สมัครสมาชิก ได้แล้ว
// router.post("/register", (req, res) => {
//     console.log("test");
//     const status = "customer";
//     const { username, password, email, amount } = req.body;
//     const sql = "INSERT INTO customers (username, password, email, status, amount) VALUES (?, ?, ?, ?, ?)";
//     conn.query(sql, [username, password, email, status, amount], (err, result) => {
//         if (err) res.status(500).json(err);
//         else res.status(201).json({ message: "Registered successfully", id: result.insertId });
//     });
// });

// สมัครสมาชิก พร้อมตรวจสอบว่า email ซ้ำหรือไม่
router.post("/register", (req, res) => {
    const status = "customer";
    const { username, password, email, amount } = req.body;

    // ตรวจสอบว่า email ซ้ำหรือไม่
    const checkEmailSql = "SELECT * FROM customers WHERE email = ?";
    conn.query(checkEmailSql, [email], (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else if (result.length > 0) {
            // ถ้า email ซ้ำ
            res.status(400).json({ error: "Email already exists" });
        } else {
            // ถ้า email ไม่ซ้ำ ทำการสมัครสมาชิก
            const registerSql = "INSERT INTO customers (username, password, email, status, amount) VALUES (?, ?, ?, ?, ?)";
            conn.query(registerSql, [username, password, email, status, amount], (err, result) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.status(201).json({ message: "Registered successfully", id: result.insertId });
                }
            });
        }
    });
});


// เข้าสู่ระบบ ได้แล้ว
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

// แก้ไขข้อมูลสมาชิก ได้แล้ว
router.put("/customer/:customer_id", (req, res) => {
    const { customer_id } = req.params;
    const { username, email, password } = req.body;
    const sql = "UPDATE customers SET username = ?, email = ?, password = ? WHERE customer_id = ?";
    conn.query(sql, [username, email, password, customer_id ], (err, result) => {
        if (err) res.status(500).json(err);
        else res.status(201).json({ message: "User updated successfully" });
    });
});

router.get("/customer/:customer_id/amount", (req, res) => {
    const { customer_id } = req.params;
    const sql = "SELECT amount FROM customers WHERE customer_id = ?";
    conn.query(sql, [customer_id], (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else if (result.length === 0) {
            res.status(404).json({ error: "Customer not found" });
        } else {
            res.status(200).json({ amount: result[0].amount });
        }
    });
});


  






