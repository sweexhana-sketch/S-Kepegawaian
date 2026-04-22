import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check role - only admin can create
    const userPegawaiRows = await sql`
      SELECT role FROM pegawai WHERE user_id = ${session.user.id} LIMIT 1
    `;

    if (userPegawaiRows.length === 0 || userPegawaiRows[0].role !== "admin") {
      return Response.json(
        { error: "Forbidden: Hanya admin yang dapat menambah pegawai" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { nip, nama_lengkap } = body;

    // Validate required fields
    if (!nip || !nama_lengkap) {
      return Response.json(
        { error: "NIP dan Nama Lengkap wajib diisi" },
        { status: 400 },
      );
    }

    if (nip.length !== 18) {
      return Response.json({ error: "NIP harus 18 digit" }, { status: 400 });
    }

    // Check if NIP already exists
    const existingRows = await sql`
      SELECT id FROM pegawai WHERE nip = ${nip} LIMIT 1
    `;

    if (existingRows.length > 0) {
      return Response.json({ error: "NIP sudah terdaftar" }, { status: 409 });
    }

    // Prepare insert data
    const insertData = {
      nip,
      nama_lengkap,
      tempat_lahir: body.tempat_lahir || null,
      tanggal_lahir: body.tanggal_lahir || null,
      jenis_kelamin: body.jenis_kelamin || null,
      agama: body.agama || null,
      status_pernikahan: body.status_pernikahan || null,
      alamat: body.alamat || null,
      no_telepon: body.no_telepon || null,
      email: body.email || null,
      foto_url: body.foto_url || null,
      status_pegawai: body.status_pegawai || "PNS",
      golongan: body.golongan || null,
      pangkat: body.pangkat || null,
      jabatan: body.jabatan || null,
      unit_kerja: body.unit_kerja || null,
      pendidikan_terakhir: body.pendidikan_terakhir || null,
      jurusan: body.jurusan || null,
      nama_institusi: body.nama_institusi || null,
      tahun_lulus: body.tahun_lulus || null,
      tmt_cpns: body.tmt_cpns || null,
      tmt_pns: body.tmt_pns || null,
      tmt_pangkat_terakhir: body.tmt_pangkat_terakhir || null,
      tmt_jabatan: body.tmt_jabatan || null,
      role: body.role || "pegawai",
      is_active: body.is_active !== undefined ? body.is_active : true,
    };

    // Insert pegawai
    const result = await sql`
      INSERT INTO pegawai (
        nip, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin,
        agama, status_pernikahan, alamat, no_telepon, email, foto_url,
        status_pegawai, golongan, pangkat, jabatan, unit_kerja,
        pendidikan_terakhir, jurusan, nama_institusi, tahun_lulus,
        tmt_cpns, tmt_pns, tmt_pangkat_terakhir, tmt_jabatan,
        role, is_active
      ) VALUES (
        ${insertData.nip}, ${insertData.nama_lengkap}, ${insertData.tempat_lahir}, 
        ${insertData.tanggal_lahir}, ${insertData.jenis_kelamin}, ${insertData.agama}, 
        ${insertData.status_pernikahan}, ${insertData.alamat}, ${insertData.no_telepon}, 
        ${insertData.email}, ${insertData.foto_url}, ${insertData.status_pegawai}, 
        ${insertData.golongan}, ${insertData.pangkat}, ${insertData.jabatan}, 
        ${insertData.unit_kerja}, ${insertData.pendidikan_terakhir}, ${insertData.jurusan}, 
        ${insertData.nama_institusi}, ${insertData.tahun_lulus}, ${insertData.tmt_cpns}, 
        ${insertData.tmt_pns}, ${insertData.tmt_pangkat_terakhir}, ${insertData.tmt_jabatan},
        ${insertData.role}, ${insertData.is_active}
      )
      RETURNING *
    `;

    // Create initial saldo cuti for current year
    const currentYear = new Date().getFullYear();
    await sql`
      INSERT INTO saldo_cuti (pegawai_id, tahun, jatah_cuti, cuti_terpakai, sisa_cuti)
      VALUES (${result[0].id}, ${currentYear}, 12, 0, 12)
    `;

    return Response.json({
      success: true,
      pegawai: result[0],
      message: "Pegawai berhasil ditambahkan",
    });
  } catch (err) {
    console.error("POST /api/pegawai/create error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
