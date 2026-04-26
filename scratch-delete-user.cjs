const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
  if (match) dbUrl = match[1];
}

const pool = new Pool({ connectionString: dbUrl });

async function clear() {
  const email = 'calvinpapua05@gmail.com';
  try {
    console.log(`Deleting user ${email} and related records...`);
    
    // 1. Get user id
    const userRes = await pool.query('SELECT id FROM auth_users WHERE email = $1', [email]);
    if (userRes.rowCount > 0) {
      const userId = userRes.rows[0].id;
      
      // Delete in order due to constraints
      await pool.query('DELETE FROM auth_accounts WHERE "userId" = $1', [userId]);
      await pool.query('DELETE FROM auth_sessions WHERE "userId" = $1', [userId]);
      await pool.query('DELETE FROM pegawai WHERE user_id = $1', [userId]);
      await pool.query('DELETE FROM auth_users WHERE id = $1', [userId]);
      
      console.log('User deleted successfully.');
    } else {
      console.log('User not found.');
    }
    
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

clear();
