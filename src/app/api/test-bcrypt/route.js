import { compare, hash } from "bcryptjs";

export async function GET() {
  try {
    const start = Date.now();
    const h = await hash("password123", 10);
    const hashTime = Date.now() - start;
    
    const startCompare = Date.now();
    const isValid = await compare("password123", h);
    const compareTime = Date.now() - startCompare;

    return Response.json({ success: true, hashTime, compareTime, isValid });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
