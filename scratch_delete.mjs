import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function deletePegawaiOnly() {
    try {
        const r1 = await pool.query("DELETE FROM pegawai WHERE email = 'calvinpapua11@gmail.com'");
        console.log('Deleted from pegawai:', r1.rowCount);
        const r2 = await pool.query("DELETE FROM auth_verification_token WHERE identifier = 'calvinpapua11@gmail.com'");
        console.log('Deleted from tokens:', r2.rowCount);
        const r3 = await pool.query("DELETE FROM auth_users WHERE email = 'calvinpapua11@gmail.com'");
        console.log('Deleted from auth_users:', r3.rowCount);
    } catch(e) {
        console.log(e);
    } finally {
        await pool.end();
    }
}
deletePegawaiOnly();
