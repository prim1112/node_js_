import express, { Request, Response } from 'express';
import { queryPromise } from './dbconnect';

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

// ฟังก์ชันรีเซ็ตระบบ
const resetSystem = async (req: Request, res: Response) => {
    try {
        // เริ่มต้นการทำงานในทรานแซคชัน
        await queryPromise('START TRANSACTION');

        // 1. ลบ Lotto ที่สามารถซื้อได้ทั้งหมด
        await queryPromise('DELETE FROM lottery_number WHERE customer_id IS NULL');
        
        // 2. ลบ Lotto รางวัลทั้งหมด
        await queryPromise('DELETE FROM lottery_number WHERE status = "won"');

        // 3. ลบข้อมูลบัญชี user ทั้งหมด ยกเว้น admin
        await queryPromise('DELETE FROM customers WHERE status != "admin"');

        // 4. ลบ Lotto ของผู้ใช้ทั้งหมด
        await queryPromise('DELETE FROM orders');
        await queryPromise('UPDATE lottery_number SET customer_id = NULL WHERE customer_id IS NOT NULL');

        // 5. สร้างเลขล็อตโต้ใหม่ที่ไม่ซ้ำกัน 100 หมายเลข
        const lotteryNumbers = generateUniqueNumbers(100);

        // สร้าง array ของข้อมูลที่ต้องการบันทึก
        const values = lotteryNumbers.map(num => [null, null, num, 'available', new Date(), 100]);

        // // บันทึกเลขล็อตโต้ใหม่ลงฐานข้อมูล
        // await queryPromise('INSERT INTO lottery_number (lottery_id, customer_id, lottery_num, status, odate, price) VALUES ?', [values]);

        // คอมมิทการทำงานทั้งหมดในทรานแซคชัน
        await queryPromise('COMMIT');

        res.status(200).json({ message: 'ระบบถูกรีเซ็ตและเลขล็อตโต้ใหม่ถูกสร้างเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('Error resetting system:', error);
        // ตรวจสอบว่า response ถูกส่งไปแล้วหรือยัง
        if (!res.headersSent) {
            // ทำการยกเลิกการทำงานในทรานแซคชัน (ROLLBACK)
            await queryPromise('ROLLBACK');
            res.status(500).json({ error: 'เกิดข้อผิดพลาดในการรีเซ็ตระบบ' });
        }
    }
};

// กำหนดเส้นทางสำหรับการรีเซ็ตระบบ
router.post('/reset', resetSystem);
