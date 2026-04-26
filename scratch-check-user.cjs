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
  const email = 'calvinpapua05@gmail.com';
  try {
    console.log(`Checking database for ${email}...`);
    
    const userRes = await pool.query('SELECT * FROM auth_users WHERE email = $1', [email]);
    console.log('User Record:', JSON.stringify(userRes.rows, null, 2));
    
    if (userRes.rowCount > 0) {
      const userId = userRes.rows[0].id;
      const accountsRes = await pool.query('SELECT * FROM auth_accounts WHERE "userId" = $1', [userId]);
      console.log('Account Records:', JSON.stringify(accountsRes.rows, null, 2));
      
      const pegawaiRes = await pool.query('SELECT * FROM pegawai WHERE user_id = $1', [userId]);
      console.log('Pegawai Record:', JSON.stringify(pegawaiRes.rows, null, 2));
    } else {
      console.log('User NOT FOUND in auth_users');
    }
    
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

check();
