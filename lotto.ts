import express from "express";
import { conn } from "./dbconnect";
export const router = express.Router();

//ดูได้
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

  // 6. ตรวจสอบรางวัลที่ถูกรางวัล ไม่ได้
router.get("/check-prize/:customer_id", (req, res) => {
    const { customer_id } = req.params;
    const sql = `SELECT * FROM lottery_number 
                 INNER JOIN orders ON lottery_number.id = orders.lottery_id 
                 WHERE orders.customer_id = ?`;
    conn.query(sql, [customer_id], (err, result) => {
        if (err) res.status(500).json(err);
        else res.json(result);  // จะแสดงลอตเตอรี่ทั้งหมดไม่ว่าจะ "ถูก" หรือ "ไม่ถูก"
    });
  });

// 9. ออกผลรางวัล ได้  no funtion
// สร้างฟังก์ชันสำหรับการเผยแพร่ผลรางวัล
router.post('/result', (req, res) => {
    const { winningNumbers }: { winningNumbers?: number[] } = req.body;

    // ตรวจสอบข้อมูลที่ได้รับ
    if (!Array.isArray(winningNumbers) || winningNumbers.length === 0) {
        return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง กรุณาให้ข้อมูลเป็นอาเรย์ที่ไม่ว่างเปล่าของหมายเลขที่ถูกรางวัล' });
    }

    // ตรวจสอบว่าทุกค่าในอาเรย์เป็นตัวเลข
    if (!winningNumbers.every(num => typeof num === 'number')) {
        return res.status(400).json({ message: 'ทุกค่าภายในอาเรย์ winningNumbers ต้องเป็นตัวเลข' });
    }

    // สร้างตัวแทนสำหรับคิวรี
    const placeholders = winningNumbers.map(() => '?').join(',');
    const sql = `UPDATE lottery_number SET status = 'winner' WHERE lottery_num IN (${placeholders})`;

    conn.query(sql, winningNumbers, (err, result) => {
        if (err) {
            console.error('ข้อผิดพลาดในการดำเนินการคิวรี:', err);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดขณะอัปเดตผลรางวัลลอตเตอรี่' });
        }
        res.status(200).json({ message: 'เผยแพร่ผลรางวัลเรียบร้อยแล้ว' });
    });
});


// API เพื่อยืนยันการซื้อ Lotto ได้ error 400 
router.post("/lotto/purchase", (req, res) => {
    const { customer_id, lottery_id } = req.body;

    // Check if the Lotto is available
    const checkLottoSql = "SELECT * FROM lottery_number WHERE lottery_id = ? AND status = 'available'";
    conn.query(checkLottoSql, [lottery_id], (err, lottoResult) => {
        if (err) return res.status(500).json(err);
        if (lottoResult.length === 0) return res.status(400).json({ message: "Lotto นี้ถูกซื้อไปแล้ว" });

        const lottoPrice = lottoResult[0].price;

        // Check if the customer has sufficient balance
        const checkBalanceSql = "SELECT balance FROM customers WHERE customer_id = ?";
        conn.query(checkBalanceSql, [customer_id], (err, customerResult) => {
            if (err) return res.status(500).json(err);
            if (customerResult.length === 0) return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });

            const customerBalance = customerResult[0].balance;
            if (customerBalance < lottoPrice) {
                return res.status(400).json({ message: "เงินในบัญชีไม่เพียงพอ" });
            }

            // Update the customer's balance
            const updateBalanceSql = "UPDATE customers SET balance = balance - ? WHERE customer_id = ?";
            conn.query(updateBalanceSql, [lottoPrice, customer_id], (err, updateResult) => {
                if (err) return res.status(500).json(err);

                // Update the Lotto status to 'sold'
                const updateLottoStatusSql = "UPDATE lottery_number SET status = 'sold', odate = NOW() WHERE lottery_id = ?";
                conn.query(updateLottoStatusSql, [lottery_id], (err, updateLottoResult) => {
                    if (err) return res.status(500).json(err);

                    // Insert a new record in the check table
                    const insertCheckSql = "INSERT INTO check (customer_id, lottery_id, status) VALUES (?, ?, 'not_won')";
                    conn.query(insertCheckSql, [customer_id, lottery_id], (err, insertCheckResult) => {
                        if (err) return res.status(500).json(err);
                        
                        // Insert the order into the orders table
                        const insertOrderSql = "INSERT INTO orders (customer_id, lottery_id, total, status_lotto) VALUES (?, ?, ?, 'sold')";
                        conn.query(insertOrderSql, [customer_id, lottery_id, lottoPrice], (err, insertOrderResult) => {
                            if (err) return res.status(500).json(err);

                            res.json({ message: "การซื้อสำเร็จ", orderId: insertOrderResult.insertId });
                        });
                    });
                });
            });
        });
    });
});



// API เพื่อดึง Lotto ที่ผู้ใช้ซื้อไปแล้ว ทำไม่ได้ งง
router.get("/user/:customer_id/lotto", (req, res) => {
    const { customer_id } = req.params;
    const sql = "SELECT ln.lottery_num, o.total, o.odate FROM orders o JOIN lottery_number ln ON o.lottery_id = ln.lottery_id WHERE o.customer_id = ?";
    conn.query(sql, [customer_id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

//นำ Lotto ที่ถูกรางวัลขึ้นเงิน (update เงินใน Wallet ของผู้ใช้)


//ตรวจสอบ Lotto หลังจากทำการขึ้นเงิน
router.get("/user/:customer_id/lotto", (req, res) => {
    const { customer_id } = req.params;
    
    const sql = `
        SELECT ln.lottery_num, ln.status, ln.price 
        FROM lottery_number ln
        INNER JOIN orders o ON ln.lottery_id = o.lottery_id
        WHERE o.customer_id = ? AND ln.status != 'redeemed'
    `;
    
    conn.query(sql, [customer_id], (err, result) => {
        if (err) {
            res.status(500).json({ error: "Error retrieving lotto" });
        } else {
            res.status(200).json({ lotto: result });
        }
    });
});


//ตรวจสอบยอดเงินและซื้อ Lotto

// ฟังก์ชันในการจัดการการซื้อ Lotto


//ดึงข้อมูล Lotto Tickets ที่สามารถซื้อได้