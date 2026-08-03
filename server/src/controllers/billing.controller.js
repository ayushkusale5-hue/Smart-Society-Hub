import { Bill } from '../models/mongo/Bill.js';
import { getSQLiteDB } from '../config/db.sqlite.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';


export async function generateBulkBills(req, res, next) {
  try {
    const { month, amount, dueDate } = req.body;

    if (!month || !amount || !dueDate) {
      return errorResponse(res, 'Month, amount, and due date are required', 400);
    }

    
    const db = getSQLiteDB();
    const residents = db.prepare(`
      SELECT u.id 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE r.name = 'resident' AND u.is_active = 1
    `).all();

    if (residents.length === 0) {
      return errorResponse(res, 'No active residents found to bill', 404);
    }

    const billsToInsert = residents.map((r) => ({
      residentId: r.id,
      month,
      amount,
      dueDate: new Date(dueDate),
      status: 'Pending',
      type: 'Maintenance',
    }));

    
    try {
      await Bill.insertMany(billsToInsert, { ordered: false });
    } catch (err) {
      
      if (err.code !== 11000) {
        throw err;
      }
    }

    return successResponse(res, null, `Maintenance bills for ${month} generated successfully`);
  } catch (err) {
    next(err);
  }
}


export async function getBills(req, res, next) {
  try {
    const { status, month } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (month) filter.month = month;

    if (req.user.role === 'resident') {
      filter.residentId = req.user.id;
    }

    const bills = await Bill.find(filter).sort({ createdAt: -1 });

    
    if (req.user.role === 'committee') {
      const enrichedBills = bills.map((bill) => {
        const db = getSQLiteDB();
        const user = db.prepare('SELECT first_name, last_name, flat_number, tower FROM users WHERE id = ?').get(bill.residentId);
        return {
          ...bill.toObject(),
          resident: user || { first_name: 'Unknown', last_name: 'User' }
        };
      });
      return successResponse(res, enrichedBills);
    }

    return successResponse(res, bills);
  } catch (err) {
    next(err);
  }
}


export async function payBill(req, res, next) {
  try {
    const { id } = req.params;
    const { transactionId } = req.body;

    const bill = await Bill.findById(id);
    if (!bill) return errorResponse(res, 'Bill not found', 404);

    if (bill.residentId !== req.user.id) {
      return errorResponse(res, 'Unauthorized to pay this bill', 403);
    }

    if (bill.status === 'Paid') {
      return errorResponse(res, 'Bill is already paid', 400);
    }

    bill.status = 'Paid';
    bill.paidAt = new Date();
    bill.transactionId = transactionId || `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    await bill.save();

    return successResponse(res, null, 'Payment recorded successfully');
  } catch (err) {
    next(err);
  }
}


export async function deleteBill(req, res, next) {
  try {
    const db = getSQLiteDB();
    const billId = req.params.id;

    const bill = db.prepare('SELECT * FROM bills WHERE id = ?').get(billId);
    if (!bill) return errorResponse(res, 'Bill not found', 404);

    if (bill.status === 'paid') {
      return errorResponse(res, 'Cannot delete a paid bill', 400);
    }

    db.prepare('DELETE FROM bills WHERE id = ?').run(billId);
    return successResponse(res, null, 'Bill deleted successfully');
  } catch (err) {
    next(err);
  }
}
