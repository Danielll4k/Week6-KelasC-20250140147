// Mengatur form pendaftaran workshop.
const form = document.getElementById("form-daftar");
const fNama = document.getElementById("nama");
const fEmail = document.getElementById("email");
const fKelas = document.getElementById("kelas");
const fJumlah = document.getElementById("jumlah");
const fCatatan = document.getElementById("catatan");
const fSetuju = document.getElementById("setuju");

const elTotal = document.getElementById("total-biaya");
const elFeedback = document.getElementById("feedback");
const elHitung = document.getElementById("hitung-catatan");
const elDaftarPeserta = document.getElementById("daftar-peserta");
const elJumlahDaftar = document.getElementById("jumlah-daftar");
const elKosong = document.getElementById("kosong");

const pendaftar = []; // Daftar peserta selama halaman dibuka.

// Cek setiap kolom dan tampilkan pesan jika ada yang belum benar.
const aturan = {
  nama: () => {
    const v = fNama.value.trim();
    if (!v) return "Nama wajib diisi.";
    if (v.length < 3) return "Nama minimal 3 karakter.";
    if (!/^[A-Za-zÀ-ÿ' .-]+$/.test(v)) return "Nama hanya boleh berisi huruf.";
    return "";
  },
  email: () => {
    const v = fEmail.value.trim();
    if (!v) return "Email wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Format email tidak valid.";
    if (pendaftar.some((p) => p.email === v.toLowerCase())) return "Email ini sudah terdaftar.";
    return "";
  },
  kelas: () => (fKelas.value ? "" : "Pilih salah satu kelas."),
  jumlah: () => {
    const n = Number(fJumlah.value);
    if (!fJumlah.value) return "Jumlah wajib diisi.";
    if (!Number.isInteger(n)) return "Jumlah harus bilangan bulat.";
    if (n < 1 || n > 5) return "Jumlah peserta antara 1 sampai 5.";
    return "";
  },
  setuju: () => (fSetuju.checked ? "" : "Centang untuk melanjutkan."),
};

const inputPerField = { nama: fNama, email: fEmail, kelas: fKelas, jumlah: fJumlah, setuju: fSetuju };

function validasiField(nama) {
  const pesan = aturan[nama]();
  const el = inputPerField[nama];
  document.getElementById("err-" + nama).textContent = pesan;
  el.classList.toggle("invalid", Boolean(pesan));
  el.classList.toggle("valid", !pesan && el.type !== "checkbox");
  return pesan === "";
}

// Hitung biaya sesuai kelas dan jumlah peserta.
const formatRupiah = (n) => "Rp" + n.toLocaleString("id-ID");

function hitungTotal() {
  const opsi = fKelas.options[fKelas.selectedIndex];
  const harga = Number(opsi.dataset.harga || 0);
  const jumlah = Math.max(0, Number(fJumlah.value) || 0);
  elTotal.textContent = formatRupiah(harga * jumlah);
  return harga * jumlah;
}

// Tampilkan pesan untuk pengguna.
function tampilkanFeedback(pesan, jenis) {
  elFeedback.hidden = false;
  elFeedback.className = "feedback " + jenis;
  elFeedback.textContent = pesan;
}

// Perbarui daftar peserta di halaman.
function renderPeserta() {
  elDaftarPeserta.textContent = "";
  elJumlahDaftar.textContent = pendaftar.length;
  elKosong.hidden = pendaftar.length > 0;

  pendaftar.forEach((p, i) => {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.className = "info";
    const nama = document.createElement("strong");
    nama.textContent = p.nama;
    const detail = document.createElement("small");
    detail.textContent = `${p.kelas} · ${p.jumlah} orang · ${formatRupiah(p.total)}`;
    info.append(nama, detail);

    const hapus = document.createElement("button");
    hapus.type = "button";
    hapus.textContent = "Hapus";
    hapus.dataset.index = i; // Dipakai untuk menentukan peserta yang dihapus.

    li.append(info, hapus);
    elDaftarPeserta.appendChild(li);
  });
}

/* ================= EVENT LISTENERS ================= */

// Cek nama dan email saat diketik, lalu perbarui biaya saat jumlah berubah.
fNama.addEventListener("input", () => validasiField("nama"));
fEmail.addEventListener("input", () => validasiField("email"));
fJumlah.addEventListener("input", () => { validasiField("jumlah"); hitungTotal(); });

// Perbarui tampilan saat kelas atau persetujuan berubah.
fKelas.addEventListener("change", () => { validasiField("kelas"); hitungTotal(); });
fSetuju.addEventListener("change", () => validasiField("setuju"));

// Tampilkan jumlah karakter catatan.
fCatatan.addEventListener("input", () => {
  elHitung.textContent = `${fCatatan.value.length} / ${fCatatan.maxLength}`;
});

// Tombol untuk menambah atau mengurangi jumlah peserta.
document.getElementById("tambah").addEventListener("click", () => {
  fJumlah.value = Math.min(5, (Number(fJumlah.value) || 0) + 1);
  validasiField("jumlah");
  hitungTotal();
});
document.getElementById("kurang").addEventListener("click", () => {
  fJumlah.value = Math.max(1, (Number(fJumlah.value) || 2) - 1);
  validasiField("jumlah");
  hitungTotal();
});

// Kosongkan form dan kembalikan tampilannya seperti semula.
function resetForm() {
  form.reset();
  Object.values(inputPerField).forEach((el) => el.classList.remove("valid", "invalid"));
  Object.keys(aturan).forEach((k) => (document.getElementById("err-" + k).textContent = ""));
  elHitung.textContent = "0 / 100";
  elFeedback.hidden = true;
  hitungTotal();
}
document.getElementById("btn-reset").addEventListener("click", resetForm);

// Cek semua kolom sebelum menyimpan pendaftaran.
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Jangan muat ulang halaman.

  const hasil = Object.keys(aturan).map(validasiField);
  if (hasil.includes(false)) {
    tampilkanFeedback("Form belum lengkap. Periksa kolom yang ditandai merah.", "bad");
    form.querySelector(".invalid")?.focus();
    return;
  }

  const data = {
    nama: fNama.value.trim(),
    email: fEmail.value.trim().toLowerCase(),
    kelas: fKelas.value,
    jumlah: Number(fJumlah.value),
    catatan: fCatatan.value.trim(),
    total: hitungTotal(),
  };
  pendaftar.push(data);
  renderPeserta();
  tampilkanFeedback(`Terima kasih, ${data.nama}! Pendaftaran kelas "${data.kelas}" berhasil. Total ${formatRupiah(data.total)}.`, "ok");

  // Kosongkan kolom, tetapi biarkan pesan sukses tetap terlihat.
  form.reset();
  Object.values(inputPerField).forEach((el) => el.classList.remove("valid", "invalid"));
  elHitung.textContent = "0 / 100";
  hitungTotal();
});

// Hapus peserta yang tombolnya diklik.
elDaftarPeserta.addEventListener("click", (e) => {
  const tombol = e.target.closest("button[data-index]");
  if (!tombol) return;
  const [dihapus] = pendaftar.splice(Number(tombol.dataset.index), 1);
  renderPeserta();
  tampilkanFeedback(`Pendaftaran ${dihapus.nama} dihapus.`, "ok");
});

// Tampilkan biaya dan daftar awal saat halaman dibuka.
hitungTotal();
renderPeserta();