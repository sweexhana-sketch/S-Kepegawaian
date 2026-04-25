const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
  if (match) dbUrl = match[1];
}

const pool = new Pool({ connectionString: dbUrl });

async function check() {
  try {
    const res = await pool.query(`
      SELECT auth_accounts.*, auth_users.email 
      FROM auth_accounts 
      JOIN auth_users ON auth_accounts."userId" = auth_users.id 
      WHERE auth_users.email = 'calvinpapua05@gmail.com'
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

check();
