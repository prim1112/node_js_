import express from "express";
import { conn } from "./dbconnect";
export const router = express.Router();

// ฟังก์ชันสำหรับสร้างเลข 6 หลักแบบสุ่ม
const generateRandomNumber = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ฟังก์ชันสำหรับสร้างเลข 6 หลักที่ไม่ซ้ำกันจำนวน 100 หมายเลข
const generateUniqueNumbers = (count: number): string[] => {
    const uniqueNumbers = new Set<string>();

    while (uniqueNumbers.size < count) {
        const randomNumber = generateRandomNumber();
        uniqueNumbers.add(randomNumber);
    }

    return Array.from(uniqueNumbers);
};

// POST route สำหรับการสร้างเลข 6 หลักที่ไม่ซ้ำกัน 100 หมายเลข และบันทึกลงฐานข้อมูล
router.post('/generate-lotto', async (req, res) => {
    try {
        const lotteryNumbers = generateUniqueNumbers(100);
        const sql = "INSERT INTO lottery_number (lottery_id, customer_id, lottery_num, status, odate, price) VALUES (NULL, NULL, ?, 'available', NOW(), 100)";

        // ใช้ Promise.all เพื่อลงข้อมูลทั้งหมดในฐานข้อมูล
        await Promise.all(lotteryNumbers.map(num => {
            return new Promise<void>((resolve, reject) => {
                conn.query(sql, [num], (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        }));

        // ส่งข้อมูลตอบกลับหลังจากบันทึกเสร็จ
        res.status(200).json({ message: 'เลขล็อตโต้ถูกสร้างและบันทึกลงฐานข้อมูลเรียบร้อยแล้ว!', lotteryNumbers });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการบันทึกเลขล็อตโต้:', error);
        // ตรวจสอบว่า response ถูกส่งไปแล้วหรือยัง
        if (!res.headersSent) {
            res.status(500).json({ error: 'การบันทึกเลขล็อตโต้ล้มเหลว' });
        }
    }
});


router.get("/generate-lotto", (req, res) => {
    const sql = "SELECT * FROM lottery_number";
    conn.query(sql, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});