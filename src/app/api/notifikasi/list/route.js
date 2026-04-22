import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get pegawai profile
    const pegawaiRows = await sql`
      SELECT id FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1
    `;

    if (pegawaiRows.length === 0) {
      return Response.json(
        { error: "Profil pegawai belum terhubung" },
        { status: 404 },
      );
    }

    const pegawaiId = pegawaiRows[0].id;

    // Get URL params for pagination
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit")) || 20;
    const offset = parseInt(url.searchParams.get("offset")) || 0;

    // Get notifikasi
    const notifikasi = await sql`
      SELECT * FROM notifikasi 
      WHERE pegawai_id = ${pegawaiId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Get total count
    const countRows = await sql`
      SELECT COUNT(*) as count FROM notifikasi 
      WHERE pegawai_id = ${pegawaiId}
    `;
    const total = parseInt(countRows[0].count);

    // Get unread count
    const unreadRows = await sql`
      SELECT COUNT(*) as count FROM notifikasi 
      WHERE pegawai_id = ${pegawaiId} AND is_read = false
    `;
    const unread = parseInt(unreadRows[0].count);

    return Response.json({
      notifikasi,
      total,
      unread,
    });
  } catch (err) {
    console.error("GET /api/notifikasi/list error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
