import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get pegawai data linked to this user
    const rows = await sql`
      SELECT * FROM pegawai WHERE user_id = ${userId} LIMIT 1
    `;

    if (rows.length === 0) {
      return Response.json(
        { error: "Profil pegawai belum terhubung" },
        { status: 404 },
      );
    }

    const pegawai = rows[0];

    return Response.json({
      pegawai: {
        id: pegawai.id,
        nip: pegawai.nip,
        nama_lengkap: pegawai.nama_lengkap,
        email: pegawai.email,
        foto_url: pegawai.foto_url,
        golongan: pegawai.golongan,
        pangkat: pegawai.pangkat,
        jabatan: pegawai.jabatan,
        unit_kerja: pegawai.unit_kerja,
        role: pegawai.role,
        status_pegawai: pegawai.status_pegawai,
      },
    });
  } catch (err) {
    console.error("GET /api/pegawai/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
