import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = params;
    const rows = await sql`
      SELECT k.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja, p.golongan, p.status_pegawai
      FROM kgb k JOIN pegawai p ON k.pegawai_id = p.id
      WHERE k.id = ${id} LIMIT 1
    `;
    if (!rows.length) return Response.json({ error: "Data KGB tidak ditemukan" }, { status: 404 });
    return Response.json({ kgb: rows[0] });
  } catch (err) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = params;
    const { status, nomor_sk, tanggal_sk, gaji_baru, catatan } = await request.json();

    const rows = await sql`
      UPDATE kgb SET
        status = COALESCE(${status}, status),
        nomor_sk = COALESCE(${nomor_sk}, nomor_sk),
        tanggal_sk = COALESCE(${tanggal_sk}, tanggal_sk),
        gaji_baru = COALESCE(${gaji_baru}, gaji_baru),
        catatan = COALESCE(${catatan}, catatan),
        updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    if (!rows.length) return Response.json({ error: "Data tidak ditemukan" }, { status: 404 });
    return Response.json({ kgb: rows[0] });
  } catch (err) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
