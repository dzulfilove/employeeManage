import React, { useState, useEffect, useRef } from "react";
import CardDashboard from "../../components/dashboard/cardDashboard";
import TableDashboard from "../../components/dashboard/tableDashboard";
import TableDashboardDivision from "../../components/dashboard/tableDashboardDivision";
import { db } from "../../config/firebase";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const EndedContract = () => {
  const idPerusahaan = sessionStorage.getItem("refPerusahaan");
  const hasRun = useRef(false);

  const [dataEmployees, setDataEmployees] = useState([]);
  const [totalKaryawan, setTotalKaryawan] = useState(0);
  const [totalAkanBerakhir, setTotalAkanBerakhir] = useState(0);
  const [tanggal, setTanggal] = useState(
    dayjs().locale("id").format("YYYY/MM/DD")
  );
  const [isKirim, setIsKirim] = useState(false);

  useEffect(() => {
    if (!hasRun.current) {
      sendHandle();

      hasRun.current = true;
    }
  }, []);

  const sendHandle = async () => {
    await getAllEmployees();
    if (isKirim == true) {
      alert("hahaha");
    }
  };
  const getAllEmployees = async () => {
    if (!isKirim) {
      try {
        const querySnapshot = await getDocs(collection(db, "employees"));

        if (querySnapshot.empty) {
          console.log("Tidak ada dokumen yang ditemukan.");
          return;
        }

        let employeesData = [];
        for (const doc of querySnapshot.docs) {
          const employeeData = { id: doc.id, ...doc.data() };

          // Sub Collection Pengalaman
          const experienceCollectionRef = collection(
            doc.ref,
            "pengalamanKerja"
          );
          const experienceSnapshot = await getDocs(experienceCollectionRef);
          let experienceData = [];
          experienceSnapshot.forEach((expDoc) => {
            experienceData.push({ id: expDoc.id, ...expDoc.data() });
          });
          employeeData.experience = experienceData;

          // Sub Collection Documentnya
          const documentsEmployeCollectionRef = collection(
            doc.ref,
            "dokumenKaryawan"
          );
          const documentsEmployeSnapshot = await getDocs(
            documentsEmployeCollectionRef
          );
          let documentsEmployeData = [];
          documentsEmployeSnapshot.forEach((docDoc) => {
            documentsEmployeData.push({ id: docDoc.id, ...docDoc.data() });
          });
          employeeData.documentsEmploye = documentsEmployeData;

          employeesData.push(employeeData);
        }
        let hasilCek = await cekDanKumpulkanData(employeesData);
        let textDokumen = hasilCek.map((item) => {
          let dokumenStr = item.documentsEmploye
            .map(
              (doc) =>
                `     <b>Nama Dokumen :</b> ${
                  doc.namaDokumen
                }<b>, Tanggal Berakhir :</b> ${formatTanggal(
                  doc.tanggalBerakhirDokumen
                )}`
            )
            .join("\n ");
          return `<b>Nama :</b> ${item.nama} \n<b>Posisi </b>: ${item.posisi}\n<b>Divisi </b>: ${item.divisi}\n<b>Dokumen :</b> \n ${dokumenStr}`;
        });
        let gabungText = textDokumen.join("\n\n");
        console.log(employeesData, "data Karyawan");
        console.log(hasilCek, "data Dokumen ");
        console.log(gabungText, "text Dokumen ");
        const dataFormat = employeesData.map((data) => ({
          ...data,
          sisaKontrak: sisaMasaKontrakHari(tanggal, data.tanggalAkhirKontrak),
          lamaKerja: sisaMasaKontrakHari(data.tanggalAwalKontrak, tanggal),
        }));

        const dataBerakhir = dataFormat.filter(
          (data) =>
            data.sisaKontrak < 90 &&
            data.sisaKontrak > 0 &&
            data.statusKaryawan != "Karyawan Tetap"
        );
        const dataBerakhir6Bulan = dataFormat.filter(
          (data) =>
            data.sisaKontrak < 180 &&
            data.sisaKontrak > 89 &&
            data.statusKaryawan != "Karyawan Tetap"
        );
        console.log(dataBerakhir, "data Baru Format");

        setDataEmployees(dataFormat);
        setTotalKaryawan(dataFormat.length);
        setTotalAkanBerakhir(dataBerakhir.length);
        setIsKirim(true);

        const listKaryawan = dataBerakhir
          .map(
            (p) =>
              `<b>Nama</b> : ${p.nama}\n<b>Posisi :</b> ${
                p.posisi
              }\n<b>Divisi :</b>${p.divisi}\n<b>Lokasi Kerja :</b>${
                p.cabang
              } \n<b>Sisa Kontrak : </b> ${sisaMasaKontrak(
                tanggal,
                p.tanggalAkhirKontrak
              )}\n<b>Status : </b>${p.statusKaryawan}`
          )
          .join("\n-----------------------------------------------\n\n");

        const listKaryawan6Bulan = dataBerakhir6Bulan
          .map(
            (p) =>
              `<b>Nama</b> : ${p.nama}\n<b>Posisi :</b> ${
                p.posisi
              }\n<b>Divisi :</b>${p.divisi}\n<b>Lokasi Kerja :</b>${
                p.cabang
              } \n<b>Sisa Kontrak : </b> ${sisaMasaKontrak(
                tanggal,
                p.tanggalAkhirKontrak
              )}\n<b>Status : </b>${p.statusKaryawan}`
          )
          .join("\n-----------------------------------------------\n\n");

        const dataJumlah = groupByPosition(dataBerakhir6Bulan);
        const text = ` <b>Karyawan Dengan Sisa Masa Kontrak Kurang Dari 3 Bulan: </b>
          \n\n${listKaryawan}`;

        const text6Bulan = ` <b>Karyawan Dengan Sisa Masa Kontrak Kurang Dari 6 Bulan: </b>
          \n\n${listKaryawan6Bulan}`;
        const textHeader = `<b>Daftar Kontrak Karyawan Akan Berakhir Berdasarkan Posisi</b>\n\n-------------------------------------------------\n${dataJumlah}`;
        console.log(dataBerakhir6Bulan, "6 bulan");
        if (dataBerakhir.length > 0 && !isKirim) {
          await sendMessage(textHeader);
          await sendMessage(text);
        }

        if (dataBerakhir6Bulan.length > 0 && !isKirim) {
          await sendMessage(text6Bulan);
        }
        if (hasilCek.length > 0) {
          await sendMessage(
            `<b>Dokumen Karyawan Dengan Masa Aktif Akan Berakhir </b> \n\n${gabungText}`
          );
        }
        console.log(listKaryawan, "textSend");
      } catch (error) {
        console.error("Error fetching employees:", error.message);
      }
    }
  };

  const sendMessage = async (text) => {
    try {
      const response = await fetch(
        "https://api.telegram.org/bot6918610122:AAGJA-pXg0oJwoAELrW0prubAAd4p0LSy8o/sendMessage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: "6546310886",
            text: text,
            parse_mode: "html",
          }),
        }
      );

      if (response.ok) {
        console.log("Berhasil Dikirmkan");
        setIsKirim(true);
      } else {
        console.log("Gagal mengirim pesan");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const sisaMasaKontrak = (startDate, endDate) => {
    const start = dayjs(startDate, "YYYY/MM/DD");
    const end = dayjs(endDate, "YYYY/MM/DD");

    let yearDiff = end.year() - start.year();
    let monthDiff = end.month() - start.month();
    let dayDiff = end.date() - start.date();

    // Adjust the monthDiff if dayDiff is negative
    if (dayDiff < 0) {
      monthDiff--;
      dayDiff += start.daysInMonth();
    }

    // Adjust the yearDiff and monthDiff if monthDiff is negative
    if (monthDiff < 0) {
      yearDiff--;
      monthDiff += 12;
    }

    const totalMonths = yearDiff * 12 + monthDiff;

    if (totalMonths < 3) {
      return `${totalMonths} bulan ${dayDiff} hari`;
    } else {
      return `${totalMonths} bulan`;
    }
  };

  // Format data

  const sisaMasaKontrakHari = (startDate, endDate) => {
    const start = dayjs(startDate, "YYYY/MM/DD");
    const end = dayjs(endDate, "YYYY/MM/DD");

    const diffInDays = end.diff(start, "day");

    return diffInDays - 1;
  };
  // Fungsi untuk menghitung selisih hari antara dua tanggal
  function hitungSelisihHari(tanggal1, tanggal2) {
    const satuHari = 24 * 60 * 60 * 1000; // Satu hari dalam milidetik
    const tgl1 = new Date(tanggal1);
    const tgl2 = new Date(tanggal2);
    const selisih = Math.round(Math.abs((tgl1 - tgl2) / satuHari));
    return selisih;
  }

  const splitArrayInHalf = (array) => {
    const midpoint = Math.ceil(array.length / 2); // Membulatkan ke atas untuk membagi dengan rata jika array memiliki jumlah elemen ganjil
    const firstHalf = array.slice(0, midpoint); // Bagian pertama dari array
    const secondHalf = array.slice(midpoint); // Bagian kedua dari array
    return [firstHalf, secondHalf];
  };
  // Fungsi untuk melakukan pengecekan dan pengumpulan data
  function cekDanKumpulkanData(arrayObjek) {
    const hasil = [];

    arrayObjek.forEach((objek) => {
      const dataRelevan = {
        nama: objek.nama,
        posisi: objek.posisi,
        divisi: objek.divisi,
        documentsEmploye: [],
      };

      objek.documentsEmploye.forEach((dokumen) => {
        const tanggalBerakhirDokumen = dokumen.tanggalBerakhirDokumen;
        const selisihHari = hitungSelisihHari(
          new Date(),
          new Date(tanggalBerakhirDokumen)
        );

        if (selisihHari < 5 && dokumen.kategoriDokumen == "Perizinan") {
          dataRelevan.documentsEmploye.push({
            namaDokumen: dokumen.namaDokumen,
            tanggalBerakhirDokumen: tanggalBerakhirDokumen,
          });
        }
      });

      if (dataRelevan.documentsEmploye.length > 0) {
        hasil.push(dataRelevan);
      }
    });

    return hasil;
  }

  function groupByPosition(arr) {
    const grouped = arr.reduce((acc, obj) => {
      if (!acc[obj.posisi]) {
        acc[obj.posisi] = 0;
      }
      acc[obj.posisi]++;
      return acc;
    }, {});

    let result = "";
    for (const [posisi, count] of Object.entries(grouped)) {
      result += `${posisi} : ${count} orang\n`;
    }

    return result.trim();
  }

  const formatTanggal = (tanggal) => {
    // Parsing tanggal dengan format "DD-MM-YYYY"
    const parsedDate = dayjs(tanggal, "YYYY/MM/DD");

    // Ambil nama hari dan bulan dalam bahasa Indonesia
    const hari = parsedDate.locale("id").format("dddd");
    const bulan = parsedDate.locale("id").format("MMMM");

    // Format ulang tanggal sesuai keinginan
    const hasil =
      parsedDate.format("DD") + " " + bulan + " " + parsedDate.format("YYYY");

    return hasil;
  };
  return <div></div>;
};

export default EndedContract;
