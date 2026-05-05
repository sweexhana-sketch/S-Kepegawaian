import { neon } from '@neondatabase/serverless';

const sql = neon("postgresql://neondb_owner:npg_W9OX1yJxshLZ@ep-muddy-paper-am36bln2-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function cleanupUser() {
  const nameToSearch = 'calvin asmuruf';
  console.log(`Searching for user: ${nameToSearch}`);

  try {
    // 1. Find the pegawai
    const pegawaiRows = await sql`
      SELECT id, user_id, email, nip, nama_lengkap 
      FROM pegawai 
      WHERE LOWER(nama_lengkap) LIKE ${'%' + nameToSearch.toLowerCase() + '%'}
    `;

    console.log(`Found ${pegawaiRows.length} matching pegawai record(s).`);
    for (const p of pegawaiRows) {
      const userId = p.user_id;
      const pegawaiId = p.id;

      console.log(`Deleting pegawai ID: ${pegawaiId}...`);
      await sql`DELETE FROM pegawai WHERE id = ${pegawaiId}`;

      if (userId) {
        console.log(`Deleting auth_accounts for user ID: ${userId}...`);
        await sql`DELETE FROM auth_accounts WHERE "userId" = ${userId}`;
        console.log(`Deleting auth_users for user ID: ${userId}...`);
        await sql`DELETE FROM auth_users WHERE id = ${userId}`;
      }
    }

    // 2. Also search directly in auth_users by name if no pegawai was found or to be thorough
    const userRows = await sql`
        SELECT id, email, name FROM auth_users 
        WHERE LOWER(name) LIKE ${'%' + nameToSearch.toLowerCase() + '%'}
    `;
    
    console.log(`Found ${userRows.length} matching auth_users record(s).`);
    for (const u of userRows) {
        console.log(`Deleting auth_accounts for user ID: ${u.id} (${u.email})...`);
        await sql`DELETE FROM auth_accounts WHERE "userId" = ${u.id}`;
        console.log(`Deleting auth_users for user ID: ${u.id}...`);
        await sql`DELETE FROM auth_users WHERE id = ${u.id}`;
    }

    console.log('Cleanup completed successfully.');
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
}

cleanupUser();
