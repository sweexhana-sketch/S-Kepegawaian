const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/DATABASE_URL=([^\n]+)/);
  if (match) dbUrl = match[1].trim().replace(/^["']|["']$/g, '');
}

const pool = new Pool({ connectionString: dbUrl });

pool.query(`
  SELECT table_name, column_name 
  FROM information_schema.columns 
  WHERE table_name IN ('saldo_cuti','cuti','cuti_izin','kgb','skp','kenaikan_pangkat','dossier','notifikasi')
  ORDER BY table_name, ordinal_position
`).then(r => {
  const grouped = {};
  r.rows.forEach(row => {
    if (!grouped[row.table_name]) grouped[row.table_name] = [];
    grouped[row.table_name].push(row.column_name);
  });
  console.log(JSON.stringify(grouped, null, 2));
  pool.end();
}).catch(e => {
  console.error(e.message);
  pool.end();
});
