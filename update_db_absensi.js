import { neon } from '@neondatabase/serverless';

const dbUrl = 'postgresql://neondb_owner:npg_W9OX1yJxshLZ@ep-muddy-paper-am36bln2-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(dbUrl);

async function updateSchema() {
  try {
    console.log('Updating pegawai table...');
    await sql`
      ALTER TABLE pegawai 
      ADD COLUMN IF NOT EXISTS home_latitude DECIMAL(10, 8),
      ADD COLUMN IF NOT EXISTS home_longitude DECIMAL(11, 8)
    `;

    console.log('Creating absensi table...');
    await sql`
      CREATE TABLE IF NOT EXISTS absensi (
        id SERIAL PRIMARY KEY,
        pegawai_id INTEGER REFERENCES pegawai(id),
        tanggal DATE DEFAULT CURRENT_DATE,
        check_in_time TIMESTAMP,
        check_out_time TIMESTAMP,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        status VARCHAR(50),
        work_mode VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database schema updated successfully.');
  } catch (err) {
    console.error('Error updating database schema:', err);
  }
}

updateSchema();
