import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

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

    if (pegawaiRows.length === 0) {
      console.log('No pegawai found with that name.');
      process.exit(0);
    }

    console.log(`Found ${pegawaiRows.length} matching record(s):`);
    for (const p of pegawaiRows) {
      console.log(`- ID: ${p.id}, UserID: ${p.user_id}, Email: ${p.email}, NIP: ${p.nip}, Name: ${p.nama_lengkap}`);
      
      const userId = p.user_id;
      const pegawaiId = p.id;

      // Delete related data first (optional, depends on FK constraints)
      // For now let's try direct deletion if allowed by schema
      
      console.log(`Deleting data for Pegawai ID: ${pegawaiId}...`);
      
      // Delete from tables that might have foreign keys
      await sql`DELETE FROM notifikasi WHERE pegawai_id = ${pegawaiId}`;
      await sql`DELETE FROM kgb WHERE pegawai_id = ${pegawaiId}`;
      await sql`DELETE FROM kenaikan_pangkat WHERE pegawai_id = ${pegawaiId}`;
      await sql`DELETE FROM skp WHERE pegawai_id = ${pegawaiId}`;
      await sql`DELETE FROM absensi WHERE pegawai_id = ${pegawaiId}`;
      
      // Delete the pegawai record
      await sql`DELETE FROM pegawai WHERE id = ${pegawaiId}`;
      console.log(`Pegawai record ${pegawaiId} deleted.`);

      if (userId) {
        console.log(`Deleting user account ID: ${userId}...`);
        await sql`DELETE FROM users WHERE id = ${userId}`;
        console.log(`User account ${userId} deleted.`);
      }
    }

    console.log('Cleanup completed successfully.');
  } catch (err) {
    console.error('Error during cleanup:', err);
  } finally {
    process.exit(0);
  }
}

cleanupUser();
