import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const pegawaiRows = await sql`
      SELECT * FROM pegawai WHERE id = ${id} LIMIT 1
    `;

    if (pegawaiRows.length === 0) {
      return Response.json(
        { error: "Pegawai tidak ditemukan" },
        { status: 404 },
      );
    }

    return Response.json({ pegawai: pegawaiRows[0] });
  } catch (err) {
    console.error("GET /api/pegawai/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Check if pegawai exists
    const existingRows = await sql`
      SELECT * FROM pegawai WHERE id = ${id} LIMIT 1
    `;

    if (existingRows.length === 0) {
      return Response.json(
        { error: "Pegawai tidak ditemukan" },
        { status: 404 },
      );
    }

    // Build update query dynamically
    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    const updatableFields = [
      "nama_lengkap",
      "tempat_lahir",
      "tanggal_lahir",
      "jenis_kelamin",
      "agama",
      "status_pernikahan",
      "alamat",
      "no_telepon",
      "email",
      "foto_url",
      "status_pegawai",
      "golongan",
      "pangkat",
      "jabatan",
      "unit_kerja",
      "pendidikan_terakhir",
      "jurusan",
      "nama_institusi",
      "tahun_lulus",
      "tmt_cpns",
      "tmt_pns",
      "tmt_pangkat_terakhir",
      "tmt_jabatan",
      "role",
      "is_active",
    ];

    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        setClauses.push(`${field} = $${paramIndex}`);
        values.push(body[field]);
        paramIndex++;
      }
    }

    if (setClauses.length === 0) {
      return Response.json(
        { error: "Tidak ada data untuk diupdate" },
        { status: 400 },
      );
    }

    // Add updated_at
    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

    // Build and execute query
    const updateQuery = `
      UPDATE pegawai 
      SET ${setClauses.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    values.push(id);

    const result = await sql(updateQuery, values);

    return Response.json({
      success: true,
      pegawai: result[0],
    });
  } catch (err) {
    console.error("PUT /api/pegawai/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check role - only admin can delete
    const userPegawaiRows = await sql`
      SELECT role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1
    `;

    if (userPegawaiRows.length === 0 || userPegawaiRows[0].role !== "admin") {
      return Response.json(
        { error: "Forbidden: Hanya admin yang dapat menghapus pegawai" },
        { status: 403 },
      );
    }

    // Soft delete (set is_active to false)
    const result = await sql`
      UPDATE pegawai 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "Pegawai tidak ditemukan" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Pegawai berhasil dinonaktifkan",
    });
  } catch (err) {
    console.error("DELETE /api/pegawai/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
