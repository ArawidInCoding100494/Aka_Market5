export default async function handler(req, res) {
  const API_URL = "https://json-api.uz/api/project/AkaMarket/brands";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      return res.status(response.status).json({ error: "API xatosi" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Server bilan bog‘lanishda xato" });
  }
}
