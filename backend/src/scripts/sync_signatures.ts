/**
 * PHTS System - Signature Synchronization Script
 * Syncs signatures from 'employee_signatures' view to 'pts_user_signatures' table
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'phts_system',
  port: parseInt(process.env.DB_PORT || '3306', 10),
};

async function syncSignatures() {
  console.log('✍️  Starting Signature Synchronization (pts_user_signatures)...');
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // --- STEP 1: ดึงข้อมูลลายเซ็น พร้อม user_id ---
    console.log('📥 Fetching signatures from employee_signatures view...');

    // Join กับตาราง users เพื่อให้ได้ user_id
    const [signatures]: any[] = await connection.query(`
      SELECT
        u.user_id,
        u.citizen_id,
        es.signature_blob
      FROM employee_signatures es
      JOIN users u ON es.citizen_id = u.citizen_id
      WHERE u.is_active = 1
    `);

    console.log(`   Found ${signatures.length} signatures to process.`);

    let updatedCount = 0;
    const activeUserIds: number[] = [];

    // --- STEP 2: Loop Upsert ลงตาราง pts_user_signatures ---
    console.log('⚡ Processing signatures...');

    for (const sig of signatures) {
      try {
        if (!sig.signature_blob) continue;

        activeUserIds.push(sig.user_id);

        // Insert หรือ Update ลงตาราง pts_user_signatures
        await connection.query(
          `
          INSERT INTO pts_user_signatures (user_id, signature_image, updated_at)
          VALUES (?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            signature_image = VALUES(signature_image),
            updated_at = NOW()
        `,
          [sig.user_id, sig.signature_blob],
        );

        updatedCount++;
        if (updatedCount % 50 === 0) process.stdout.write('.');
      } catch (err: any) {
        console.error(`\n❌ Error syncing signature for user ${sig.citizen_id}:`, err.message);
      }
    }

    console.log(`\n✅ Synced ${updatedCount} signatures successfully.`);

    // --- STEP 3: Cleanup (ลบลายเซ็นเก่าที่ไม่อยู่ในระบบแล้ว) ---
    if (activeUserIds.length > 0) {
      console.log('🧹 Cleaning up obsolete signatures...');

      const placeholders = activeUserIds.map(() => '?').join(',');

      const [result]: any = await connection.query(
        `
            DELETE FROM pts_user_signatures
            WHERE user_id NOT IN (${placeholders})
        `,
        activeUserIds,
      );

      if (result.affectedRows > 0) {
        console.log(`   🗑️  Removed ${result.affectedRows} obsolete signatures.`);
      }
    }
  } catch (error: any) {
    console.error('\n❌ Sync Failed:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

syncSignatures();
