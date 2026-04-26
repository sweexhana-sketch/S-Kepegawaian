const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
  if (match) dbUrl = match[1];
}

const pool = new Pool({ connectionString: dbUrl });

async function debug() {
  try {
    console.log('Checking database status...');
    
    const tables = await pool.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
    console.log('Available Tables:', tables.rows.map(t => t.tablename).join(', '));
    
    const users = await pool.query("SELECT id, email, name FROM auth_users");
    console.log('Total Users:', users.rowCount);
    console.log('Users List:', JSON.stringify(users.rows, null, 2));
    
    const targetEmail = 'calvinpapua05@gmail.com';
    const checkTarget = await pool.query("SELECT * FROM auth_users WHERE email = $1", [targetEmail]);
    console.log(`Checking specifically for ${targetEmail}:`, checkTarget.rowCount > 0 ? 'EXISTS' : 'NOT FOUND');
    
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

debug();
