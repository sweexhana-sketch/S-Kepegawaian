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
      WHERE EXTRACT(MONTH FROM tmt_kgb_baru) = ${currentMonth}
      AND EXTRACT(YEAR FROM tmt_kgb_baru) = ${currentYear}
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

    return Response.json({
      totalPegawai,
      kgbBulanIni,
      usulanKP,
      skpBelumSubmit,
    });
  } catch (err) {
    console.error("GET /api/dashboard/stats error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
