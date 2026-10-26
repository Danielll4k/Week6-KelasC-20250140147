/**
 * index.js — Fetch API: mengambil & menampilkan data produk dari DummyJSON
 */
const API_URL = "https://dummyjson.com/products";

const elDaftar = document.getElementById("daftar-produk");
const elStatus = document.getElementById("status");
const elCari = document.getElementById("cari-produk");
const elJumlah = document.getElementById("jumlah-produk");

let semuaProduk = []; // disimpan agar bisa difilter tanpa fetch ulang

/* ---------- Helper tampilan status ---------- */
function tampilkanLoading() {
  elStatus.hidden = false;
  elStatus.className = "status";
  elStatus.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>Memuat data produk…</span>';
}

function tampilkanError(pesan) {
  elStatus.hidden = false;
  elStatus.className = "status error";
  elStatus.textContent = "";

  const teks = document.createElement("span");
  teks.textContent = "Gagal memuat produk: " + pesan;

  const tombol = document.createElement("button");
  tombol.type = "button";
  tombol.className = "btn";
  tombol.textContent = "Coba lagi";
  tombol.addEventListener("click", muatProduk);

  elStatus.append(teks, tombol);
}

function sembunyikanStatus() {
  elStatus.hidden = true;
  elStatus.textContent = "";
}

/* ---------- Format harga ke USD (sesuai data DummyJSON) ---------- */
const formatHarga = (angka) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(angka);

/* ---------- Render produk ke DOM ---------- */
function renderProduk(daftar) {
  elDaftar.textContent = ""; // kosongkan list

  if (daftar.length === 0) {
    const kosong = document.createElement("li");
    kosong.className = "muted";
    kosong.textContent = "Tidak ada produk yang cocok dengan pencarian.";
    elDaftar.appendChild(kosong);
  }

  daftar.forEach((p) => {
    const li = document.createElement("li");
    li.className = "product-card";

    const img = document.createElement("img");
    img.src = p.thumbnail;
    img.alt = p.title;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "body";

    const judul = document.createElement("h3");
    judul.textContent = p.title;

    const kategori = document.createElement("span");
    kategori.className = "kategori";
    kategori.textContent = p.category;

    const harga = document.createElement("span");
    harga.className = "harga";
    harga.textContent = formatHarga(p.price);

    body.append(judul, kategori, harga);
    li.append(img, body);
    elDaftar.appendChild(li);
  });

  elJumlah.textContent = `${daftar.length} dari ${semuaProduk.length} produk`;
}

/* ---------- Fetch data ---------- */
async function muatProduk() {
  tampilkanLoading();
  elDaftar.textContent = "";
  elCari.disabled = true;
  elJumlah.textContent = "";

  // Batas waktu 10 detik agar loading tidak menggantung
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(API_URL, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Server membalas dengan status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.products)) {
      throw new Error("Format data tidak sesuai");
    }

    semuaProduk = data.products;
    sembunyikanStatus();
    renderProduk(semuaProduk);
    elCari.disabled = false;
  } catch (err) {
    const pesan =
      err.name === "AbortError" ? "permintaan melebihi batas waktu." : err.message;
    tampilkanError(pesan);
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- Event: pencarian produk (input) ---------- */
elCari.addEventListener("input", () => {
  const kata = elCari.value.trim().toLowerCase();
  const hasil = semuaProduk.filter((p) => p.title.toLowerCase().includes(kata));
  renderProduk(hasil);
});

// Jalankan saat halaman dibuka
muatProduk();