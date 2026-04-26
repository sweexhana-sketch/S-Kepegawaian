const { Pool } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const fs = require('fs');

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
  if (match) dbUrl = match[1];
}

const pool = new Pool({ connectionString: dbUrl });

async function reset() {
  const email = 'calvinpapua05@gmail.com';
  const newPassword = 'admin123';
  
  try {
    console.log(`Resetting password for ${email}...`);
    
    // 1. Get user id
    const userRes = await pool.query('SELECT id FROM auth_users WHERE email = $1', [email]);
    if (userRes.rowCount === 0) {
      console.error('User not found. Please register first.');
      return;
    }
    const userId = userRes.rows[0].id;
    
    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // 3. Update password in auth_accounts
    await pool.query('UPDATE auth_accounts SET password = $1 WHERE "userId" = $2 AND provider = \'credentials\'', [hashedPassword, userId]);
    
    // 4. Ensure pegawai record exists and is admin
    const checkPegawai = await pool.query('SELECT id FROM pegawai WHERE user_id = $1', [userId]);
    if (checkPegawai.rowCount === 0) {
      await pool.query(`
        INSERT INTO pegawai (nip, nama_lengkap, email, role, is_active, user_id)
        VALUES ('199001012020121001', 'Admin Calvin', $1, 'admin', true, $2)
      `, [email, userId]);
    } else {
      await pool.query("UPDATE pegawai SET role = 'admin' WHERE user_id = $1", [userId]);
    }
    
    console.log('--------------------------------------------------');
    console.log('SUCCESS: Admin account has been reset!');
    console.log(`Email: ${email}`);
    console.log(`New Password: ${newPassword}`);
    console.log('--------------------------------------------------');
    console.log('You can now Sign In using these credentials.');
    
  } catch (err) {
    console.error('Error resetting admin account:', err);
  } finally {
    pool.end();
  }
}

reset();
