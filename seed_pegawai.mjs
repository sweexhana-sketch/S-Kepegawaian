import { Pool } from '@neondatabase/serverless';
import xlsx from 'xlsx';
import fs from 'fs';

// Run this with: node --env-file=.env seed_pegawai.mjs
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  try {
    const workbook = xlsx.readFile('src/data/DATA KEPEGAWAIAN.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const pegawaiList = [];
    let currentPegawai = null;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;

      const isNumber = !isNaN(parseInt(row[0], 10));
      
      if (isNumber) {
        if (currentPegawai) {
          pegawaiList.push(currentPegawai);
        }
        currentPegawai = {
          nama_lengkap: row[1]?.toString().trim(),
          pangkat: row[2]?.toString().trim()
        };
      } else if (currentPegawai && row[1] && row[1].toString().startsWith('NIP.')) {
        let nipStr = row[1].toString().replace('NIP.', '').replace(/\s+/g, '').replace(/[^0-9]/g, '');
        currentPegawai.nip = nipStr;
        currentPegawai.jabatan = row[2]?.toString().trim() || null;
        
        pegawaiList.push(currentPegawai);
        currentPegawai = null;
      }
    }
    if (currentPegawai && currentPegawai.nip) {
        pegawaiList.push(currentPegawai);
    }

    console.log(`Found ${pegawaiList.length} employees to insert.`);

    let inserted = 0;
    for (const p of pegawaiList) {
      if (!p.nip || p.nip.length < 1) continue;
      
      // Ensure NIP is max 18 chars
      const cleanNip = p.nip.substring(0, 18);
      if(!p.nama_lengkap) continue;

      try {
        const { rows } = await pool.query('SELECT id FROM pegawai WHERE nip = $1', [cleanNip]);
        if (rows.length === 0) {
          await pool.query(
            `INSERT INTO pegawai (nip, nama_lengkap, pangkat, jabatan) VALUES ($1, $2, $3, $4)`,
            [cleanNip, p.nama_lengkap.substring(0,255), p.pangkat ? p.pangkat.substring(0,255) : null, p.jabatan ? p.jabatan.substring(0,255) : null]
          );
          inserted++;
        }
      } catch (err) {
        console.error(`Failed to insert ${cleanNip} - ${p.nama_lengkap}: ${err.message}`);
      }
    }
    
    console.log(`Successfully inserted ${inserted} new employees.`);
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await pool.end();
  }
}

seed();
