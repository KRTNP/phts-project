import { RowDataPacket } from 'mysql2/promise';
import pool from '../config/database.js';
import { calculateMonthly, checkLicense, savePayout } from './payroll/calculator.js';
import { calculateRetroactive } from './payroll/retroactive.js';
import { calculateDeductions } from './payroll/deductions.js';

/**
 * Batch calculation for all active employees with active eligibility.
 */
async function calculateBatch(year: number, month: number) {
  const [employees] = await pool.query<RowDataPacket[]>(
    `SELECT DISTINCT e.citizen_id
     FROM pts_employee_eligibility e
     JOIN users u ON e.citizen_id = u.citizen_id
     WHERE e.is_active = 1 AND u.is_active = 1`,
  );

  const results = {
    total: employees.length,
    success: 0,
    failed: 0,
    errors: [] as { citizen_id: string; error: string }[],
  };

  for (const emp of employees as any[]) {
    try {
      await calculateMonthly(emp.citizen_id, year, month);
      results.success += 1;
    } catch (err: any) {
      results.failed += 1;
      results.errors.push({
        citizen_id: emp.citizen_id,
        error: err?.message ?? String(err),
      });
    }
  }

  return results;
}

// Facade to keep existing import style in controllers
export const payrollService = {
  calculateMonthly,
  calculateRetroactive,
  calculateDeductions,
  checkLicense,
  savePayout,
  calculateBatch,
};

// Re-export types for consumers that imported from the old location
export type { CalculationResult, RetroDetail } from './payroll/calculator.js';
