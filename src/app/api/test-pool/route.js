import { Pool } from '@neondatabase/serverless';

export async function GET() {
  try {
    const start = Date.now();
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const result = await pool.query('SELECT 1 as "test"');
    const time = Date.now() - start;
    return Response.json({ success: true, result: result.rows, time });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
