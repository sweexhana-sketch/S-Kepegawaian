import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL);

async function main() {
  try {
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'kgb'
    `;
    console.log('KGB Columns:', columns);
    
    const sample = await sql`SELECT * FROM kgb LIMIT 1`;
    console.log('KGB Sample:', sample);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
