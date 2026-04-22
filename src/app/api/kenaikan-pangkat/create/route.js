import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const pegawaiRows = await sql`SELECT id, golongan, pangkat FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({ error: "Profil tidak ditemukan" }, { status: 404 });
    const p = pegawaiRows[0];

    const { jenis_kenaikan, golongan_baru, pangkat_baru, tmt_usulan, periode_usulan, catatan, dokumen_urls } = await request.json();

    if (!jenis_kenaikan || !tmt_usulan) {
      return Response.json({ error: "Jenis kenaikan dan TMT wajib diisi" }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO kenaikan_pangkat 
        (pegawai_id, jenis_kenaikan, golongan_lama, pangkat_lama, golongan_baru, pangkat_baru, tmt_usulan, periode_usulan, catatan, dokumen_urls, status, created_at, updated_at)
      VALUES 
        (${p.id}, ${jenis_kenaikan}, ${p.golongan}, ${p.pangkat}, ${golongan_baru || null}, ${pangkat_baru || null}, ${tmt_usulan}, ${periode_usulan || null}, ${catatan || null}, ${JSON.stringify(dokumen_urls || [])}, 'usulan', NOW(), NOW())
      RETURNING *
    `;

    // Buat notifikasi
    await sql`
      INSERT INTO notifikasi (pegawai_id, jenis, judul, pesan, created_at)
      VALUES (${p.id}, 'kenaikan_pangkat', 'Usulan Kenaikan Pangkat Diajukan', 
        ${'Usulan kenaikan pangkat ' + jenis_kenaikan + ' Anda berhasil diajukan dan sedang diproses.'}, NOW())
    `.catch(() => {}); // non-blocking

    return Response.json({ kenaikan_pangkat: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("POST /api/kenaikan-pangkat/create error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
