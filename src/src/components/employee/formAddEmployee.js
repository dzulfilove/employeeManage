import React, { useState } from "react";
import "../../styles/card.css";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/id";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import axios from "axios";
import DropdownSearch from "../features/dropdown";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  addDoc,
  writeBatch,
} from "firebase/firestore";
import { db, dbImage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import { generateRandomString } from "../features/utils";
import { Navigate } from "react-router-dom";
/** Manually entering any of the following formats will perform date parsing */
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function FormAddEmployee(props) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [preview, setPreview] = useState(
    "https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
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
  const [noRekening, setNoRekening] = useState(0);
  const [kontakLain, setKontakLain] = useState(0);
  const [masakerja, setMasaKerja] = useState(0);
  const [tanggalAwalKontrak, setTanggalAwalKontrak] = useState(
    dayjs().locale("id").format("YYYY-MM-DD")
  );
  const [tanggalAkhirKontrak, setTanggalAkhirKontrak] = useState(
    dayjs().locale("id").format("YYYY-MM-DD")
  );
  const [tanggal, setTanggal] = useState(
    dayjs().locale("id").format("YYYY/MM/DD")
  );
  const [tanggalLahir, setTanggalLahir] = useState(
    dayjs().locale("id").format("DD/MM/YYYY")
  );
  const [tanggalAwalMasuk, setTanggalAwalMasuk] = useState(
    dayjs().locale("id").format("DD/MM/YYYY")
  );
  const [tanggalAwal, setTanggalAwal] = useState(dayjs().locale("id"));
  const [tanggalAkhir, setTanggalAkhir] = useState(dayjs().locale("id"));
  const optionPosisi = [
    { value: "Manager", text: "Manager" },
    { value: "Assisten Manager", text: "Asisten Manager" },
    { value: "Staff", text: "Staff" },
    { value: "Admin", text: "Admin" },
    { value: "HRD", text: "HRD" },
    { value: "Dokter Umum", text: "Dokter Umum" },
    { value: "Dokter Gigi", text: "Dokter Gigi" },
    { value: "Perawat", text: "Perawat" },
    { value: "Analis", text: "Analis" },
  ];
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
    { value: "Karyawan Tidak Aktif", text: "Karyawan Tidak Aktif" },
    { value: "Karyawan Uji Coba", text: "Karyawan Uji Coba" },
  ];

  // handleData
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoad(true);
    const cek = await handleCheckEmptyFields();
    const umur = await hitungSelisihTahun(tanggalLahir, tanggal);
    const tahunKerja = await hitungSelisihTahun(tanggalAwalMasuk, tanggal);
    if (cek == false) {
      try {
        if (!selectedFile) {
          throw new Error("Foto terbaru tidak ditemukan");
        }

        const fotoTerbaruURL = await handleSaveFoto(selectedFile);

        // Simpan URL foto terbaru dan CV terbaru ke state

        const fotoTerbaru = fotoTerbaruURL;
        let posisiKerja = "";
        if (posisi == "Lainnya") {
          posisiKerja = posisiLain;
          const division = {
            namaPosisi: posisiLain,
          };
          const divisionRef = await addDoc(
            collection(db, "divisions"),
            division
          );
        } else {
          posisiKerja = posisi;
        }

        // Persiapkan dokumen utama untuk employeesApplicant
        const employee = {
          email,
          nama: name,
          nik,
          alamat,
          nomorWhatsapp: noTelpon,
          posisi: posisiKerja,
          cabang: lokasi,
          riwayatPendidikan,
          gaji,
          divisi: divisi,
          masaKerja: tahunKerja,
          umur: umur,
          tanggalAwalKontrak:
            status == "Karyawan Tetap" ? tanggalAwalMasuk : tanggalAwal,
          tanggalAwalMasuk: tanggalAwalMasuk,
          tanggalLahir,
          kontakLain,
          tanggalAkhirKontrak: tanggalAkhirKontrak,
          fotoTerbaru: fotoTerbaruURL,
          statusKaryawan: status,

          noRekening: noRekening,
        };

        console.log(employee, "dataauhakshaqskf");

        // Simpan dokumen pelamar ke koleksi "employeesApplicant"
        const employeeRef = await addDoc(collection(db, "employees"), employee);

        console.log(
          "Data pelamar dan pengalaman kerja berhasil disimpan:",
          employee
        );
        setIsLoad(false);
        Swal.fire({
          title: "Berhasil!",
          text: "Data Karyawan berhasil Ditambahkan",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/employee";
          }
        });
      } catch (error) {
        console.error("Error saving applicant data:", error);
        Swal.fire({
          title: "Error!",
          text: "Wih, Error tuch",
          icon: "error",
        });
      }
    }
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
  const handleCheckEmptyFields = () => {
    const emptyFields = [];
    const fieldsToCheck = [
      { key: "name", label: "Nama" },
      { key: "email", label: "Email" },
      { key: "nik", label: "NIK" },
      { key: "noTelpon", label: "Nomor WhatsApp" },
      { key: "alamat", label: "Alamat" },
      { key: "riwayatPendidikan", label: "Riwayat Pendidikan" },
      { key: "posisi", label: "Posisi" },
      { key: "divisi", label: "Divisi" },
      { key: "lokasi", label: "Lokasi Kerja" },
      { key: "status", label: "Status Karyawan" },
      { key: "gaji", label: "Gaji" },
      { key: "noRekening", label: "No Rekening" },
      { key: "masakerja", label: "Lama Bekerja" },
      { key: "tanggalAwalKontrak", label: "Tanggal Awal Kontrak" },
      { key: "tanggalAkhirKontrak", label: "Tanggal Akhir Kontrak" },
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
      setIsLoad(false);

      return true;
    } else {
      return false;
    }
  };
  return (
    <div className="flex w-full  justify-center items-center mb-20">
      {isLoad == true ? (
        <>
          <div className="w-[90%] flex flex-col justify-start items-center p-6 gap-12  rounded-lg relative playing overflow-hidden mt-10">
            <div class="cssload-container">
              <ul class="cssload-flex-container">
                <li>
                  <span class="cssload-loading cssload-one"></span>
                  <span class="cssload-loading cssload-two"></span>
                  <span class="cssload-loading-center"></span>
                </li>
              </ul>
            </div>
            <h3 className="text-base text-slate-100">
              {" "}
              Data Sedang Ditambahkan
            </h3>
          </div>
        </>
      ) : (
        <>
          <div className="w-[90%] flex justify-start items-center p-6 gap-12  rounded-lg relative playing border-2 border-slate-600 overflow-hidden shadow-xl mt-10">
            <div className="w-full flex justify-start items-center left-0 m-0 p-0  bg-white rounded-lg absolute opacity-5 h-full"></div>
            <div className="w-[25rem] h-[25rem] opacity-10 rounded-full blur-3xl bg-teal-400 absolute left-[5%] top-[5%]"></div>

            <div className="flex flex-col justify-center items-center p-4 w-[40%] gap-8 text-white">
              <div className="card-profile">
                <div className="content-profile">
                  <div className="back">
                    <div className="back-content">
                      <div className="flex justify-center items-center rounded-full bg-teal-500 w-[15rem] h-[15rem] z-[99]">
                        <img
                          className="object-cover h-full w-full rounded-full"
                          src={preview}
                        />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="border border-slate-300 text-md rounded-lg w-[15rem] mt-4"
                        onChange={handleFileChange}
                      />

                      <button
                        className="button-add  mt-4 w-[15rem] text-md"
                        onClick={handleSubmit}
                      >
                        Simpan Data
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              data-aos="fade-down"
              data-aos-delay="350"
              className="flex flex-col justify-start items-start p-6 w-[60%] gap-2 text-white overflow-y-scroll  h-[45rem]"
            >
              <div className="w-full gap-2 flex justify-between items-center p-2">
                <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                  <h4 className="font-semibold text-sm">Nama</h4>

                  <input
                    type="text"
                    className="w-full flex p-2 text-sm capitalize bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
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
                    className="w-full flex p-2 text-sm bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
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
                    type="number"
                    className="w-full flex p-2 text-sm bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
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
                      change={(data) => {
                        setPosisi(data.text);
                      }}
                      name={"Posisi"}
                    />
                  </div>

                  {posisi == "Lainnya" && (
                    <>
                      <input
                        type="text"
                        className="w-full flex p-2 text-sm mt-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                        value={posisiLain}
                        placeholder="Masukkan Posisi / Jabatan Kerja"
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
                    type="number"
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
                    className="w-full p-2 bg-slate-700 text-white border-slate-500 border rounded-lg min-h-[3rem] h-[5rem] resize-none font-normal"
                    value={alamat}
                    onChange={(e) => {
                      setAlamat(e.target.value);
                    }}
                    placeholder="Alamat"
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
                <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2 ">
                  <h4 className="font-semibold text-sm">Tanggal Lahir</h4>
                  <Space direction="vertical" size={12}>
                    <DatePicker
                      defaultValue={dayjs(tanggalLahir, dateFormatList[0])}
                      format={dateFormatList}
                      onChange={(date) => {
                        handleChangeDate("tanggalLahir", date);
                      }}
                      className="bg-slate-700 text-white border border-slate-500 w-[15rem] p-3 hover:text-slate-800 active:text-slate-800"
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
                      change={(data) => {
                        setLokasi(data.text);
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
                      change={(data) => {
                        setDivisi(data.text);
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
                      defaultValue={dayjs(tanggalAwal, dateFormatList[0])}
                      format={dateFormatList}
                      onChange={(date) => {
                        handleChangeDate("startKontrak", date);
                      }}
                      className="bg-slate-700 text-white border border-slate-500 w-[100%] p-3 hover:text-slate-800 active:text-slate-800"
                    />
                  </Space>
                </div>
                <div className="w-[50%] flex justify-start  gap-6 flex-col">
                  <h4 className="font-semibold text-sm">
                    Tanggal Akhir Kontrak
                  </h4>
                  <Space direction="vertical" size={12}>
                    <DatePicker
                      defaultValue={dayjs(tanggalAkhir, dateFormatList[0])}
                      format={dateFormatList}
                      onChange={(date) => {
                        handleChangeDate("endKontrak", date);
                      }}
                      className="bg-slate-700 text-white border border-slate-500 w-[100%] p-3 hover:text-slate-800 active:text-slate-800"
                    />
                  </Space>
                </div>
              </div>
              <div className="w-full gap-6 p-4 flex justify-between items-start ">
                <div className="w-[50%] flex justify-start gap-6 flex-col">
                  <h4 className="font-semibold text-sm">Tanggal TMT</h4>
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
                    {" "}
                    Pendidikan Terakhir
                  </h4>
                  <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                    <DropdownSearch
                      options={optionPendidikan}
                      change={(data) => {
                        setRiwayatPendidikan(data.text);
                      }}
                      name={"Pendidikan terakhir"}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full gap-2 flex justify-between items-start p-2">
                <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                  <h4 className="font-semibold text-sm">Lama Bekerja</h4>
                  <input
                    type="number"
                    className="w-full flex p-2 text-sm bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
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
                    className="w-full flex p-2 text-sm bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                    value={gaji}
                    onChange={(e) => {
                      setGaji(e.target.value);
                    }}
                  />
                </div>
                <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                  <h4 className="font-semibold text-sm">Status Karyawan</h4>
                  <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                    <DropdownSearch
                      options={optionStatus}
                      change={(data) => {
                        setStatus(data.text);
                      }}
                      name={"Status Karyawan"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default FormAddEmployee;
