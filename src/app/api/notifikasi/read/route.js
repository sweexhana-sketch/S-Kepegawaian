import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const pegawaiRows = await sql`SELECT id FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({ error: "Profil tidak ditemukan" }, { status: 404 });
    const pegawaiId = pegawaiRows[0].id;

    const { id, all } = await request.json();

    if (all) {
      await sql`UPDATE notifikasi SET is_read = true WHERE pegawai_id = ${pegawaiId}`;
    } else if (id) {
      await sql`UPDATE notifikasi SET is_read = true WHERE id = ${id} AND pegawai_id = ${pegawaiId}`;
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
