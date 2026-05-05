import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const pegawaiRows = await sql`
      SELECT id FROM pegawai WHERE user_id = ${userId} LIMIT 1
    `;

    if (pegawaiRows.length === 0) {
      return Response.json({ error: "Profil pegawai tidak ditemukan" }, { status: 404 });
    }

    const pegawaiId = pegawaiRows[0].id;

    // WIT Time (UTC+9)
    const now = new Date();
    const witOffset = 9 * 60 * 60 * 1000;
    const witNow = new Date(now.getTime() + witOffset);
    const todayDate = witNow.toISOString().split('T')[0];

    // Check if checked in today
    const absensiRows = await sql`
      SELECT id, check_out_time FROM absensi 
      WHERE pegawai_id = ${pegawaiId} 
      AND tanggal = ${todayDate} 
      LIMIT 1
    `;

    if (absensiRows.length === 0) {
      return Response.json({ error: "Anda belum melakukan Check-In hari ini" }, { status: 400 });
    }

    if (absensiRows[0].check_out_time) {
      return Response.json({ error: "Anda sudah melakukan Check-Out hari ini" }, { status: 400 });
    }

    await sql`
      UPDATE absensi 
      SET check_out_time = ${witNow.toISOString()}, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${absensiRows[0].id}
    `;

    return Response.json({ success: true, message: "Berhasil Check-Out" });
  } catch (err) {
    console.error("POST /api/absensi/check-out error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
