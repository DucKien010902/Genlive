import type { NextApiRequest, NextApiResponse } from "next";

// API proxy: chuyển tiếp request từ frontend sang backend
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { path = [] } = req.query;
  const backendPath = Array.isArray(path) ? path.join("/") : path;

  // ✅ Giữ lại query string (ví dụ ?jobID=2)
  const queryString = req.url?.split("?")[1];
  // const backendURL = `http://14.225.254.148:5001/${backendPath}${queryString ? `?${queryString}` : ""}`;
  const backendURL = `http://localhost:5001/${backendPath}${queryString ? `?${queryString}` : ""}`;

  console.log("🔁 Proxy to:", backendURL); // debug xem có nối đúng không

  try {
    const response = await fetch(backendURL, {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        Authorization: req.headers["authorization"] || "",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    // Nhận kết quả (text hoặc JSON)
    const text = await response.text();

    // Nếu là JSON thì parse, còn không thì trả text
    try {
      const data = JSON.parse(text);
      res.status(response.status).json(data);
    } catch {
      res.status(response.status).send(text);
    }
  } catch (error: any) {
    console.error("❌ Proxy error:", error.message);
    res.status(500).json({ error: "Proxy failed", details: error.message });
  }
}
