export async function POST(request) {
  try {
    const start = Date.now();
    const formData = await request.formData();
    const email = formData.get('email');
    const time = Date.now() - start;
    return Response.json({ success: true, email, time });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
