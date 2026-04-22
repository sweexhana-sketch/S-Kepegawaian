import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({ error: "Unauthorized" }, { status: 403 });
    const pegawai = pegawaiRows[0];

    const { id } = params;
    // Only owner or admin can delete
    if (pegawai.role === "admin") {
      await sql`DELETE FROM dossier WHERE id = ${id}`;
    } else {
      await sql`DELETE FROM dossier WHERE id = ${id} AND pegawai_id = ${pegawai.id}`;
    }
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const pegawaiRows = await sql`SELECT role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length || pegawaiRows[0].role !== 'admin') {
      return Response.json({ error: "Hanya admin yang dapat memverifikasi dokumen" }, { status: 403 });
    }
    const { id } = params;
    const { status, catatan } = await request.json();
    const rows = await sql`
      UPDATE dossier SET status = ${status}, catatan = ${catatan || null}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    return Response.json({ dokumen: rows[0] });
  } catch (err) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
