import React, { useState, useEffect, useRef } from "react";
import CardDashboard from "../components/dashboard/cardDashboard";
import TableDashboard from "../components/dashboard/tableDashboard";
import TableDashboardDivision from "../components/dashboard/tableDashboardDivision";
import { db } from "../config/firebase";
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
          const experienceCollectionRef = collection(doc.ref, "experience");
          const experienceSnapshot = await getDocs(experienceCollectionRef);
          let experienceData = [];
          experienceSnapshot.forEach((expDoc) => {
            experienceData.push({ id: expDoc.id, ...expDoc.data() });
          });
          employeeData.experience = experienceData;

          // Sub Collection Documentnya
          const documentsEmployeCollectionRef = collection(
            doc.ref,
            "documentsEmploye"
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

        console.log(employeesData);
        const dataFormat = employeesData.map((data) => ({
          ...data,
          sisaKontrak: sisaMasaKontrakHari(tanggal, data.tanggalAkhirKontrak),
          lamaKerja: sisaMasaKontrakHari(data.tanggalAwalKontrak, tanggal),
        }));

        const dataBerakhir = dataFormat.filter((data) => data.sisaKontrak < 90);
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
              }\n<b>Tanggal Awal Kontrak : </b> ${formatTanggal(
                p.tanggalAwalKontrak
              )}\n<b>Tanggal Akhir Kontrak : </b> ${formatTanggal(
                p.tanggalAkhirKontrak
              )} \n<b>Sisa Kontrak : </b> ${sisaMasaKontrak(
                tanggal,
                p.tanggalAkhirKontrak
              )}\n<b>Status : </b>${p.statusKaryawan}`
          )
          .join("\n-----------------------------------------------\n\n");

        const text = ` <b>Karyawan Dengan Sisa Masa Kontrak Kurang Dari 3 Bulan: </b>
          \n\n${listKaryawan}`;

        if (dataBerakhir.length > 0 && !isKirim) {
          await sendMessage(text);
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
