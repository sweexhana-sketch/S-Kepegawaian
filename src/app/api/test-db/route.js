import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const result = await sql`SELECT 1 as "test"`;
    return Response.json({ success: true, result });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
