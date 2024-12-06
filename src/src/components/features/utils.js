export const toLowerCaseString = (str) => {
  return str.toLowerCase();
};

export const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const hitungMingguDanHari = (tanggalAwal, tanggalAkhir) => {
  const satuHari = 24 * 60 * 60 * 1000; // Satu hari dalam milidetik
  const awal = new Date(tanggalAwal);
  const akhir = new Date(tanggalAkhir);

  // Menghitung selisih dalam milidetik
  const selisihMilidetik = Math.abs(akhir - awal);

  // Menghitung jumlah hari
  const jumlahHari = Math.round(selisihMilidetik / satuHari);

  // Menghitung jumlah minggu dan sisa hari
  const minggu = Math.floor(jumlahHari / 7);
  const hari = jumlahHari % 7;

  console.log(`${minggu} minggu ${hari} hari`);
  return `${minggu} minggu ${hari} hari`;
};
