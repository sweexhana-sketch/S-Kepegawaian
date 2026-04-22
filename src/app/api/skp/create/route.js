import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const pegawaiRows = await sql`SELECT id FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({ error: "Profil tidak ditemukan" }, { status: 404 });
    const pegawaiId = pegawaiRows[0].id;

    const body = await request.json();
    const { tahun, periode, dokumen_url, catatan, target_nilai } = body;

    if (!tahun || !periode) {
      return Response.json({ error: "Tahun dan periode wajib diisi" }, { status: 400 });
    }

    // Check if SKP for this period already exists
    const existing = await sql`
      SELECT id FROM skp WHERE pegawai_id = ${pegawaiId} AND tahun = ${tahun} AND periode = ${periode} LIMIT 1
    `;
    if (existing.length > 0) {
      return Response.json({ error: `SKP ${periode} ${tahun} sudah ada` }, { status: 409 });
    }

    const rows = await sql`
      INSERT INTO skp (pegawai_id, tahun, periode, dokumen_url, catatan, target_nilai, status, created_at, updated_at)
      VALUES (${pegawaiId}, ${tahun}, ${periode}, ${dokumen_url || null}, ${catatan || null}, ${target_nilai || null}, 'draft', NOW(), NOW())
      RETURNING *
    `;

    return Response.json({ skp: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("POST /api/skp/create error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
