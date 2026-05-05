import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const pegawaiRows = await sql`SELECT id FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({ error: "Profil tidak ditemukan" }, { status: 404 });
    const pegawaiId = pegawaiRows[0].id;

    // The frontend sends { kategori, jenis_dokumen, deskripsi, file_url, masa_berlaku }
    // but the db schema is: pegawai_id, kategori_dokumen, nama_dokumen, file_url, status_verifikasi, catatan, tanggal_upload
    const { kategori, jenis_dokumen, file_url, deskripsi } = await request.json();

    if (!kategori || !jenis_dokumen || !file_url) {
      return Response.json({ error: "Kategori, jenis dokumen, dan file wajib diisi" }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO dossier (pegawai_id, kategori_dokumen, nama_dokumen, file_url, catatan, status_verifikasi, tanggal_upload)
      VALUES (${pegawaiId}, ${kategori}, ${jenis_dokumen}, ${file_url}, ${deskripsi || null}, 'Menunggu', NOW())
      RETURNING *
    `;

    return Response.json({ dokumen: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("POST /api/dossier/create error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
