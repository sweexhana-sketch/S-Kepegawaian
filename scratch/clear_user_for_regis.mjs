import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function clearUser() {
  const nip = '198504112010041001';
  const email = 'calvinpapua11@gmail.com';
  
  try {
    console.log(`Clearing data for NIP: ${nip} and Email: ${email}`);
    
    // Find user_id from pegawai table
    const resPegawai = await pool.query('SELECT user_id FROM pegawai WHERE nip = $1', [nip]);
    
    if (resPegawai.rows.length > 0) {
      const userId = resPegawai.rows[0].user_id;
      if (userId) {
        console.log(`Found linked User ID: ${userId}, deleting from auth tables...`);
        await pool.query('DELETE FROM auth_accounts WHERE "userId" = $1', [userId]);
        await pool.query('DELETE FROM auth_sessions WHERE "userId" = $1', [userId]);
        await pool.query('DELETE FROM auth_users WHERE id = $1', [userId]);
      }
    }
    
    // Also check auth_users directly by email
    const resUser = await pool.query('SELECT id FROM auth_users WHERE email = $1', [email]);
    if (resUser.rows.length > 0) {
      const userId = resUser.rows[0].id;
      console.log(`Found User ID by email: ${userId}, deleting...`);
      await pool.query('DELETE FROM auth_accounts WHERE "userId" = $1', [userId]);
      await pool.query('DELETE FROM auth_sessions WHERE "userId" = $1', [userId]);
      await pool.query('DELETE FROM auth_users WHERE id = $1', [userId]);
    }

    // Finally delete from pegawai and tokens
    await pool.query('DELETE FROM pegawai WHERE nip = $1 OR email = $2', [nip, email]);
    await pool.query('DELETE FROM auth_verification_token WHERE identifier = $1', [email]);
    
    console.log('Successfully cleared all associated data.');
  } catch (err) {
    console.error('Error clearing data:', err);
  } finally {
    await pool.end();
  }
}

clearUser();
