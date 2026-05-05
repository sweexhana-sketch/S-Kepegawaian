import sql from "@/app/api/utils/sql";

/**
 * Simple TOTP verification using Web Crypto API.
 * Implements RFC 6238 TOTP standard.
 */
async function verifyTOTP(token, secret, windowSize = 2) {
  try {
    // Decode base32 secret
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const secretUpper = secret.toUpperCase().replace(/=+$/, '');
    let bits = '';
    for (const char of secretUpper) {
      const val = base32Chars.indexOf(char);
      if (val === -1) continue;
      bits += val.toString(2).padStart(5, '0');
    }
    const secretBytes = new Uint8Array(Math.floor(bits.length / 8));
    for (let i = 0; i < secretBytes.length; i++) {
      secretBytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
    }

    const key = await crypto.subtle.importKey(
      'raw',
      secretBytes,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );

    const now = Math.floor(Date.now() / 1000 / 30);

    for (let delta = -windowSize; delta <= windowSize; delta++) {
      const counter = now + delta;
      const counterBuffer = new ArrayBuffer(8);
      const counterView = new DataView(counterBuffer);
      counterView.setUint32(4, counter, false);

      const signature = await crypto.subtle.sign('HMAC', key, counterBuffer);
      const hmac = new Uint8Array(signature);

      const offset = hmac[19] & 0xf;
      const code = (
        ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff)
      ) % 1000000;

      const generatedToken = code.toString().padStart(6, '0');
      if (generatedToken === token.trim()) {
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error('TOTP verify error:', err);
    return false;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, token } = body;

    if (!email || !token) {
      return Response.json(
        { error: 'Email dan kode TOTP wajib diisi' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Get totp_secret from pegawai
    const result = await sql`
      SELECT totp_secret FROM pegawai WHERE email = ${normalizedEmail}
    `;

    if (result.length === 0) {
      return Response.json(
        { error: 'Akun tidak ditemukan' },
        { status: 404 }
      );
    }

    const { totp_secret } = result[0];

    if (!totp_secret) {
      return Response.json(
        { error: 'Authenticator belum dikonfigurasi untuk akun ini' },
        { status: 400 }
      );
    }

    // Verify TOTP using native Web Crypto (window ±2 = 60s tolerance)
    const isValid = await verifyTOTP(token, totp_secret, 2);

    if (!isValid) {
      return Response.json(
        { error: 'Kode tidak valid atau sudah kadaluwarsa. Pastikan waktu HP Anda sudah sinkron otomatis dan masukkan kode terbaru.' },
        { status: 400 }
      );
    }

    // Activate account
    await sql`UPDATE auth_users SET "emailVerified" = NOW() WHERE email = ${normalizedEmail}`;
    await sql`UPDATE pegawai SET is_active = true WHERE email = ${normalizedEmail}`;

    console.log(`[VERIFY OK] ${normalizedEmail} activated`);

    return Response.json(
      { success: true, message: 'Akun berhasil diverifikasi. Silakan login.' },
      { status: 200 }
    );
  } catch (err) {
    console.error('POST /api/verify-otp error:', err?.message || err);
    return Response.json(
      { error: `Kesalahan server: ${err?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
