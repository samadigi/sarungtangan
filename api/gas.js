export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // URL HARUS URL POLOS, jangan pakai [ ] atau ( )
  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbx99yrir7L4n7aA6BbLe8pvSHh6Eh5jJa0LFIUyie-GPi-KEO0q36vJ_aQYMfZ24uuNTg/exec";

  try {
    if (req.method === "GET") {
      return res.status(200).json({
        success: true,
        message: "Vercel API aktif.",
      });
    }

    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method tidak diizinkan.",
      });
    }

    const response = await fetch(GAS_URL, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body || {}),
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);

      return res.status(200).json(data);

    } catch (error) {
      console.error("Response GAS bukan JSON:", text);

      return res.status(502).json({
        success: false,
        message: "Response Apps Script bukan JSON.",
        status: response.status,
        contentType: response.headers.get("content-type"),
        preview: text.substring(0, 500),
      });
    }

  } catch (error) {
    console.error("GAS Proxy Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal terhubung ke Google Apps Script.",
      error: error.message,
    });
  }
}
