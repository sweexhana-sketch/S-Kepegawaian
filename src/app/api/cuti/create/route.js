import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const pegawaiRows = await sql`SELECT id FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({ error: "Profil tidak ditemukan" }, { status: 404 });
    const pegawaiId = pegawaiRows[0].id;

    const { jenis_cuti, tanggal_mulai, tanggal_selesai, alasan, atasan_id, alamat_selama_cuti, telepon_selama_cuti } = await request.json();

    if (!jenis_cuti || !tanggal_mulai || !tanggal_selesai || !alasan) {
      return Response.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    // Hitung jumlah hari
    const start = new Date(tanggal_mulai);
    const end = new Date(tanggal_selesai);
    const jumlah_hari = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (jumlah_hari <= 0) {
      return Response.json({ error: "Tanggal selesai harus setelah tanggal mulai" }, { status: 400 });
    }

    // Validasi saldo cuti tahunan
    if (jenis_cuti === "cuti_tahunan") {
      const saldoRows = await sql`SELECT saldo_tahunan FROM saldo_cuti WHERE pegawai_id = ${pegawaiId} LIMIT 1`;
      if (saldoRows.length && saldoRows[0].saldo_tahunan < jumlah_hari) {
        return Response.json({ error: `Saldo cuti tahunan tidak mencukupi (tersisa ${saldoRows[0].saldo_tahunan} hari)` }, { status: 400 });
      }
    }

    const rows = await sql`
      INSERT INTO cuti_izin 
        (pegawai_id, jenis_cuti, tanggal_mulai, tanggal_selesai, jumlah_hari, alasan, atasan_id, alamat_selama_cuti, telepon_selama_cuti, status, created_at, updated_at)
      VALUES 
        (${pegawaiId}, ${jenis_cuti}, ${tanggal_mulai}, ${tanggal_selesai}, ${jumlah_hari}, ${alasan}, ${atasan_id || null}, ${alamat_selama_cuti || null}, ${telepon_selama_cuti || null}, 'menunggu', NOW(), NOW())
      RETURNING *
    `;

    return Response.json({ cuti: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("POST /api/cuti/create error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
