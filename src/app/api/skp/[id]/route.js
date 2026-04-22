import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const rows = await sql`
      SELECT s.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja, p.golongan
      FROM skp s JOIN pegawai p ON s.pegawai_id = p.id
      WHERE s.id = ${id} LIMIT 1
    `;
    if (!rows.length) return Response.json({ error: "SKP tidak ditemukan" }, { status: 404 });
    return Response.json({ skp: rows[0] });
  } catch (err) {
    console.error("GET /api/skp/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const body = await request.json();
    const { status, nilai_akhir, catatan_penilai, dokumen_url } = body;

    const rows = await sql`
      UPDATE skp SET
        status = COALESCE(${status}, status),
        nilai_akhir = COALESCE(${nilai_akhir}, nilai_akhir),
        catatan_penilai = COALESCE(${catatan_penilai}, catatan_penilai),
        dokumen_url = COALESCE(${dokumen_url}, dokumen_url),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows.length) return Response.json({ error: "SKP tidak ditemukan" }, { status: 404 });
    return Response.json({ skp: rows[0] });
  } catch (err) {
    console.error("PATCH /api/skp/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    await sql`DELETE FROM skp WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/skp/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
