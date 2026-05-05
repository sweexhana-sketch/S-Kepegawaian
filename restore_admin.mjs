import { Pool } from '@neondatabase/serverless';
import { hash } from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function restoreAdmin() {
  try {
    const email = 'calvinpapua05@gmail.com';
    const password = 'password123'; // Default password

    // Check if user already exists
    const resUser = await pool.query('SELECT id FROM auth_users WHERE email = $1', [email]);
    let userId;

    if (resUser.rows.length === 0) {
      // Create user
      const insertUser = await pool.query(
        'INSERT INTO auth_users (name, email, "emailVerified") VALUES ($1, $2, NOW()) RETURNING id',
        ['Calvin Asmuruf', email]
      );
      userId = insertUser.rows[0].id;

      // Create account
      const hashedPassword = await hash(password, 10);
      await pool.query(
        `INSERT INTO auth_accounts (
          "userId", provider, type, "providerAccountId", password
        ) VALUES ($1, 'credentials', 'credentials', $1, $2)`,
        [userId, hashedPassword]
      );
      console.log(`Berhasil membuat user ${email}.`);
    } else {
      userId = resUser.rows[0].id;
      console.log(`User ${email} sudah ada.`);
    }

    // Check pegawai
    const resPegawai = await pool.query('SELECT id FROM pegawai WHERE user_id = $1', [userId]);
    if (resPegawai.rows.length === 0) {
      await pool.query(
        `INSERT INTO pegawai (user_id, email, nama_lengkap, role, is_active, status_pegawai)
         VALUES ($1, $2, $3, 'admin', true, 'PNS')`,
        [userId, email, 'Calvin Asmuruf']
      );
      console.log('Berhasil membuat data admin di tabel pegawai.');
    } else {
      await pool.query("UPDATE pegawai SET role = 'admin', is_active = true WHERE user_id = $1", [userId]);
      console.log('Berhasil update data pegawai menjadi admin.');
    }

    console.log(`Selesai. Email: ${email}, Password: ${password}`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

restoreAdmin();
