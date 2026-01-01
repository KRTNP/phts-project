import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'phts_system',
  port: parseInt(process.env.DB_PORT || '3306', 10),
};

const SALT_ROUNDS = 10;

async function syncAll() {
  console.log('🚀 Starting Master Synchronization...');
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // ==========================================
    // PHASE 1: Sync User Accounts (Auth Data)
    // ==========================================
    console.log('\n🔐 Phase 1: Syncing User Accounts (Auth)...');
    const [viewUsers]: any[] = await connection.query(`SELECT * FROM users_sync_view`);

    // Cache ID ของคนที่ Active ไว้
    const activeCitizenIds: string[] = [];
    let updatedUsers = 0;

    for (const u of viewUsers) {
      activeCitizenIds.push(u.citizen_id);
      let finalHash = u.plain_password;

      // Hash password ถ้ายังเป็น Plain text
      if (
        u.plain_password &&
        (!u.plain_password.startsWith('$2') || u.plain_password.length < 50)
      ) {
        finalHash = await bcrypt.hash(String(u.plain_password), SALT_ROUNDS);
      }

      await connection.query(
        `
        INSERT INTO users (citizen_id, password_hash, role, is_active, updated_at)
        VALUES (?, ?, ?, 1, NOW())
        ON DUPLICATE KEY UPDATE
          password_hash = VALUES(password_hash),
          role = VALUES(role),
          is_active = 1,
          updated_at = NOW()
      `,
        [u.citizen_id, finalHash, u.role],
      );
      updatedUsers++;
    }
    console.log(`   ✅ Synced ${updatedUsers} accounts.`);

    // Deactivate คนที่หายไปจาก View
    if (activeCitizenIds.length > 0) {
      const placeholders = activeCitizenIds.map(() => '?').join(',');
      const [res]: any = await connection.query(
        `
        UPDATE users SET is_active = 0
        WHERE citizen_id NOT IN (${placeholders}) AND is_active = 1
      `,
        activeCitizenIds,
      );
      if (res.affectedRows > 0)
        console.log(`   ⛔ Deactivated ${res.affectedRows} obsolete users.`);
    }

    // ==========================================
    // PHASE 2: Sync Medical Profiles (pts_employees)
    // ==========================================
    console.log('\n👩‍⚕️ Phase 2: Syncing Medical Profiles (pts_employees)...');
    // ดึงเฉพาะคนที่มี User Account แล้วเท่านั้น เพื่อประหยัดพื้นที่
    const [medStaff]: any[] = await connection.query(`
      SELECT * FROM employees
      WHERE citizen_id IN (SELECT citizen_id FROM users WHERE is_active = 1)
    `);

    for (const e of medStaff) {
      await connection.query(
        `
        INSERT INTO pts_employees
        (citizen_id, title, first_name, last_name, name_eng, sex, birth_date,
         position_name, position_number, level, employee_type, start_current_position,
         mission_group, department, sub_department, pts_rate, pts_group_no, pts_item_no, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          title = VALUES(title), first_name = VALUES(first_name), last_name = VALUES(last_name),
          position_name = VALUES(position_name), position_number = VALUES(position_number),
          level = VALUES(level), department = VALUES(department), sub_department = VALUES(sub_department),
          pts_rate = VALUES(pts_rate), pts_group_no = VALUES(pts_group_no),
          pts_item_no = VALUES(pts_item_no), updated_at = NOW()
      `,
        [
          e.citizen_id,
          e.title,
          e.first_name,
          e.last_name,
          e.name_eng,
          e.sex,
          e.birth_date,
          e.position_name,
          e.position_number,
          e.level,
          e.employee_type,
          e.start_current_position,
          e.mission_group,
          e.department,
          e.sub_department,
          e.pts_rate,
          e.pts_group_no,
          e.pts_item_no,
        ],
      );
    }
    console.log(`   ✅ Synced ${medStaff.length} medical profiles.`);

    // ==========================================
    // PHASE 3: Sync Support Profiles (pts_support_employees)
    // ==========================================
    console.log('\n💼 Phase 3: Syncing Support Profiles (pts_support_employees)...');
    const [supStaff]: any[] = await connection.query(`
      SELECT * FROM support_employees
      WHERE citizen_id IN (SELECT citizen_id FROM users WHERE is_active = 1)
    `);

    for (const s of supStaff) {
      await connection.query(
        `
        INSERT INTO pts_support_employees
        (citizen_id, title, first_name, last_name, position_name, position_number, department, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          title = VALUES(title), first_name = VALUES(first_name), last_name = VALUES(last_name),
          position_name = VALUES(position_name), position_number = VALUES(position_number),
          department = VALUES(department), updated_at = NOW()
      `,
        [
          s.citizen_id,
          s.title,
          s.first_name,
          s.last_name,
          s.position_name,
          s.position_number,
          s.department,
        ],
      );
    }
    console.log(`   ✅ Synced ${supStaff.length} support profiles.`);

    console.log('\n✨ All Sync Operations Completed Successfully!');
  } catch (error: any) {
    console.error('\n❌ Sync Failed:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

syncAll();
