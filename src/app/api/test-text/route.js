export async function POST(request) {
  try {
    const start = Date.now();
    const textData = await request.text();
    const time = Date.now() - start;
    return Response.json({ success: true, textData, time });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
