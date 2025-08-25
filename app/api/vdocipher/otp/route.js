export async function POST(request) {
  const body = await request.json();
  const { videoId } = body;
  const vdocipherApiKey = process.env.VDOCIPHER_API_SECRET;

  const url = `https://dev.vdocipher.com/api/videos/${videoId}/otp`;
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Apisecret ${vdocipherApiKey}`,
    },
    body: JSON.stringify({ ttl: 300 }),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: true,
        message: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
