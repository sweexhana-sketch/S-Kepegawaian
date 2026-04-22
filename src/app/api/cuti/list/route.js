import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const jenis = searchParams.get("jenis");

    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({ error: "Profil tidak ditemukan" }, { status: 404 });
    const pegawai = pegawaiRows[0];

    let rows;
    if (pegawai.role === "admin" || pegawai.role === "pimpinan") {
      rows = await sql`
        SELECT c.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja
        FROM cuti_izin c JOIN pegawai p ON c.pegawai_id = p.id
        ${status ? sql`WHERE c.status = ${status}` : sql``}
        ORDER BY c.created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT c.*, p.nama_lengkap FROM cuti_izin c
        JOIN pegawai p ON c.pegawai_id = p.id
        WHERE c.pegawai_id = ${pegawai.id}
        ${status ? sql`AND c.status = ${status}` : sql``}
        ${jenis ? sql`AND c.jenis_cuti = ${jenis}` : sql``}
        ORDER BY c.created_at DESC
      `;
    }

    // Get saldo cuti
    const saldoRows = await sql`
      SELECT * FROM saldo_cuti WHERE pegawai_id = ${pegawai.id} LIMIT 1
    `;

    return Response.json({ cuti: rows, saldo: saldoRows[0] || null, total: rows.length });
  } catch (err) {
    console.error("GET /api/cuti/list error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
