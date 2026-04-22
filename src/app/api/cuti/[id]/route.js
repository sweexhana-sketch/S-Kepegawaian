import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = params;
    const rows = await sql`
      SELECT c.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja,
        a.nama_lengkap as atasan_nama
      FROM cuti_izin c 
      JOIN pegawai p ON c.pegawai_id = p.id
      LEFT JOIN pegawai a ON c.atasan_id = a.id
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
    const { status, catatan_atasan } = await request.json();

    // Get pegawai for role check
    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({ error: "Unauthorized" }, { status: 403 });
    const pegawai = pegawaiRows[0];

    if (pegawai.role === 'pegawai') {
      return Response.json({ error: "Tidak memiliki akses untuk approve/tolak cuti" }, { status: 403 });
    }

    const rows = await sql`
      UPDATE cuti_izin SET
        status = ${status},
        catatan_atasan = ${catatan_atasan || null},
        disetujui_oleh = ${pegawai.id},
        tanggal_disetujui = NOW(),
        updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;

    if (!rows.length) return Response.json({ error: "Data tidak ditemukan" }, { status: 404 });

    // Kurangi saldo jika disetujui
    if (status === 'disetujui' && rows[0].jenis_cuti === 'cuti_tahunan') {
      await sql`
        UPDATE saldo_cuti SET 
          saldo_tahunan = saldo_tahunan - ${rows[0].jumlah_hari},
          updated_at = NOW()
        WHERE pegawai_id = ${rows[0].pegawai_id}
      `.catch(() => {});
    }

    return Response.json({ cuti: rows[0] });
  } catch (err) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
