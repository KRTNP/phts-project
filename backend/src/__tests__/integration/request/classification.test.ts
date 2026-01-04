import { Pool } from 'mysql2/promise';
import { createTestPool, setupSchema, DB_NAME } from './utils.js';

let pool: Pool;
// Lazy import after DB is ready to ensure it points to the test DB
let findRecommendedRate: (cid: string) => Promise<any>;

beforeAll(async () => {
  process.env.DB_NAME = DB_NAME;
  pool = await createTestPool();
  await setupSchema(pool);

  // Seed master rates
  await pool.query(`
    INSERT INTO pts_master_rates (profession_code, group_no, amount) VALUES 
    ('DOCTOR', 1, 5000), ('DOCTOR', 2, 10000), ('DOCTOR', 3, 15000),
    ('NURSE', 1, 1500), ('NURSE', 2, 3500), ('NURSE', 3, 5000),
    ('DENTIST', 2, 7500);
  `);

  // Dynamic import after setting env/DB
  ({ findRecommendedRate } = await import('../../../services/classificationService.js'));
});

afterAll(async () => {
  if (pool) await pool.end();
});

describe('Classification Logic', () => {
  test('Doctor Specialist -> Group 2 (10,000)', async () => {
    const cid = 'DOC_SPEC';
    await pool.query(
      `
      INSERT INTO pts_employees (citizen_id, position_name, specialist)
      VALUES (?, 'นายแพทย์ชำนาญการ', 'เวชปฏิบัติทั่วไป')
    `,
      [cid],
    );

    const rate = await findRecommendedRate(cid);
    expect(rate).toBeDefined();
    expect(rate?.profession_code).toBe('DOCTOR');
    expect(rate?.group_no).toBe(2);
    expect(Number(rate?.amount)).toBe(10000);
  });

  test('Nurse in ICU -> Group 3 (5,000)', async () => {
    const cid = 'NURSE_ICU';
    await pool.query(
      `
      INSERT INTO pts_employees (citizen_id, position_name, sub_department)
      VALUES (?, 'พยาบาลวิชาชีพชำนาญการ', 'หอผู้ป่วยวิกฤต (ICU)')
    `,
      [cid],
    );

    const rate = await findRecommendedRate(cid);
    expect(rate).toBeDefined();
    expect(rate?.profession_code).toBe('NURSE');
    expect(rate?.group_no).toBe(3);
    expect(Number(rate?.amount)).toBe(5000);
  });

  test('Dentist General -> Group 2 (7,500)', async () => {
    const cid = 'DENT_GEN';
    await pool.query(
      `
      INSERT INTO pts_employees (citizen_id, position_name, expert)
      VALUES (?, 'ทันตแพทย์ปฏิบัติการ', 'ทั่วไป')
    `,
      [cid],
    );

    const rate = await findRecommendedRate(cid);
    expect(rate).toBeDefined();
    expect(rate?.profession_code).toBe('DENTIST');
    expect(Number(rate?.amount)).toBe(7500);
  });
});
