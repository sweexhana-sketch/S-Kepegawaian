const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
  if (match) {
    dbUrl = match[1];
  }
}

const pool = new Pool({ connectionString: dbUrl });

async function init() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pegawai (
        id SERIAL PRIMARY KEY,
        nip VARCHAR(18) UNIQUE,
        nama_lengkap VARCHAR(255),
        tempat_lahir VARCHAR(255),
        tanggal_lahir DATE,
        jenis_kelamin VARCHAR(20),
        agama VARCHAR(50),
        status_pernikahan VARCHAR(50),
        alamat TEXT,
        no_telepon VARCHAR(50),
        email VARCHAR(255),
        foto_url TEXT,
        status_pegawai VARCHAR(50),
        golongan VARCHAR(50),
        pangkat VARCHAR(100),
        jabatan VARCHAR(100),
        unit_kerja VARCHAR(100),
        pendidikan_terakhir VARCHAR(100),
        jurusan VARCHAR(100),
        nama_institusi VARCHAR(255),
        tahun_lulus VARCHAR(4),
        tmt_cpns DATE,
        tmt_pns DATE,
        tmt_pangkat_terakhir DATE,
        tmt_jabatan DATE,
        role VARCHAR(50) DEFAULT 'pegawai',
        is_active BOOLEAN DEFAULT true,
        user_id UUID REFERENCES auth_users(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS saldo_cuti (
        id SERIAL PRIMARY KEY,
        pegawai_id INTEGER REFERENCES pegawai(id) ON DELETE CASCADE,
        tahun INTEGER,
        jatah_cuti INTEGER,
        cuti_terpakai INTEGER,
        sisa_cuti INTEGER,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS dossier (
        id SERIAL PRIMARY KEY,
        pegawai_id INTEGER REFERENCES pegawai(id) ON DELETE CASCADE,
        kategori_dokumen VARCHAR(255),
        nama_dokumen VARCHAR(255),
        file_url TEXT,
        status_verifikasi VARCHAR(50) DEFAULT 'Menunggu',
        catatan TEXT,
        tanggal_upload TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS cuti (
        id SERIAL PRIMARY KEY,
        pegawai_id INTEGER REFERENCES pegawai(id) ON DELETE CASCADE,
        jenis_cuti VARCHAR(100),
        tanggal_mulai DATE,
        tanggal_selesai DATE,
        lama_hari INTEGER,
        alasan TEXT,
        status VARCHAR(50) DEFAULT 'Menunggu',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS skp (
        id SERIAL PRIMARY KEY,
        pegawai_id INTEGER REFERENCES pegawai(id) ON DELETE CASCADE,
        tahun INTEGER,
        nilai_orientasi_pelayanan NUMERIC(5,2),
        nilai_integritas NUMERIC(5,2),
        nilai_komitmen NUMERIC(5,2),
        nilai_disiplin NUMERIC(5,2),
        nilai_kerjasama NUMERIC(5,2),
        nilai_kepemimpinan NUMERIC(5,2),
        nilai_rata_rata NUMERIC(5,2),
        rekomendasi TEXT,
        status VARCHAR(50) DEFAULT 'Menunggu',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS kgb (
        id SERIAL PRIMARY KEY,
        pegawai_id INTEGER REFERENCES pegawai(id) ON DELETE CASCADE,
        tanggal_kgb_terakhir DATE,
        tanggal_kgb_berikutnya DATE,
        gaji_pokok_lama NUMERIC(15,2),
        gaji_pokok_baru NUMERIC(15,2),
        status VARCHAR(50) DEFAULT 'Menunggu',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS kenaikan_pangkat (
        id SERIAL PRIMARY KEY,
        pegawai_id INTEGER REFERENCES pegawai(id) ON DELETE CASCADE,
        pangkat_sekarang VARCHAR(100),
        pangkat_tujuan VARCHAR(100),
        tanggal_pengajuan DATE,
        status VARCHAR(50) DEFAULT 'Menunggu',
        catatan TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Application database schema initialized successfully.');

    // Promote the user calvinpapua05@gmail.com to admin
    const userRes = await pool.query("SELECT id, name, email FROM auth_users WHERE email = 'calvinpapua05@gmail.com'");
    if (userRes.rowCount > 0) {
      const user = userRes.rows[0];
      const checkPegawai = await pool.query("SELECT id FROM pegawai WHERE user_id = $1", [user.id]);
      
      if (checkPegawai.rowCount === 0) {
        await pool.query(`
          INSERT INTO pegawai (
            nip, nama_lengkap, email, role, is_active, user_id
          ) VALUES (
            '199001012020121001', $1, $2, 'admin', true, $3
          )
        `, [user.name, user.email, user.id]);
        console.log('Successfully created admin pegawai record for', user.email);
      } else {
        await pool.query("UPDATE pegawai SET role = 'admin' WHERE user_id = $1", [user.id]);
        console.log('Successfully promoted existing pegawai record for', user.email, 'to admin');
      }
    } else {
      console.log('User calvinpapua05@gmail.com not found. Admin account not created.');
    }

  } catch (err) {
    console.error('Error initializing application database schema:', err.message);
  } finally {
    pool.end();
  }
}

init();
