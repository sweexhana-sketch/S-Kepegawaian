import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({ error: "Profil tidak ditemukan" }, { status: 404 });
    const pegawai = pegawaiRows[0];

    const today = new Date();
    const threeMonthsLater = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());

    let rows;
    if (pegawai.role === "admin" || pegawai.role === "pimpinan") {
      rows = await sql`
        SELECT k.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja, p.golongan
        FROM kgb k JOIN pegawai p ON k.pegawai_id = p.id
        ORDER BY k.tmt_kgb_baru ASC
      `;
    } else {
      rows = await sql`
        SELECT k.*, p.nama_lengkap, p.nip FROM kgb k
        JOIN pegawai p ON k.pegawai_id = p.id
        WHERE k.pegawai_id = ${pegawai.id}
        ORDER BY k.tmt_kgb_baru DESC
      `;
    }

    // Flag yang akan segera KGB dalam 3 bulan
    const enriched = rows.map(k => ({
      ...k,
      is_upcoming: k.tmt_kgb_baru && new Date(k.tmt_kgb_baru) <= threeMonthsLater && new Date(k.tmt_kgb_baru) >= today,
      is_overdue: k.tmt_kgb_baru && new Date(k.tmt_kgb_baru) < today && k.status === 'pending',
    }));

    const upcoming = enriched.filter(k => k.is_upcoming || k.is_overdue);

    return Response.json({ kgb: enriched, upcoming, total: enriched.length });
  } catch (err) {
    console.error("GET /api/kgb/list error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
