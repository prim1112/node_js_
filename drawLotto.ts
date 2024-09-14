import express, { Request, Response } from 'express';
import mysql from 'mysql';
import { promisify } from 'util';
import { conn } from './dbconnect';

// ใช้ promisify เพื่อใช้ query ในรูปแบบ async/await
// const query = promisify(conn.query).bind(conn);

// const router = express.Router();

// // ฟังก์ชันสำหรับการสุ่มออกรางวัล Lotto
// const drawLottoPrizes = async (conn: mysql.Pool, fromSoldOnly: boolean): Promise<{ lottery_num: string, prize: number }[]> => {
//     try {
//         console.log('เริ่มการสุ่มออกรางวัล Lotto...');
//         console.log('เงื่อนไข fromSoldOnly:', fromSoldOnly);

//         const prizeAmounts = [10000000, 5000000, 1000000, 500000, 100000];
//         const condition = fromSoldOnly ? 'WHERE status = "sold"' : '';
//         const sql = `SELECT lottery_num FROM lottery_number ${condition} ORDER BY RAND() LIMIT 5`;

//         console.log('SQL Query:', sql);

//         // รัน Query
//         const [rows] = await conn.query(sql) as [mysql.RowDataPacket[], any];

//         console.log('ผลลัพธ์จากฐานข้อมูล:', rows);

//         // ตรวจสอบว่าผลลัพธ์ที่ได้เป็น array และมีจำนวนรายการที่เพียงพอ
//         if (!Array.isArray(rows)) {
//             throw new Error('ผลลัพธ์จากฐานข้อมูลไม่ใช่ array');
//         }
//         if (rows.length < 5) {
//             throw new Error('จำนวนล็อตเตอรี่ไม่เพียงพอสำหรับการออกรางวัล');
//         }

//         return rows.map((row: mysql.RowDataPacket, index: number) => ({
//             lottery_num: row.lottery_num as string,
//             prize: prizeAmounts[index]
//         }));
//     } catch (error) {
//         console.error('เกิดข้อผิดพลาดในการสุ่มออกรางวัล Lotto:', error);
//         throw new Error('เกิดข้อผิดพลาดในการสุ่มออกรางวัล Lotto: ' + (error instanceof Error ? error.message : JSON.stringify(error)));
//     }
// };

// // Route สำหรับการสุ่มออกรางวัล Lotto
// router.post('/draw-lotto', async (req: Request, res: Response) => {
//     try {
//         const { fromSoldOnly } = req.body;
//         console.log('พารามิเตอร์จาก body:', fromSoldOnly);

//         const prizeResults = await drawLottoPrizes(conn, fromSoldOnly);

//         console.log('ผลลัพธ์การสุ่มรางวัล:', prizeResults);
//         res.status(200).json({ message: 'การสุ่มออกรางวัล Lotto สำเร็จ', prizeResults });
//     } catch (error) {
//         console.error('เกิดข้อผิดพลาด:', error);

//         // ส่งข้อผิดพลาดเป็นข้อความ
//         const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
//         res.status(500).json({ error: errorMessage });
//     }
// });

// export { router };
