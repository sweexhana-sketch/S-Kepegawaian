import { Pool } from '@neondatabase/serverless';
import { hash } from 'bcryptjs';
import fs from 'fs';

// Run this with: node --env-file=.env scripts/create_demo_pegawai.mjs
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createAccount(email, password, name, nip, role, jabatan) {
  try {
    console.log(`\n--- Processing ${email} ---`);
    console.log(`Checking if user ${email} already exists...`);
    const userRes = await pool.query('SELECT id FROM auth_users WHERE email = $1', [email]);
    
    let userId;
    if (userRes.rowCount > 0) {
      userId = userRes.rows[0].id;
      console.log(`User ${email} already exists with ID: ${userId}`);
    } else {
      console.log(`Creating user ${email}...`);
      const newUserRes = await pool.query(
        'INSERT INTO auth_users (name, email) VALUES ($1, $2) RETURNING id',
        [name, email]
      );
      userId = newUserRes.rows[0].id;
      console.log(`Created user with ID: ${userId}`);

      console.log(`Creating account for user ${userId}...`);
      const hashedPassword = await hash(password, 10);
      await pool.query(
        `INSERT INTO auth_accounts ("userId", type, provider, "providerAccountId", password) 
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, 'credentials', 'credentials', userId, hashedPassword]
      );
      console.log('Created auth_accounts successfully.');
    }

    console.log(`Checking if pegawai record for NIP ${nip} exists...`);
    const pegawaiRes = await pool.query('SELECT id FROM pegawai WHERE nip = $1', [nip]);
    
    if (pegawaiRes.rowCount > 0) {
      console.log(`Pegawai record with NIP ${nip} already exists. Updating...`);
      await pool.query(
        'UPDATE pegawai SET user_id = $1, nama_lengkap = $2, email = $3, role = $4, jabatan = $5 WHERE nip = $6', 
        [userId, name, email, role, jabatan, nip]
      );
    } else {
      console.log(`Creating pegawai record for NIP ${nip}...`);
      await pool.query(
        `INSERT INTO pegawai (nip, nama_lengkap, email, role, is_active, user_id, pangkat, jabatan) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [nip, name, email, role, true, userId, role === 'admin' ? 'Pembina Utama' : 'Penata Muda', jabatan]
      );
      console.log('Created pegawai record successfully.');
    }
    return { email, password };
  } catch (err) {
    console.error(`Error processing ${email}:`, err.message);
  }
}

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined. Please run with --env-file=.env');
    process.exit(1);
  }

  const accounts = [
    {
      email: 'pegawai@demo.com',
      password: 'password123',
      name: 'Pegawai Demo',
      nip: '123456789012345678',
      role: 'pegawai',
      jabatan: 'Staf Administrasi'
    },
    {
      email: 'admin@demo.com',
      password: 'password123',
      name: 'Admin Demo',
      nip: '000000000000000000',
      role: 'admin',
      jabatan: 'Administrator Sistem'
    }
  ];

  for (const acc of accounts) {
    await createAccount(acc.email, acc.password, acc.name, acc.nip, acc.role, acc.jabatan);
  }

  console.log('\nAll demo accounts processed successfully!');
  console.log('------------------------------------------');
  accounts.forEach(acc => {
    console.log(`Role: ${acc.role.toUpperCase()}`);
    console.log(`Email: ${acc.email}`);
    console.log(`Password: ${acc.password}`);
    console.log('------------------------------------------');
  });

  await pool.end();
}

run();
