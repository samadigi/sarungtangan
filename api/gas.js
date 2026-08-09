export default async function handler(req, res) {
  // Izinkan request dari frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

 const GAS_URL =
  "https://script.google.com/macros/s/AKfycbx99yrir7L4n7aA6BbLe8pvSHh6Eh5jJa0LFIUyie-GPi-KEO0q36vJ_aQYMfZ24uuNTg/exec";

  try {
    const options = {
      method: req.method,
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (req.method !== "GET") {
      options.body = JSON.stringify(req.body || {});
    }

    const response = await fetch(GAS_URL, options);

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      data = {
        success: false,
        message: "Response Apps Script bukan JSON.",
        response: text,
      };
    }

    return res.status(response.status).json(data);

  } catch (error) {
    console.error("GAS Proxy Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal terhubung ke Google Apps Script.",
      error: error.message,
    });
  }
}
