export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

 const GAS_URL =
  "https://script.google.com/macros/s/AKfycbxfxVf-gfSYJdpHyhR_1FhGyugmVUS1HZ5rci7PnzQOzGMGxtFFXidiWugHwLkPnmKGLQ/exec";

  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      message: "Proxy Vercel aktif"
    });
  }

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body || {})
    });

    const text = await response.text();

    console.log("GAS STATUS:", response.status);
    console.log("GAS URL FINAL:", response.url);
    console.log("GAS CONTENT TYPE:", response.headers.get("content-type"));
    console.log("GAS RESPONSE:", text.substring(0, 2000));

    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);

    } catch (e) {
      return res.status(502).json({
        success: false,
        message: "Response Apps Script bukan JSON.",
        googleStatus: response.status,
        googleFinalUrl: response.url,
        contentType: response.headers.get("content-type"),
        preview: text.substring(0, 1000)
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menghubungi Apps Script.",
      error: error.message
    });
  }
}
