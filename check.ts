import express, { Request, Response } from "express";
import { queryPromise } from "./dbconnect";
export const router = express.Router();


// // API สำหรับดูสถานะ Lotto ของลูกค้า
// router.get('/customer/:customer_id', getCustomerLottoStatus);

// // API สำหรับอัพเดตสถานะ Lotto
// router.put('/update-status', updateLottoStatus);

// // API สำหรับดึงข้อมูลสถานะ Lotto ของลูกค้า
// export const getCustomerLottoStatus = async (req: Request, res: Response) => {
//     const { customer_id } = req.params;

//     try {
//         const result = await pool.query('SELECT * FROM check WHERE customer_id = $1', [customer_id]);
//         res.status(200).json(result.rows);
//     } catch (error) {
//         res.status(500).json({ message: 'Internal Server Error', error });
//     }
// };

// // API สำหรับอัพเดตสถานะ Lotto ว่าถูกรางวัลหรือไม่
// export const updateLottoStatus = async (req: Request, res: Response) => {
//     const { customer_id, lottery_id, status } = req.body;

//     try {
//         await pool.query('INSERT INTO check (customer_id, lottery_id, status) VALUES ($1, $2, $3) ON CONFLICT (customer_id, lottery_id) DO UPDATE SET status = $3', [customer_id, lottery_id, status]);
//         res.status(200).json({ message: 'Lotto status updated successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Internal Server Error', error });
//     }
// };