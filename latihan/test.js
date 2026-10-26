// Latihan logika validasi tanpa browser
// Jalankan: node latihan/test.js
const validasiNama = (v) => {
  v = v.trim();
  if (!v) return "Nama wajib diisi.";
  if (v.length < 3) return "Nama minimal 3 karakter.";
  return "";
};
const validasiEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Format email tidak valid.";

console.assert(validasiNama("") === "Nama wajib diisi.", "nama kosong");
console.assert(validasiNama("Al") === "Nama minimal 3 karakter.", "nama pendek");
console.assert(validasiNama("Budi") === "", "nama valid");
console.assert(validasiEmail("budi@mail.com") === "", "email valid");
console.assert(validasiEmail("budi@mail") !== "", "email tanpa domain");

console.log("Selesai. Tidak ada pesan 'Assertion failed' berarti semua tes lolos.");