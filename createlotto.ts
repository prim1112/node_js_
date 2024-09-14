import express from "express";
import { conn } from "./dbconnect";

export const router = express.Router();

// ฟังก์ชันสำหรับสร้างเลข 6 หลักแบบสุ่ม
const generateRandomNumber = (): string => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber.toString().padStart(6, '0'); // ให้แน่ใจว่าเป็น 6 หลัก
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
        // สร้างเลขล็อตโต้ที่ไม่ซ้ำกัน 100 หมายเลข
        const lotteryNumbers = generateUniqueNumbers(100);

        // สร้าง array ของข้อมูลที่ต้องการบันทึก
        const values = lotteryNumbers.map(num => [null, null, num, 'available', new Date(), 100]);

        // สร้าง query SQL สำหรับการบันทึกข้อมูลทั้งหมดในคราวเดียว
        const sql = "INSERT INTO lottery_number (lottery_id, customer_id, lottery_num, status, odate, price) VALUES ?";

        // ใช้ query แบบ batch insert เพื่อเพิ่มข้อมูลทั้งหมดในคราวเดียว
        conn.query(sql, [values], (err) => {
            if (err) {
                console.error('เกิดข้อผิดพลาดในการบันทึกเลขล็อตโต้:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'การบันทึกเลขล็อตโต้ล้มเหลว' });
                }
                return;
            }
            res.status(200).json({ message: 'เลขล็อตโต้ถูกสร้างและบันทึกลงฐานข้อมูลเรียบร้อยแล้ว!', lotteryNumbers });
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการบันทึกเลขล็อตโต้:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'การบันทึกเลขล็อตโต้ล้มเหลว' });
        }
    }
});