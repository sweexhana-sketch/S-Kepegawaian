import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const jenis = searchParams.get("jenis");

    const pegawaiRows = await sql`SELECT id, role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1`;
    if (!pegawaiRows.length) return Response.json({ error: "Profil tidak ditemukan" }, { status: 404 });
    const pegawai = pegawaiRows[0];

    let rows;
    if (pegawai.role === "admin" || pegawai.role === "pimpinan") {
      if (status) {
        rows = await sql`
          SELECT c.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja
          FROM cuti c JOIN pegawai p ON c.pegawai_id = p.id
          WHERE c.status = ${status}
          ORDER BY c.created_at DESC
        `;
      } else {
        rows = await sql`
          SELECT c.*, p.nama_lengkap, p.nip, p.jabatan, p.unit_kerja
          FROM cuti c JOIN pegawai p ON c.pegawai_id = p.id
          ORDER BY c.created_at DESC
        `;
      }
    } else {
      if (status && jenis) {
        rows = await sql`
          SELECT c.*, p.nama_lengkap FROM cuti c
          JOIN pegawai p ON c.pegawai_id = p.id
          WHERE c.pegawai_id = ${pegawai.id} AND c.status = ${status} AND c.jenis_cuti = ${jenis}
          ORDER BY c.created_at DESC
        `;
      } else if (status) {
        rows = await sql`
          SELECT c.*, p.nama_lengkap FROM cuti c
          JOIN pegawai p ON c.pegawai_id = p.id
          WHERE c.pegawai_id = ${pegawai.id} AND c.status = ${status}
          ORDER BY c.created_at DESC
        `;
      } else if (jenis) {
        rows = await sql`
          SELECT c.*, p.nama_lengkap FROM cuti c
          JOIN pegawai p ON c.pegawai_id = p.id
          WHERE c.pegawai_id = ${pegawai.id} AND c.jenis_cuti = ${jenis}
          ORDER BY c.created_at DESC
        `;
      } else {
        rows = await sql`
          SELECT c.*, p.nama_lengkap FROM cuti c
          JOIN pegawai p ON c.pegawai_id = p.id
          WHERE c.pegawai_id = ${pegawai.id}
          ORDER BY c.created_at DESC
        `;
      }
    }

    // Normalize column names for frontend (lama_hari -> jumlah_hari)
    const normalized = rows.map(c => ({
      ...c,
      jumlah_hari: c.lama_hari ?? c.jumlah_hari,
    }));

    // Get saldo cuti
    const saldoRows = await sql`
      SELECT * FROM saldo_cuti WHERE pegawai_id = ${pegawai.id} AND tahun = ${new Date().getFullYear()} LIMIT 1
    `;

    const saldo = saldoRows[0] ? {
      saldo_tahunan: saldoRows[0].sisa_cuti,
      saldo_besar: 0,
      digunakan_tahun_ini: saldoRows[0].cuti_terpakai,
      tahun: saldoRows[0].tahun,
      jatah_cuti: saldoRows[0].jatah_cuti,
    } : null;

    return Response.json({ cuti: normalized, saldo, total: normalized.length });
  } catch (err) {
    console.error("GET /api/cuti/list error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
