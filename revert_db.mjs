import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function revert() {
  try {
    const res = await pool.query('DELETE FROM pegawai WHERE user_id IS NULL');
    console.log(`Deleted ${res.rowCount} records from pegawai table.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

revert();
