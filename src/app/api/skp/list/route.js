import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const tahun = searchParams.get("tahun") || new Date().getFullYear();
    const status = searchParams.get("status");

    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({ error: "Profil tidak ditemukan" }, { status: 404 });

    const pegawai = pegawaiRows[0];
    let rows;

    if (pegawai.role === "admin" || pegawai.role === "pimpinan") {
      rows = await sql`
        SELECT s.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja 
        FROM skp s 
        JOIN pegawai p ON s.pegawai_id = p.id
        WHERE s.tahun = ${tahun}
        ${status ? sql`AND s.status = ${status}` : sql``}
        ORDER BY s.created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT s.*, p.nama_lengkap, p.nip FROM skp s
        JOIN pegawai p ON s.pegawai_id = p.id
        WHERE s.pegawai_id = ${pegawai.id} AND s.tahun = ${tahun}
        ${status ? sql`AND s.status = ${status}` : sql``}
        ORDER BY s.created_at DESC
      `;
    }

    return Response.json({ skp: rows, total: rows.length });
  } catch (err) {
    console.error("GET /api/skp/list error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
