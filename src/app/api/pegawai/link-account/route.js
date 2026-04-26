import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { nip } = body;

    if (!nip || nip.length !== 18) {
      return Response.json(
        { error: "NIP harus terdiri dari 18 digit" },
        { status: 400 },
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    const isAdminEmail = userEmail === 'calvinpapua05@gmail.com';

    // Check if pegawai exists with this NIP
    let pegawaiRows = await sql`
      SELECT * FROM pegawai WHERE nip = ${nip} LIMIT 1
    `;

    if (pegawaiRows.length === 0) {
      if (isAdminEmail) {
        // Automatically create admin record if NIP not found but email is admin
        await sql`
          INSERT INTO pegawai (
            nip, nama_lengkap, email, role, is_active, user_id
          ) VALUES (
            ${nip}, ${session.user.name || 'Admin'}, ${userEmail}, 'admin', true, ${userId}
          )
        `;
        pegawaiRows = await sql`SELECT * FROM pegawai WHERE nip = ${nip} LIMIT 1`;
      } else {
        return Response.json(
          { error: "NIP tidak ditemukan dalam database" },
          { status: 404 },
        );
      }
    }

    const pegawai = pegawaiRows[0];

    // Check if this NIP is already linked to another account
    if (pegawai.user_id && pegawai.user_id !== userId) {
      return Response.json(
        { error: "NIP sudah terhubung dengan akun lain" },
        { status: 409 },
      );
    }

    // Link the user_id to pegawai and ensure role is admin if email matches
    await sql`
      UPDATE pegawai 
      SET 
        user_id = ${userId}, 
        role = ${isAdminEmail ? 'admin' : pegawai.role},
        updated_at = CURRENT_TIMESTAMP
      WHERE nip = ${nip}
    `;

    // Also update the email if it's different
    if (userEmail && pegawai.email !== userEmail) {
      await sql`
        UPDATE pegawai 
        SET email = ${userEmail}
        WHERE nip = ${nip}
      `;
    }

    return Response.json({
      success: true,
      message: "Akun berhasil dihubungkan",
      pegawai: {
        nip: pegawai.nip,
        nama_lengkap: pegawai.nama_lengkap,
        role: isAdminEmail ? 'admin' : pegawai.role,
      },
    });
  } catch (err) {
    console.error("POST /api/pegawai/link-account error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
