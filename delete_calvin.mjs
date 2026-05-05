import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function deleteUser() {
  try {
    // Cari user ID dari auth_users
    const emailToFind = 'calvinpapua11@gmail.com';
    const resUser = await pool.query('SELECT id FROM auth_users WHERE email = $1', [emailToFind]);
    
    if (resUser.rows.length === 0) {
      console.log('User tidak ditemukan.');
      return;
    }

    const userId = resUser.rows[0].id;

    // Hapus dari tabel pegawai
    await pool.query('DELETE FROM pegawai WHERE user_id = $1', [userId]);
    
    // Hapus dari auth_verification_token
    await pool.query('DELETE FROM auth_verification_token WHERE identifier = $1', [emailToFind]);

    // Hapus dari auth_users (yang mana akan men-cascade delete auth_accounts dan auth_sessions)
    await pool.query('DELETE FROM auth_users WHERE id = $1', [userId]);

    console.log('Data user calvinpapua11@gmail.com berhasil dihapus.');
  } catch (err) {
    console.error('Error deleting user:', err);
  } finally {
    await pool.end();
  }
}

deleteUser();
