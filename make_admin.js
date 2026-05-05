import { neon } from '@neondatabase/serverless';

const dbUrl = 'postgresql://neondb_owner:npg_W9OX1yJxshLZ@ep-muddy-paper-am36bln2-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(dbUrl);

async function makeAdmin() {
  const email = 'calvinpapua05@gmail.com';
  try {
    // 1. Get user id
    const users = await sql`SELECT id, name FROM auth_users WHERE email = ${email}`;
    if (users.length === 0) {
      console.log('User not found');
      return;
    }
    const userId = users[0].id;
    const userName = users[0].name || 'Admin';

    // 2. Check if pegawai record exists
    const pegawai = await sql`SELECT id FROM pegawai WHERE user_id = ${userId}`;
    
    if (pegawai.length > 0) {
      // Update existing record
      await sql`UPDATE pegawai SET role = 'admin' WHERE user_id = ${userId}`;
      console.log(`Updated existing pegawai record for ${email} to admin.`);
    } else {
      // Create new record
      await sql`
        INSERT INTO pegawai (user_id, email, nama_lengkap, role, is_active, status_pegawai)
        VALUES (${userId}, ${email}, ${userName}, 'admin', true, 'PNS')
      `;
      console.log(`Created new admin pegawai record for ${email}.`);
    }
  } catch (err) {
    console.error(err);
  }
}

makeAdmin();
