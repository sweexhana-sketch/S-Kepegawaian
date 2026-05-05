import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  try {
    await pool.query(`ALTER TABLE pegawai ADD COLUMN IF NOT EXISTS totp_secret TEXT`);
    console.log('Migration successful: totp_secret column added to pegawai table.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pool.end();
  }
}

migrate();
