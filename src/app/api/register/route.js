import sql from "@/app/api/utils/sql";
import { hash } from 'bcryptjs';

/**
 * Generates a base32-encoded TOTP secret using Web Crypto API.
 * No external library needed - works reliably in all environments.
 */
function generateTotpSecret(length = 20) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  let secret = '';
  for (let i = 0; i < length; i++) {
    secret += chars[randomBytes[i] % 32];
  }
  return secret;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name, nip } = body;

    // Validate inputs
    if (!email || !password || !name || !nip) {
      return Response.json(
        { error: 'Nama, NIP, email, dan password wajib diisi' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
      return Response.json({ error: 'Format input tidak valid' }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Format email tidak valid' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await sql`SELECT id FROM auth_users WHERE email = ${normalizedEmail}`;
    if (existingUser.length > 0) {
      return Response.json(
        { error: 'Email sudah terdaftar. Silakan login atau gunakan email lain.' },
        { status: 409 }
      );
    }

    const existingNip = await sql`SELECT id FROM pegawai WHERE nip = ${nip}`;
    if (existingNip.length > 0) {
      return Response.json(
        { error: 'NIP sudah terdaftar oleh akun lain.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create auth user
    const userResult = await sql`
      INSERT INTO auth_users (name, email, "emailVerified", image)
      VALUES (${name.trim()}, ${normalizedEmail}, NULL, NULL)
      RETURNING id, name, email
    `;
    const newUser = userResult[0];

    // Link credentials with hashed password
    await sql`
      INSERT INTO auth_accounts (
        "userId", provider, type, "providerAccountId",
        access_token, expires_at, refresh_token, id_token,
        scope, session_state, token_type, password
      ) VALUES (
        ${newUser.id}, 'credentials', 'credentials', ${newUser.id},
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, ${hashedPassword}
      )
    `;

    // Generate TOTP secret using built-in crypto (no external library)
    const totpSecret = generateTotpSecret();
    const appName = 'SIMEGPUPR';
    const label = `${appName}:${normalizedEmail}`;
    const otpAuthUri = `otpauth://totp/${encodeURIComponent(label)}?secret=${totpSecret}&issuer=${encodeURIComponent(appName)}&algorithm=SHA1&digits=6&period=30`;

    // QR Code via public API URL (no server-side generation needed)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(otpAuthUri)}`;

    // Insert pegawai record (is_active = false until TOTP verified)
    await sql`
      INSERT INTO pegawai (
        nip, nama_lengkap, user_id, is_active, role, email, totp_secret
      ) VALUES (
        ${nip}, ${name.trim()}, ${newUser.id}, false, 'user', ${normalizedEmail}, ${totpSecret}
      )
    `;

    console.log(`[REGISTER OK] ${normalizedEmail} | NIP: ${nip} | Secret: ${totpSecret}`);

    return Response.json(
      {
        success: true,
        message: 'Akun berhasil dibuat. Setup Google Authenticator untuk aktivasi.',
        totpSetup: {
          secret: totpSecret,
          qrCode: qrCodeUrl,
          email: normalizedEmail,
          otpauthUri: otpAuthUri,
        },
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('POST /api/register error:', err?.message || err);
    return Response.json(
      { error: `Kesalahan server: ${err?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
