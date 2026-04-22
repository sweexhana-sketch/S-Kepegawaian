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
      rows = await sql`
        SELECT d.*, p.nama_lengkap, p.nip FROM dossier d
        JOIN pegawai p ON d.pegawai_id = p.id
        ${kategori ? sql`WHERE d.kategori = ${kategori}` : sql``}
        ORDER BY d.created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT * FROM dossier WHERE pegawai_id = ${pegawai.id}
        ${kategori ? sql`AND kategori = ${kategori}` : sql``}
        ORDER BY created_at DESC
      `;
    }

    return Response.json({ dokumen: rows, total: rows.length });
  } catch (err) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
