import sql from "@/app/api/utils/sql";

/**
 * Endpoint sementara untuk menghapus data user agar bisa registrasi ulang.
 * Gunakan: DELETE /api/admin/cleanup-user?email=xxx@xxx.com
 * HAPUS endpoint ini setelah tidak dibutuhkan lagi.
 */
export async function DELETE(request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return Response.json({ error: "Parameter 'email' wajib diisi" }, { status: 400 });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Find pegawai
    const pegawaiRows = await sql`
      SELECT id, user_id FROM pegawai WHERE email = ${normalizedEmail}
    `;

    let userId = null;

    for (const p of pegawaiRows) {
      userId = p.user_id;
      await sql`DELETE FROM pegawai WHERE id = ${p.id}`;
    }

    // Find from auth_users if not found via pegawai
    if (!userId) {
      const userRows = await sql`SELECT id FROM auth_users WHERE email = ${normalizedEmail}`;
      if (userRows.length > 0) userId = userRows[0].id;
    }

    if (userId) {
      await sql`DELETE FROM auth_accounts WHERE "userId" = ${userId}`;
      await sql`DELETE FROM auth_users WHERE id = ${userId}`;
    }

    return Response.json({
      success: true,
      message: `Data untuk email ${normalizedEmail} telah dihapus. Silakan registrasi ulang.`,
      deleted_pegawai: pegawaiRows.length,
      deleted_user_id: userId,
    });
  } catch (err) {
    console.error("cleanup-user error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
