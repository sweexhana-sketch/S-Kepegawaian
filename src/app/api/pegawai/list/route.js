import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth(request);
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

    // Get URL params
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const unitKerja = url.searchParams.get("unit_kerja") || "";
    const limit = parseInt(url.searchParams.get("limit")) || 50;
    const offset = parseInt(url.searchParams.get("offset")) || 0;

    // Build query
    let queryParts = ["SELECT * FROM pegawai WHERE 1=1"];
    let countQueryParts = ["SELECT COUNT(*) as count FROM pegawai WHERE 1=1"];
    const values = [];
    let paramIndex = 1;

    // Search filter
    if (search) {
      const searchPattern = `%${search}%`;
      queryParts.push(
        `AND (LOWER(nama_lengkap) LIKE LOWER($${paramIndex}) OR nip LIKE $${paramIndex})`,
      );
      countQueryParts.push(
        `AND (LOWER(nama_lengkap) LIKE LOWER($${paramIndex}) OR nip LIKE $${paramIndex})`,
      );
      values.push(searchPattern);
      paramIndex++;
    }

    // Status filter
    if (status) {
      queryParts.push(`AND status_pegawai = $${paramIndex}`);
      countQueryParts.push(`AND status_pegawai = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    // Unit kerja filter
    if (unitKerja) {
      queryParts.push(`AND LOWER(unit_kerja) LIKE LOWER($${paramIndex})`);
      countQueryParts.push(`AND LOWER(unit_kerja) LIKE LOWER($${paramIndex})`);
      values.push(`%${unitKerja}%`);
      paramIndex++;
    }

    // Add ordering and pagination
    queryParts.push(
      `ORDER BY nama_lengkap ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    );
    values.push(limit, offset);

    // Execute queries
    const finalQuery = queryParts.join(" ");
    const finalCountQuery = countQueryParts.join(" ");

    const pegawaiList = await sql(finalQuery, values.slice(0, -2));
    const countResult = await sql(finalCountQuery, values.slice(0, -2));

    const total = parseInt(countResult[0].count);

    return Response.json({
      pegawai: pegawaiList,
      total,
      limit,
      offset,
    });
  } catch (err) {
    console.error("GET /api/pegawai/list error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
