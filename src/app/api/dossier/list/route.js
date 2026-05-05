import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({ error: "Profil tidak ditemukan" }, { status: 404 });
    const pegawai = pegawaiRows[0];

    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori");

    let rows;
    if (pegawai.role === "admin") {
      if (kategori) {
        rows = await sql`
          SELECT d.*, p.nama_lengkap, p.nip FROM dossier d
          JOIN pegawai p ON d.pegawai_id = p.id
          WHERE d.kategori_dokumen = ${kategori}
          ORDER BY d.tanggal_upload DESC
        `;
      } else {
        rows = await sql`
          SELECT d.*, p.nama_lengkap, p.nip FROM dossier d
          JOIN pegawai p ON d.pegawai_id = p.id
          ORDER BY d.tanggal_upload DESC
        `;
      }
    } else {
      if (kategori) {
        rows = await sql`
          SELECT * FROM dossier WHERE pegawai_id = ${pegawai.id}
          AND kategori_dokumen = ${kategori}
          ORDER BY tanggal_upload DESC
        `;
      } else {
        rows = await sql`
          SELECT * FROM dossier WHERE pegawai_id = ${pegawai.id}
          ORDER BY tanggal_upload DESC
        `;
      }
    }

    // Normalize property names for frontend compatibility if needed
    const normalized = rows.map(d => ({
      ...d,
      kategori: d.kategori_dokumen,
      status: d.status_verifikasi,
      created_at: d.tanggal_upload
    }));

    return Response.json({ dokumen: normalized, total: normalized.length });
  } catch (err) {
    console.error("GET /api/dossier/list error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
