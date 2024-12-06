import React, { useEffect, useState } from "react";
import "../../styles/card.css";
import DropdownSearch from "../features/dropdown";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/id";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import { generateRandomString } from "../features/utils";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, dbImage } from "../../config/firebase";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];
function CardDetailEmployee(props) {
  const [preview, setPreview] = useState(props.data.fotoTerbaru);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSet, setIsSet] = useState(false);
  const [tanggal, setTanggal] = useState(
    dayjs().locale("id").format("YYYY/MM/DD")
  );
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nik, setNik] = useState("");
  const [noTelpon, setNoTelpon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [riwayatPendidikan, setRiwayatPendidikan] = useState("");
  const [posisi, setPosisi] = useState("");
  const [posisiLain, setPosisiLain] = useState("");
  const [divisi, setDivisi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [status, setStatus] = useState("");
  const [gaji, setGaji] = useState(0);
  const [masakerja, setMasaKerja] = useState(0);
  const [tanggalAwalKontrak, setTanggalAwalKontrak] = useState(
    dayjs().locale("id").format("DD/MM/YYYY")
  );
  const [tanggalAkhirKontrak, setTanggalAkhirKontrak] = useState(
    dayjs().locale("id").format("DD/MM/YYYY")
  );
  const [tanggalAwal, setTanggalAwal] = useState(dayjs().locale("id"));
  const [tanggalAkhir, setTanggalAkhir] = useState(dayjs().locale("id"));
  const [noRekening, setNoRekening] = useState(0);
  const [kontakLain, setKontakLain] = useState(0);
  const [tanggalLahir, setTanggalLahir] = useState(
    dayjs().locale("id").format("DD/MM/YYYY")
  );
  const [tanggalAwalMasuk, setTanggalAwalMasuk] = useState(
    dayjs().locale("id").format("DD/MM/YYYY")
  );
  const optionPendidikan = [
    { value: "SD", text: "SD" },
    { value: "SMP", text: "SMP" },
    { value: "SMA", text: "SMA" },
    { value: "D3", text: "D3" },
    { value: "S1", text: "S1" },
    { value: "S2", text: "S2" },
  ];

  const optionStatus = [
    { value: "Karyawan Kontrak", text: "Karyawan Kontrak" },
    { value: "Karyawan Tetap", text: "Karyawan Tetap" },
    { value: "Karyawan Magang", text: "Karyawan Magang" },
    { value: "Karyawan Pelatihan", text: "Karyawan Pelatihan" },
    { value: "Karyawan Uji Coba", text: "Karyawan Uji Coba" },
    { value: "Karyawan Tidak Aktif", text: "Karyawan Tidak Aktif" },
  ];

  useEffect(() => {
    // setData();
    // you can use the userData here, or set it to state using setUser
  }, []);

  const setData = () => {
    setIsEdit(!isEdit);

    setPreview(props.data.fotoTerbaru);
    setName(props.data.nama);
    setEmail(props.data.email);
    setNik(props.data.nik);
    setNoTelpon(props.data.nomorWhatsapp);
    setAlamat(props.data.alamat);
    setKontakLain(props.data.kontakLain);
    setNoRekening(props.data.noRekening);
    setTanggalAwalMasuk(
      props.data.tanggalAwalMasuk ? props.data.tanggalAwalMasuk : tanggal
    );
    setTanggalLahir(
      props.data.tanggalLahir ? props.data.tanggalLahir : tanggalLahir
    );
    setGaji(props.data.gaji ? props.data.gaji : 0);
    setMasaKerja(props.data.masaKerja ? props.data.masaKerja : 0);
    setTanggalAwalKontrak(
      props.data.tanggalAwalKontrak ? props.data.tanggalAwalKontrak : tanggal
    );
    setTanggalAkhirKontrak(
      props.data.tanggalAkhirKontrak ? props.data.tanggalAkhirKontrak : tanggal
    );

    const lokasiSelect = props.dataLokasi.filter(
      (item) => item.text == props.data.cabang
    );

    const divisiSelect = props.dataDivisi.filter(
      (item) => item.text == props.data.divisi
    );

    const pendidikanSelect = optionPendidikan.filter(
      (item) => item.value == props.data.riwayatPendidikan
    );

    const statusSelect = optionStatus.filter(
      (item) => item.value == props.data.statusKaryawan
    );
    const statusPosisi = props.dataPosisi.filter(
      (item) => item.text == props.data.posisi
    );

    console.log(props.data.posisi, "lokasi2");
    setDivisi(divisiSelect.length > 0 ? divisiSelect[0] : "");
    setRiwayatPendidikan(
      pendidikanSelect.length > 0 ? pendidikanSelect[0] : ""
    );
    setLokasi(lokasiSelect.length > 0 ? lokasiSelect[0] : "");
    setStatus(statusSelect.length > 0 ? statusSelect[0] : "");
    setPosisi(statusPosisi.length > 0 ? statusPosisi[0] : "");
    setIsSet(true);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleChangeDate = (name, date) => {
    const dayjsDate = dayjs(date);

    if (!dayjsDate.isValid()) {
      return;
    }

    const formattedDate = dayjsDate.format("YYYY/MM/DD");
    if (name === "startKontrak") {
      setTanggalAwal(formattedDate);
      setTanggalAwalKontrak(formattedDate);
    } else if (name === "endKontrak") {
      setTanggalAkhir(formattedDate);

      setTanggalAkhirKontrak(formattedDate);
    } else if (name === "tanggalMasuk") {
      setTanggalAwalMasuk(formattedDate);
    } else {
      setTanggalLahir(formattedDate);
    }
  };
  const handleSaveFoto = async (file) => {
    if (!file) {
      throw new Error("File not found");
    }
    const random = generateRandomString(12);
    const storageRef = ref(
      dbImage,
      `fotoPegawai/karyawan-${random}-${file.name}`
    );

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const perpanjangKontrak = async () => {
    const tanggalStart = tambahSatuTahun(props.data.tanggalAwalKontrak);
    const tanggalEnd = tambahSatuTahun(props.data.tanggalAkhirKontrak);
    let waktuKerja = parseInt(props.data.masaKerja) + 0;
    const lamaKerja = sisaMasaKontrak(
      props.data.tanggalAwalKontrak,
      props.data.tanggalAkhirKontrak
    );
    if (lamaKerja > 355) {
      waktuKerja = parseInt(props.data.masaKerja) + 1;
    }
    try {
      const eventRef = doc(db, "employees", props.id);
      await updateDoc(eventRef, {
        tanggalAwalKontrak: props.data.tanggalAkhirKontrak,
        tanggalAkhirKontrak: tanggalEnd,
        masaKerja: waktuKerja,
      });
      Swal.fire({
        title: "Berhasil",
        text: "Anda Berhasil Memperpanjang Kontrak Karyawan ",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          props.getDataEmployee(props.id);
          setIsEdit(false);
        }
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const berhentikanKontrak = async () => {
    try {
      const eventRef = doc(db, "employees", props.id);
      await updateDoc(eventRef, {
        statusKaryawan: "Karyawan Tidak Aktif",
        tanggalBerhentiKontrak: tanggal,
      });
      Swal.fire({
        title: "Berhasil",
        text: "Anda Berhasil Memberhentikan Kontrak Karyawan ",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          props.getDataEmployee(props.id);
          setIsEdit(false);
        }
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(divisi, "div");
    const cek = await handleCheckEmptyFields();
    const umur = await hitungSelisihTahun(tanggalLahir, tanggal);
    const tahunKerja = await hitungSelisihTahun(tanggalAwalMasuk, tanggal);
    if (cek == false) {
      try {
        // Upload gambar baru (jika ada)
        if (selectedFile !== null) {
          const imageUrl = await handleSaveFoto(selectedFile);

          const data = {
            email: email,
            nama: name,
            nik,
            alamat,
            nomorWhatsapp: noTelpon,
            cabang: lokasi.text,
            riwayatPendidikan: riwayatPendidikan.text,
            gaji,
            divisi: divisi.text,
            masaKerja: masakerja,
            tanggalLahir,
            tanggalAwalMasuk,
            noRekening,
            kontakLain,
            tanggalAwalKontrak: tanggalAwalKontrak,
            tanggalAkhirKontrak: tanggalAkhirKontrak,
            statusKaryawan: status.text,
          };

          console.log(data, "update");
          let posisiKerja = "";
          if (posisi.text == "Lainnya") {
            alert("lainnya");

            posisiKerja = posisiLain;
            const division = {
              namaPosisi: posisiLain,
            };
            const divisionRef = await addDoc(
              collection(db, "divisions"),
              division
            );
            props.getDataPosisi();

            console.log(divisionRef);
          } else {
            posisiKerja = posisi.text;
          }
          // Update properti foto_tindakan pada dokumen tindakan yang sesuai
          const eventRef = doc(db, "employees", props.id);
          await updateDoc(eventRef, {
            email: email,
            nama: name,
            nik,
            alamat,
            nomorWhatsapp: noTelpon,
            posisi: posisiKerja,
            cabang: lokasi.text,
            riwayatPendidikan: riwayatPendidikan.text,
            gaji,
            divisi: divisi.text,
            masaKerja: tahunKerja,
            umur: umur,
            tanggalLahir,
            tanggalAwalMasuk,
            noRekening,
            kontakLain,
            tanggalAwalKontrak: tanggalAwalKontrak,
            tanggalAkhirKontrak: tanggalAkhirKontrak,
            statusKaryawan: status.text,
            fotoTerbaru: imageUrl,
          });
        } else {
          const data = {
            email: email,
            nama: name,
            nik,
            alamat,
            nomorWhatsapp: noTelpon,
            cabang: lokasi.text,
            riwayatPendidikan: riwayatPendidikan.text,
            gaji,
            divisi: divisi.text,
            masaKerja: masakerja,
            tanggalLahir,
            tanggalAwalMasuk,
            noRekening,
            kontakLain,
            tanggalAwalKontrak: tanggalAwalKontrak,
            tanggalAkhirKontrak: tanggalAkhirKontrak,
            statusKaryawan: status.text,
          };
          console.log(data, "update");
          let posisiKerja = "";
          if (posisi.text == "Lainnya") {
            posisiKerja = posisiLain;
            const division = {
              namaPosisi: posisiLain,
            };
            const divisionRef = await addDoc(
              collection(db, "divisions"),
              division
            );
            props.getDataPosisi();
          } else {
            posisiKerja = posisi.text;
          }
          // Jika tidak ada gambar baru, hanya perbarui properti nama_tindakan dan deskripsi_tindakan
          const eventRef = doc(db, "employees", props.id);
          await updateDoc(eventRef, {
            email: email,
            nama: name,
            nik,
            alamat,
            nomorWhatsapp: noTelpon,
            posisi: posisiKerja,
            cabang: lokasi.text,
            riwayatPendidikan: riwayatPendidikan.text,
            gaji,
            divisi: divisi.text,
            masaKerja: tahunKerja,
            umur: umur,
            tanggalLahir,
            tanggalAwalMasuk,
            noRekening,
            kontakLain,
            tanggalAwalKontrak: tanggalAwalKontrak,
            tanggalAkhirKontrak: tanggalAkhirKontrak,
            statusKaryawan: status.text,
          });
        }
        Swal.fire({
          title: "Berhasil",
          text: "Anda Berhasil Merubah data",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            props.getDataEmployee(props.id);
            setIsEdit(false);
            setData();
          }
        });
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  function ubahFormatTanggal(tanggal) {
    // Memisahkan string tanggal berdasarkan karakter '/'
    const [tahun, bulan, hari] = tanggal.split("/");

    // Menggabungkan kembali dalam format DD/MM/YYYY
    const formatBaru = `${hari}/${bulan}/${tahun}`;

    return formatBaru;
  }
  const sisaMasaKontrak = (startDate, endDate) => {
    const start = dayjs(startDate, "YYYY/MM/DD");
    const end = dayjs(endDate, "YYYY/MM/DD");

    const diffInDays = end.diff(start, "day");

    return diffInDays - 1;
  };
  function hitungSelisihTahun(tanggalAwal, tanggalAkhir) {
    const awal = new Date(tanggalAwal);
    const akhir = new Date(tanggalAkhir);

    let selisihTahun = akhir.getFullYear() - awal.getFullYear();

    // Periksa jika bulan/tanggal pada tahun akhir belum mencapai bulan/tanggal pada tahun awal
    if (
      akhir.getMonth() < awal.getMonth() ||
      (akhir.getMonth() === awal.getMonth() && akhir.getDate() < awal.getDate())
    ) {
      selisihTahun--;
    }

    return selisihTahun;
  }
  function tambahSatuTahun(tanggal) {
    // Memisahkan string tanggal berdasarkan karakter '/'
    let [tahun, bulan, hari] = tanggal.split("/");

    // Mengubah tahun dari string ke integer dan menambah satu tahun
    tahun = parseInt(tahun) + 1;

    // Menggabungkan kembali dalam format YYYY/MM/DD
    const tanggalBaru = `${tahun}/${bulan}/${hari}`;

    return tanggalBaru;
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

  const handleCheckEmptyFields = () => {
    const emptyFields = [];
    const fieldsToCheck = [
      { key: "name", label: "Nama" },
      { key: "email", label: "Email" },
      { key: "nik", label: "NIK" },
      { key: "noTelpon", label: "Nomor WhatsApp" },
      { key: "kontakLain", label: "Kontak Lain" },
      { key: "noRekening", label: "No Rekening" },
      { key: "alamat", label: "Alamat" },
      { key: "riwayatPendidikan", label: "Riwayat Pendidikan" },
      { key: "posisi", label: "Posisi" },
      { key: "divisi", label: "Divisi" },
      { key: "lokasi", label: "Lokasi Kerja" },
      { key: "status", label: "Status Karyawan" },
      { key: "gaji", label: "Gaji" },
      { key: "tanggalAwalKontrak", label: "Tanggal Awal Kontrak" },
      { key: "tanggalAkhirKontrak", label: "Tanggal Akhir Kontrak" },
      { key: "tanggalLahir", label: "Tanggal Lahir" },
      { key: "tanggalAwalMasuk", label: "Tanggal Awal Kerja" },
    ];

    fieldsToCheck.forEach((field) => {
      if (
        field.key === "gaji" || field.key === "masakerja"
          ? eval(field.key) === 0
          : eval(field.key) === "" || eval(field.key) === null
      ) {
        console.log(field.label, eval(field.key));
        emptyFields.push(field.label);
      }
    });

    if (emptyFields.length > 0) {
      Swal.fire({
        title: "Data Tidak Lengkap",
        text: `Field berikut harus diisi: ${emptyFields.join(", ")}`,
        icon: "warning",
        button: "OK",
      });

      return true;
    } else {
      return false;
    }
  };

  const formatRupiah = (angka) => {
    const nilai = parseFloat(angka);
    return nilai.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  console.log(posisi, "divisi");
  return (
    <div className="flex w-full  justify-center items-center">
      <div
        data-aos="fade-down"
        data-aos-delay="50"
        className="w-[97%] flex flex-col justify-between items-end  rounded-lg relative playing border-2 border-slate-600 overflow-hidden shadow-xl mt-10"
      >
        <div className="w-full flex justify-center items-center left-0 m-0 p-0  bg-white rounded-lg absolute opacity-5 h-full"></div>
        <div className="w-[25rem] h-[25rem] opacity-10 rounded-full blur-3xl bg-white absolute left-[5%] top-[5%]"></div>
        <div className="flex justify-end w-[53%] gap-8 pt-8 px-14 mr-14 pb-10 border-b-2 border-b-slate-500">
          {isEdit ? (
            <>
              <button
                class="button-add "
                onClick={() => {
                  setIsEdit(false);
                }}
              >
                Batalkan
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </button>
              <button class="button-add" onClick={handleSubmit}>
                Simpan Perubahan
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </button>
            </>
          ) : (
            <>
              <button
                class="button-add "
                onClick={() => {
                  setData();
                }}
              >
                Perbarui
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </button>
            </>
          )}
        </div>
        <div className="w-[100%] flex flex-col xl:flex-row  justify-between items-start pb-8 gap-12  rounded-lg relative playing  overflow-hidden shadow-xl mb-6">
          <div
            data-aos="fade-down"
            data-aos-delay="250"
            className="flex flex-col justify-center items-center xl:items-start w-[100%] xl:w-[30%] p-8 gap-8 text-white"
          >
            <div className="card-profile ">
              <div className="content-profile ">
                <div className="back">
                  <div className="back-content">
                    <div
                      className={`flex justify-center items-center rounded-full  ${
                        sisaMasaKontrak(
                          tanggal,
                          props.data.tanggalAkhirKontrak
                        ) < 90 &&
                        isEdit == false &&
                        props.data.statusKaryawan !== "Karyawan Tetap"
                          ? "w-[12rem] h-[12rem]"
                          : "w-[15rem] h-[15rem]"
                      } z-[99] `}
                    >
                      <img
                        className="object-cover h-full w-full rounded-full"
                        src={isEdit ? preview : props.data.fotoTerbaru}
                      />
                    </div>
                    {isEdit && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          className="border border-slate-300 text-md rounded-lg w-[15rem] mt-4"
                          onChange={handleFileChange}
                        />
                      </>
                    )}
                    <div className="flex w-full justify-start items-start px-8 flex-col gap-2 z-[99] mt-6 ">
                      <h2 className="text-white font-semibold text-lg capitalize">
                        {props.data.nama} ({props.data.umur} Tahun)
                      </h2>
                      <h2 className="text-white font-normal text-sm">
                        {props.data.posisi}
                      </h2>
                      <h2 className="text-white font-semibold text-lg mt-6">
                        Team
                      </h2>

                      <div className=" flex w-full justify-start  items-start gap-6  ">
                        <div className=" flex  justify-center text-sm text-slate-300  items-center gap-2 mt-4  flex-col  border-slate-400 border p-2 rounded-lg">
                          {props.data.divisi}
                        </div>
                        <div className=" flex  justify-center text-sm text-slate-300  items-center gap-2 mt-4  flex-col  border-slate-400 border p-2 rounded-lg">
                          {props.data.cabang}
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full justify-center items-center px-8 flex-col gap-2 z-[99]  ">
                      {sisaMasaKontrak(
                        tanggal,
                        props.data.tanggalAkhirKontrak
                      ) < 90 &&
                        props.data.statusKaryawan !== "Karyawan Tidak Aktif" &&
                        props.data.statusKaryawan !== "Karyawan Tetap" &&
                        isEdit == false && (
                          <>
                            <button
                              class="button-add mt-4"
                              onClick={perpanjangKontrak}
                            >
                              Perpanjang Kontrak
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                            </button>
                          </>
                        )}
                      {props.data.statusKaryawan !== "Karyawan Tidak Aktif" &&
                        props.data.statusKaryawan !== "Karyawan Tetap" &&
                        isEdit == false && (
                          <>
                            <button
                              class="button-add mt-4"
                              onClick={berhentikanKontrak}
                            >
                              Berhentikan Kontrak
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                            </button>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" xl:w-[60%] w-full">
            {isEdit ? (
              <>
                <div
                  // data-aos="fade-down"
                  data-aos-delay="350"
                  className="flex flex-col justify-start  items-start p-6 w-[100%]  gap-2 text-white overflow-y-scroll  h-[45rem]"
                >
                  <div className="w-full gap-2 flex justify-between items-center p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Nama</h4>

                      <input
                        type="text"
                        className="w-full text-sm flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      />
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Email</h4>
                      <input
                        type="text"
                        className="w-full text-sm flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full gap-2 flex justify-between items-center p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">NIK</h4>
                      <input
                        type="text"
                        className="w-full text-sm flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                        value={nik}
                        onChange={(e) => {
                          setNik(e.target.value);
                        }}
                      />
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Posisi</h4>
                      <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                        <DropdownSearch
                          options={props.dataPosisi}
                          value={posisi}
                          change={(data) => {
                            setPosisi(data);
                          }}
                          name={"Posisi"}
                        />
                      </div>

                      {posisi.text == "Lainnya" && (
                        <>
                          <input
                            type="text"
                            placeholder="Masukkan Posisi"
                            className="w-full flex p-2 text-sm bg-slate-700 font-normal border-slate-500 border capitalize rounded-lg justify-start items-center h-[3rem]"
                            onChange={(e) => {
                              setPosisiLain(e.target.value);
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="w-full gap-2 flex justify-between items-start p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">No. WhatsApp</h4>
                      <input
                        type="text"
                        className="w-full flex p-2 text-sm bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                        value={noTelpon}
                        onChange={(e) => {
                          setNoTelpon(e.target.value);
                        }}
                      />
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Alamat</h4>

                      <textarea
                        className="w-full p-2 text-sm bg-slate-700 text-white border-slate-500 border rounded-lg min-h-[3rem] h-[5rem] resize-none font-normal"
                        value={alamat}
                        onChange={(e) => {
                          setAlamat(e.target.value);
                        }}
                        placeholder="Type your text here..."
                      />
                    </div>
                  </div>
                  <div className="w-full gap-2 flex justify-between items-start p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">
                        Kontak Lain Yang Dapat Dihubungi
                      </h4>
                      <input
                        type="number"
                        className="w-full flex p-2 text-sm bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                        value={kontakLain}
                        onChange={(e) => {
                          setKontakLain(e.target.value);
                        }}
                      />
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2   ">
                      <h4 className="font-semibold text-sm">Tanggal Lahir</h4>
                      <Space direction="vertical" size={12}>
                        <DatePicker
                          defaultValue={dayjs(
                            ubahFormatTanggal(tanggalLahir),
                            dateFormatList[0]
                          )}
                          format={dateFormatList}
                          onChange={(date) => {
                            handleChangeDate("tanggalLahir", date);
                          }}
                          className="bg-slate-700 text-white border border-slate-500 w-[18.4rem] p-3 hover:text-slate-800 active:text-slate-800"
                        />
                      </Space>
                    </div>
                  </div>
                  <div className="w-full gap-2 flex justify-between items-start p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Lokasi Kerja</h4>
                      <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                        <DropdownSearch
                          options={props.dataLokasi}
                          value={lokasi}
                          change={(data) => {
                            setLokasi(data);
                          }}
                          name={"Lokasi Kerja"}
                        />
                      </div>
                    </div>

                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Divisi</h4>
                      <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                        <DropdownSearch
                          options={props.dataDivisi}
                          value={divisi}
                          change={(data) => {
                            setDivisi(data);
                          }}
                          name={"Divisi"}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-6 p-4 flex justify-between items-start ">
                    <div className="w-[50%] flex justify-start gap-6 flex-col">
                      <h4 className="font-semibold text-sm">
                        Tanggal Awal Kontrak
                      </h4>
                      <Space direction="vertical" size={12}>
                        <DatePicker
                          defaultValue={dayjs(
                            props.data.tanggalAwalKontrak
                              ? ubahFormatTanggal(props.data.tanggalAwalKontrak)
                              : ubahFormatTanggal(tanggal),
                            dateFormatList[0]
                          )}
                          onChange={(date) => {
                            handleChangeDate("startKontrak", date);
                          }}
                          format={dateFormatList}
                          className="bg-slate-700 text-sm text-white border border-slate-500 w-[100%] p-3 hover:text-slate-800 active:text-slate-800"
                        />
                      </Space>
                    </div>
                    <div className="w-[50%] flex justify-start  gap-6 flex-col">
                      <h4 className="font-semibold text-sm">
                        Tanggal Akhir Kontrak
                      </h4>
                      <Space direction="vertical" size={12}>
                        <DatePicker
                          defaultValue={dayjs(
                            props.data.tanggalAkhirKontrak
                              ? ubahFormatTanggal(
                                  props.data.tanggalAkhirKontrak
                                )
                              : ubahFormatTanggal(tanggal),
                            dateFormatList[0]
                          )}
                          onChange={(date) => {
                            handleChangeDate("endKontrak", date);
                          }}
                          format={dateFormatList}
                          className="bg-slate-700 text-white border border-slate-500 w-[100%] p-3 hover:text-slate-800 active:text-slate-800"
                        />
                      </Space>
                    </div>
                  </div>
                  <div className="w-full gap-2 flex justify-between items-start p-2">
                    <div className="w-[50%] flex justify-start gap-6 flex-col">
                      <h4 className="font-semibold text-sm">
                        Tanggal Awal Kerja
                      </h4>
                      <Space direction="vertical" size={12}>
                        <DatePicker
                          defaultValue={dayjs(tanggalAwal, dateFormatList[0])}
                          format={dateFormatList}
                          onChange={(date) => {
                            handleChangeDate("tanggalMasuk", date);
                          }}
                          className="bg-slate-700 text-white border border-slate-500 w-[100%] p-3 hover:text-slate-800 active:text-slate-800"
                        />
                      </Space>
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">
                        Pendidikan Terakhir
                      </h4>
                      <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                        <DropdownSearch
                          options={optionPendidikan}
                          value={riwayatPendidikan}
                          change={(data) => {
                            setRiwayatPendidikan(data);
                          }}
                          name={"Pendidikan terakhir"}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-2 flex justify-between items-start p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">
                        Masa Kerja (Tahun)
                      </h4>
                      <input
                        type="number"
                        className="w-full flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                        value={masakerja}
                        onChange={(e) => {
                          setMasaKerja(e.target.value);
                        }}
                      />
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Nomor Rekening</h4>
                      <input
                        type="number"
                        className="w-full flex p-2 text-sm bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                        value={noRekening}
                        onChange={(e) => {
                          setNoRekening(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full gap-2 flex justify-between items-start p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Gaji</h4>
                      <input
                        type="number"
                        className="w-full text-sm flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                        value={gaji}
                        onChange={(e) => {
                          setGaji(e.target.value);
                        }}
                      />
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Status Karyawan</h4>
                      <div className="w-full gap-2 text-sm flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                        <DropdownSearch
                          change={(data) => {
                            setStatus(data);
                          }}
                          options={optionStatus}
                          value={status}
                          name={"Status Karyawan"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  // data-aos="fade-down"
                  data-aos-delay="350"
                  className="flex flex-col justify-start items-start p-6 w-[100%]  gap-2 text-white overflow-y-scroll  h-[45rem]"
                >
                  <div className="w-full gap-2 flex justify-between items-center p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Nama</h4>
                      <div
                        className={`w-full flex p-2 font-normal border text-sm rounded-lg justify-start items-center h-[3rem] ${
                          props.data.nama
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {props.data.nama || "Tidak ada data"}
                      </div>
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Email</h4>
                      <div
                        className={`w-full flex p-2 font-normal border text-sm rounded-lg justify-start items-center h-[3rem] ${
                          props.data.email
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {props.data.email || "Tidak ada data"}
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-2 flex justify-between items-center p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">NIK</h4>
                      <div
                        className={`w-full flex p-2 font-normal border text-sm rounded-lg justify-start items-center h-[3rem] ${
                          props.data.nik
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {props.data.nik || "Tidak ada data"}
                      </div>
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Posisi</h4>
                      <div
                        className={`w-full gap-2 flex flex-col font-normal text-sm h-[3rem] justify-start items-start p-2 border rounded-xl ${
                          props.data.posisi
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {props.data.posisi || "Tidak ada data"}
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-2 flex justify-between items-start p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">No. WhatsApp</h4>
                      <div
                        className={`w-full flex p-2 font-normal border text-sm rounded-lg justify-start items-center h-[3rem] ${
                          props.data.nomorWhatsapp
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {props.data.nomorWhatsapp || "Tidak ada data"}
                      </div>
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Alamat</h4>
                      <div
                        className={`w-full p-2 text-white border text-sm rounded-lg min-h-[3rem] h-[5rem] resize-none font-normal ${
                          props.data.alamat
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {props.data.alamat || "Tidak ada data"}
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-2 flex justify-between items-start p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Kontak Lain</h4>
                      <div
                        className={`w-full flex p-2 font-normal border text-sm rounded-lg justify-start items-center h-[3rem] ${
                          props.data.kontakLain
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {props.data.kontakLain || "Tidak ada data"}
                      </div>
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Tanggal Lahir</h4>
                      <div
                        className={`w-full p-2 text-white border text-sm rounded-lg min-h-[3rem]  resize-none font-normal ${
                          props.data.tanggalLahir
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {props.data.tanggalLahir || "Tidak ada data"}
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-2 flex justify-between items-start p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Divisi</h4>
                      <div
                        className={`w-full gap-2 flex flex-col text-sm font-normal justify-start items-start p-2 border rounded-xl ${
                          props.data.divisi
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {props.data.divisi || "Tidak ada data"}
                      </div>
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Lokasi Kerja</h4>
                      <div
                        className={`w-full gap-2 flex flex-col text-sm font-normal justify-start items-start p-2 border rounded-xl ${
                          props.data.cabang
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {props.data.cabang || "Tidak ada data"}
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-2 flex justify-between items-start p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">
                        Tanggal Awal Kontrak
                      </h4>
                      <div
                        className={`w-full gap-2 flex flex-col text-sm font-normal justify-start items-start p-2 border rounded-xl ${
                          props.data.tanggalAwalKontrak
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {props.data.tanggalAwalKontrak
                          ? formatTanggal(props.data.tanggalAwalKontrak)
                          : "Tidak ada data"}
                      </div>
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col text-sm justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">
                        Tanggal Akhir Kontrak
                      </h4>
                      {props.data.statusKaryawan !== "Karyawan Tetap" ? (
                        <>
                          <div
                            className={`w-full gap-2 flex flex-col text-sm font-normal justify-start items-start p-2 border rounded-xl ${
                              props.data.tanggalAkhirKontrak
                                ? "bg-slate-700 border-slate-500"
                                : "text-red-500 border-red-600"
                            }`}
                          >
                            {props.data.tanggalAkhirKontrak
                              ? formatTanggal(props.data.tanggalAkhirKontrak)
                              : "Tidak ada data"}
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={`w-full gap-2 flex flex-col text-sm font-normal justify-start items-start p-2 border rounded-xlbg-slate-700 border-slate-500`}
                          >
                            Selamanya
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="w-full gap-2 flex justify-between items-start p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Tanggal TMT</h4>
                      <div
                        className={`w-full gap-2 flex flex-col text-sm font-normal justify-start items-start p-2 border rounded-xl ${
                          props.data.tanggalAwalMasuk
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {props.data.tanggalAwalMasuk
                          ? formatTanggal(props.data.tanggalAwalMasuk)
                          : "Tidak ada data"}
                      </div>
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col text-sm justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">
                        Riwayat Pendidikan
                      </h4>
                      <div
                        className={`w-full gap-2 flex flex-col font-normal text-sm justify-start items-start p-2 border rounded-xl ${
                          props.data.riwayatPendidikan
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {props.data.riwayatPendidikan || "Tidak ada data"}
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-2 flex justify-between items-start p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">
                        Lama Bekerja (Tahun)
                      </h4>
                      <div
                        className={`w-full gap-2 flex flex-col font-normal text-sm justify-start items-start p-2 border rounded-xl bg-slate-700 border-slate-500`}
                      >
                        {props.data.masaKerja}
                      </div>
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">No Rekening</h4>
                      <div
                        className={`w-full gap-2 flex flex-col font-normal text-sm justify-start items-start p-2 border rounded-xl ${
                          props.data.noRekening
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {props.data.noRekening || "Tidak ada data"}
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-2 flex justify-between items-start p-2">
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Gaji</h4>
                      <div
                        className={`w-full gap-2 flex flex-col text-sm font-normal justify-start items-start p-2 border rounded-xl ${
                          props.data.gaji
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {formatRupiah(props.data.gaji) || "Tidak ada data"}
                      </div>
                    </div>
                    <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                      <h4 className="font-semibold text-sm">Status Karyawan</h4>
                      <div
                        className={`w-full gap-2 flex flex-col text-sm font-normal justify-start items-start p-2 border rounded-xl ${
                          props.data.statusKaryawan
                            ? "bg-slate-700 border-slate-500"
                            : "text-red-500 border-red-600"
                        }`}
                      >
                        {props.data.statusKaryawan || "Tidak ada data"}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetailEmployee;
