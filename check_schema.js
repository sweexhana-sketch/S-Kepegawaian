import { neon } from '@neondatabase/serverless';

const dbUrl = 'postgresql://neondb_owner:npg_W9OX1yJxshLZ@ep-muddy-paper-am36bln2-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(dbUrl);

async function checkSchema() {
  try {
    const result = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'pegawai'
    `;
    console.log(result.map(r => r.column_name));
  } catch(err) {
    console.error(err);
  }
}
checkSchema();
