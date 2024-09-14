import express from "express";
import { conn } from "./dbconnect";
export const router = express.Router();



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


// API สำหรับซื้อ Lotto
// router.post('/lotto/purchase', async (req, res) => {
//     const { customerId, lottoIds }: { customerId: number, lottoIds: number[] } = req.body;

//     if (!Array.isArray(lottoIds) || lottoIds.length === 0) {
//         return res.status(400).json({ message: 'Invalid Lotto IDs' });
//     }

//     try {
//         // ตรวจสอบยอดเงินในบัญชี
//         const [customerRows] = await conn.query('SELECT amount FROM customers WHERE customer_id = ?', [customerId]);

//         if (customerRows.length === 0) {
//             return res.status(404).json({ message: 'Customer not found' });
//         }

//         const customer = customerRows[0] as { amount: number };
//         let totalPrice = 0;

//         // คำนวณราคา Lotto ทั้งหมด
//         for (const lottoId of lottoIds) {
//             const [lottoRows] = await conn.query('SELECT price FROM lottery_number WHERE lottery_id = ? AND status = "available"', [lottoId]);

//             if (lottoRows.length === 0) {
//                 return res.status(404).json({ message: `Lotto ID ${lottoId} not available` });
//             }

//             const lotto = lottoRows[0] as { price: number };
//             totalPrice += lotto.price;
//         }

//         // ตรวจสอบว่าเงินในบัญชีเพียงพอ
//         if (customer.amount < totalPrice) {
//             return res.status(400).json({ message: 'Insufficient funds' });
//         }

//         // ลดยอดเงินในบัญชี
//         await conn.query('UPDATE customers SET amount = amount - ? WHERE customer_id = ?', [totalPrice, customerId]);

//         // อัปเดตสถานะของ Lotto และบันทึกการซื้อ
//         for (const lottoId of lottoIds) {
//             await conn.query('UPDATE lottery_number SET status = "sold" WHERE lottery_id = ?', [lottoId]);
//             await conn.query('INSERT INTO orders (customer_id, lottery_id, total) VALUES (?, ?, ?)', [customerId, lottoId, totalPrice / lottoIds.length]);
//             await conn.query('INSERT INTO checklotto (lottery_id, status) VALUES (?, ?)', [lottoId, 'not won']);
//         }

//         res.status(200).json({ message: 'Purchase successful' });
//     } catch (error) {
//         console.error('An error occurred:', error);
//         res.status(500).json({ message: 'An error occurred', error });
//     }
// });