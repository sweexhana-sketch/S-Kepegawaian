import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = params;
    const rows = await sql`
      SELECT c.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja
      FROM cuti c 
      JOIN pegawai p ON c.pegawai_id = p.id
      WHERE c.id = ${id} LIMIT 1
    `;
    if (!rows.length) return Response.json({ error: "Data tidak ditemukan" }, { status: 404 });
    return Response.json({ cuti: rows[0] });
  } catch (err) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = params;
    
    // We get catatan_atasan from the frontend but there is no such column in the cuti table.
    // For now we only update the status.
    const { status } = await request.json();

    // Get pegawai for role check
    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({ error: "Unauthorized" }, { status: 403 });
    const pegawai = pegawaiRows[0];

    if (pegawai.role === 'pegawai') {
      return Response.json({ error: "Tidak memiliki akses untuk approve/tolak cuti" }, { status: 403 });
    }

    const rows = await sql`
      UPDATE cuti SET
        status = ${status}
      WHERE id = ${id} RETURNING *
    `;

    if (!rows.length) return Response.json({ error: "Data tidak ditemukan" }, { status: 404 });

    // Kurangi saldo jika disetujui
    if (status === 'disetujui' && rows[0].jenis_cuti === 'cuti_tahunan') {
      await sql`
        UPDATE saldo_cuti SET 
          sisa_cuti = sisa_cuti - ${rows[0].lama_hari},
          cuti_terpakai = cuti_terpakai + ${rows[0].lama_hari},
          updated_at = NOW()
        WHERE pegawai_id = ${rows[0].pegawai_id}
      `.catch(() => {});
    }

    return Response.json({ cuti: rows[0] });
  } catch (err) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
