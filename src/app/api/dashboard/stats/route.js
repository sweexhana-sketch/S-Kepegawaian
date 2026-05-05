import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get pegawai profile to check role
    const pegawaiRows = await sql`
      SELECT role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1
    `;

    if (pegawaiRows.length === 0) {
      return Response.json(
        { error: "Profil pegawai belum terhubung" },
        { status: 404 },
      );
    }

    const role = pegawaiRows[0].role;

    // Total Pegawai
    const totalPegawaiRows = await sql`
      SELECT COUNT(*) as count FROM pegawai WHERE is_active = true
    `;
    const totalPegawai = parseInt(totalPegawaiRows[0].count);

    // KGB Bulan Ini (TMT KGB yang jatuh di bulan ini)
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const kgbBulanIniRows = await sql`
      SELECT COUNT(*) as count FROM kgb 
      WHERE EXTRACT(MONTH FROM tanggal_kgb_berikutnya) = ${currentMonth}
      AND EXTRACT(YEAR FROM tanggal_kgb_berikutnya) = ${currentYear}
      AND status = 'pending'
    `;
    const kgbBulanIni = parseInt(kgbBulanIniRows[0].count);

    // Usulan Kenaikan Pangkat (status usulan atau di_bkd)
    const usulanKPRows = await sql`
      SELECT COUNT(*) as count FROM kenaikan_pangkat 
      WHERE status IN ('usulan', 'di_bkd')
    `;
    const usulanKP = parseInt(usulanKPRows[0].count);

    // SKP Belum Submit (tahun ini, status draft)
    const skpBelumSubmitRows = await sql`
      SELECT COUNT(*) as count FROM skp 
      WHERE tahun = ${currentYear}
      AND status = 'draft'
    `;
    const skpBelumSubmit = parseInt(skpBelumSubmitRows[0].count);

    // Get distribution stats
    const distRows = await sql`
      SELECT status_pegawai, COUNT(*) as count 
      FROM pegawai 
      WHERE is_active = true 
      GROUP BY status_pegawai
    `;
    
    let pnsCount = 0, cpnsCount = 0, pppkCount = 0;
    distRows.forEach(r => {
      if (r.status_pegawai === 'PNS') pnsCount = parseInt(r.count);
      else if (r.status_pegawai === 'CPNS') cpnsCount = parseInt(r.count);
      else if (r.status_pegawai === 'PPPK') pppkCount = parseInt(r.count);
    });

    return Response.json({
      totalPegawai,
      kgbBulanIni,
      usulanKP,
      skpBelumSubmit,
      distribusi: {
        pns: pnsCount,
        cpns: cpnsCount,
        pppk: pppkCount
      }
    });
  } catch (err) {
    console.error("GET /api/dashboard/stats error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
