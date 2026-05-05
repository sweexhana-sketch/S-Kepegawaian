import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get pegawai_id
    const pegawaiRows = await sql`
      SELECT id, role, home_latitude, home_longitude FROM pegawai WHERE user_id = ${userId} LIMIT 1
    `;

    if (pegawaiRows.length === 0) {
      return Response.json({ error: "Profil pegawai tidak ditemukan" }, { status: 404 });
    }

    const pegawaiId = pegawaiRows[0].id;

    // Get today's attendance in WIT (UTC+9)
    // We calculate "today" in WIT
    const now = new Date();
    const witOffset = 9 * 60 * 60 * 1000;
    const witNow = new Date(now.getTime() + witOffset);
    const todayDate = witNow.toISOString().split('T')[0];

    const absensiRows = await sql`
      SELECT * FROM absensi 
      WHERE pegawai_id = ${pegawaiId} 
      AND tanggal = ${todayDate} 
      LIMIT 1
    `;

    return Response.json({
      pegawai: pegawaiRows[0],
      absensi: absensiRows[0] || null,
      serverTime: witNow.toISOString()
    });
  } catch (err) {
    console.error("GET /api/absensi/status error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
