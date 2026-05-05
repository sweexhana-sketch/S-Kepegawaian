import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

const OFFICE_LAT = -0.883806;
const OFFICE_LNG = 131.295786;
const MAX_RADIUS_METERS = 100; // 100 meters radius

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { latitude, longitude } = await request.json();
    if (!latitude || !longitude) {
      return Response.json({ error: "Lokasi diperlukan" }, { status: 400 });
    }

    const userId = session.user.id;
    const pegawaiRows = await sql`
      SELECT id, home_latitude, home_longitude FROM pegawai WHERE user_id = ${userId} LIMIT 1
    `;

    if (pegawaiRows.length === 0) {
      return Response.json({ error: "Profil pegawai tidak ditemukan" }, { status: 404 });
    }

    const pegawai = pegawaiRows[0];

    // WIT Time (UTC+9)
    const now = new Date();
    const witOffset = 9 * 60 * 60 * 1000;
    const witNow = new Date(now.getTime() + witOffset);
    const day = witNow.getUTCDay(); // 0: Sunday, 1: Monday, ..., 5: Friday
    const hour = witNow.getUTCHours();
    const minute = witNow.getUTCMinutes();
    const timeInMinutes = hour * 60 + minute;
    
    const startTime = 8 * 60; // 08:00
    const endTime = 16 * 60; // 16:00

    if (timeInMinutes < startTime || timeInMinutes > endTime) {
      return Response.json({ error: "Absensi hanya tersedia pukul 08:00 - 16:00 WIT" }, { status: 403 });
    }

    let workMode = "";
    let targetLat, targetLng;

    if (day === 1) { // Monday
      workMode = "office";
      targetLat = OFFICE_LAT;
      targetLng = OFFICE_LNG;
    } else if (day === 5) { // Friday
      workMode = "home";
      targetLat = parseFloat(pegawai.home_latitude);
      targetLng = parseFloat(pegawai.home_longitude);

      if (isNaN(targetLat) || isNaN(targetLng)) {
        return Response.json({ error: "Lokasi rumah belum terdaftar. Hubungi admin." }, { status: 403 });
      }
    } else {
      return Response.json({ error: "Absensi online hanya tersedia hari Senin (Kantor) dan Jumat (Rumah)" }, { status: 403 });
    }

    const distance = getDistance(latitude, longitude, targetLat, targetLng);

    if (distance > MAX_RADIUS_METERS) {
      return Response.json({ 
        error: `Lokasi Anda terlalu jauh dari ${workMode === "office" ? "Kantor" : "Rumah"} (${Math.round(distance)} meter). Jarak maksimum adalah ${MAX_RADIUS_METERS} meter.` 
      }, { status: 403 });
    }

    const todayDate = witNow.toISOString().split('T')[0];
    
    // Check if already checked in
    const existing = await sql`
      SELECT id FROM absensi WHERE pegawai_id = ${pegawai.id} AND tanggal = ${todayDate}
    `;

    if (existing.length > 0) {
      return Response.json({ error: "Anda sudah melakukan absensi hari ini" }, { status: 400 });
    }

    await sql`
      INSERT INTO absensi (pegawai_id, tanggal, check_in_time, latitude, longitude, status, work_mode)
      VALUES (${pegawai.id}, ${todayDate}, ${witNow.toISOString()}, ${latitude}, ${longitude}, 'hadir', ${workMode})
    `;

    return Response.json({ success: true, message: "Berhasil Check-In" });
  } catch (err) {
    console.error("POST /api/absensi/check-in error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
