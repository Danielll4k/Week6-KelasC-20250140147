// Latihan Fetch API di terminal (Node.js 18+)
// Jalankan: node latihan/fetch.js
const API_URL = "https://dummyjson.com/products";

async function ambilProduk() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Status ${response.status}`);

    const data = await response.json();
    console.log(`Total produk: ${data.products.length}`);
    data.products.slice(0, 5).forEach((p, i) => {
      console.log(`${i + 1}. ${p.title} - $${p.price}`);
    });
  } catch (err) {
    console.error("Gagal mengambil data:", err.message);
  }
}

ambilProduk();