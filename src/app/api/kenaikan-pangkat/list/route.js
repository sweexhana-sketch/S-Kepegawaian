import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({ error: "Profil tidak ditemukan" }, { status: 404 });
    const pegawai = pegawaiRows[0];

    let rows;
    if (pegawai.role === "admin" || pegawai.role === "pimpinan") {
      rows = await sql`
        SELECT kp.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja, p.golongan, p.pangkat
        FROM kenaikan_pangkat kp JOIN pegawai p ON kp.pegawai_id = p.id
        ${status ? sql`WHERE kp.status = ${status}` : sql``}
        ORDER BY kp.created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT kp.*, p.nama_lengkap, p.nip FROM kenaikan_pangkat kp
        JOIN pegawai p ON kp.pegawai_id = p.id
        WHERE kp.pegawai_id = ${pegawai.id}
        ${status ? sql`AND kp.status = ${status}` : sql``}
        ORDER BY kp.created_at DESC
      `;
    }

    return Response.json({ kenaikan_pangkat: rows, total: rows.length });
  } catch (err) {
    console.error("GET /api/kenaikan-pangkat/list error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
