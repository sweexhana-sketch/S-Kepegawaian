import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pegawaiRows = await sql`
      SELECT role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1
    `;
    if (pegawaiRows.length === 0) {
      return Response.json({ error: "Profil pegawai belum terhubung" }, { status: 404 });
    }

    const role = pegawaiRows[0].role;

    // Jika bukan admin, hanya kembalikan datanya sendiri
    if (role !== "admin") {
      const rows = await sql`SELECT * FROM pegawai WHERE user_id = ${session.user.id}`;
      return Response.json({ pegawai: rows, total: rows.length, limit: 50, offset: 0 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const unitKerja = url.searchParams.get("unit_kerja") || "";
    const limit = Math.min(parseInt(url.searchParams.get("limit")) || 50, 100);
    const offset = parseInt(url.searchParams.get("offset")) || 0;

    // Use safe tagged template literals
    let rows;
    let countRows;

    if (search && status && unitKerja) {
      rows = await sql`SELECT * FROM pegawai WHERE (LOWER(nama_lengkap) LIKE LOWER(${'%' + search + '%'}) OR nip LIKE ${'%' + search + '%'}) AND status_pegawai = ${status} AND LOWER(unit_kerja) LIKE LOWER(${'%' + unitKerja + '%'}) ORDER BY nama_lengkap ASC LIMIT ${limit} OFFSET ${offset}`;
      countRows = await sql`SELECT COUNT(*) as count FROM pegawai WHERE (LOWER(nama_lengkap) LIKE LOWER(${'%' + search + '%'}) OR nip LIKE ${'%' + search + '%'}) AND status_pegawai = ${status} AND LOWER(unit_kerja) LIKE LOWER(${'%' + unitKerja + '%'})`;
    } else if (search && status) {
      rows = await sql`SELECT * FROM pegawai WHERE (LOWER(nama_lengkap) LIKE LOWER(${'%' + search + '%'}) OR nip LIKE ${'%' + search + '%'}) AND status_pegawai = ${status} ORDER BY nama_lengkap ASC LIMIT ${limit} OFFSET ${offset}`;
      countRows = await sql`SELECT COUNT(*) as count FROM pegawai WHERE (LOWER(nama_lengkap) LIKE LOWER(${'%' + search + '%'}) OR nip LIKE ${'%' + search + '%'}) AND status_pegawai = ${status}`;
    } else if (search && unitKerja) {
      rows = await sql`SELECT * FROM pegawai WHERE (LOWER(nama_lengkap) LIKE LOWER(${'%' + search + '%'}) OR nip LIKE ${'%' + search + '%'}) AND LOWER(unit_kerja) LIKE LOWER(${'%' + unitKerja + '%'}) ORDER BY nama_lengkap ASC LIMIT ${limit} OFFSET ${offset}`;
      countRows = await sql`SELECT COUNT(*) as count FROM pegawai WHERE (LOWER(nama_lengkap) LIKE LOWER(${'%' + search + '%'}) OR nip LIKE ${'%' + search + '%'}) AND LOWER(unit_kerja) LIKE LOWER(${'%' + unitKerja + '%'})`;
    } else if (status && unitKerja) {
      rows = await sql`SELECT * FROM pegawai WHERE status_pegawai = ${status} AND LOWER(unit_kerja) LIKE LOWER(${'%' + unitKerja + '%'}) ORDER BY nama_lengkap ASC LIMIT ${limit} OFFSET ${offset}`;
      countRows = await sql`SELECT COUNT(*) as count FROM pegawai WHERE status_pegawai = ${status} AND LOWER(unit_kerja) LIKE LOWER(${'%' + unitKerja + '%'})`;
    } else if (search) {
      rows = await sql`SELECT * FROM pegawai WHERE LOWER(nama_lengkap) LIKE LOWER(${'%' + search + '%'}) OR nip LIKE ${'%' + search + '%'} ORDER BY nama_lengkap ASC LIMIT ${limit} OFFSET ${offset}`;
      countRows = await sql`SELECT COUNT(*) as count FROM pegawai WHERE LOWER(nama_lengkap) LIKE LOWER(${'%' + search + '%'}) OR nip LIKE ${'%' + search + '%'}`;
    } else if (status) {
      rows = await sql`SELECT * FROM pegawai WHERE status_pegawai = ${status} ORDER BY nama_lengkap ASC LIMIT ${limit} OFFSET ${offset}`;
      countRows = await sql`SELECT COUNT(*) as count FROM pegawai WHERE status_pegawai = ${status}`;
    } else if (unitKerja) {
      rows = await sql`SELECT * FROM pegawai WHERE LOWER(unit_kerja) LIKE LOWER(${'%' + unitKerja + '%'}) ORDER BY nama_lengkap ASC LIMIT ${limit} OFFSET ${offset}`;
      countRows = await sql`SELECT COUNT(*) as count FROM pegawai WHERE LOWER(unit_kerja) LIKE LOWER(${'%' + unitKerja + '%'})`;
    } else {
      rows = await sql`SELECT * FROM pegawai ORDER BY nama_lengkap ASC LIMIT ${limit} OFFSET ${offset}`;
      countRows = await sql`SELECT COUNT(*) as count FROM pegawai`;
    }

    const total = parseInt(countRows[0].count);

    return Response.json({ pegawai: rows, total, limit, offset });
  } catch (err) {
    console.error("GET /api/pegawai/list error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
