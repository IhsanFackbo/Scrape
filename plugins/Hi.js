const handler = async () => {};

/* ======================
   RAW CODE (DITAMPILKAN)
   ====================== */
handler.code = `
// YouTube basic info scrape (contoh)
const axios = require("axios");

async function youtubeInfo(url) {
  if (!url) throw new Error("URL wajib diisi");

  const res = await axios.get(
    "https://noembed.com/embed",
    { params: { url } }
  );

  return {
    title: res.data.title,
    author: res.data.author_name,
    thumbnail: res.data.thumbnail_url
  };
}

module.exports = { youtubeInfo };
`.trim();

/* ======================
   METADATA (KATALOG)
   ====================== */
handler.alias = "YouTube Scraper";
handler.category = "scrape";
handler.tags = ["youtube", "video"];
handler.desc = "Ambil judul, author, dan thumbnail video YouTube.";

module.exports = handler;