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
import { doc, setDoc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
const dateFormatList = ["YYYY/MM/DD", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];
function CardDetailEmployee(props) {
  const [preview, setPreview] = useState(props.data.fotoTerbaru);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSet, setIsSet] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nik, setNik] = useState("");
  const [noTelpon, setNoTelpon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [riwayatPendidikan, setRiwayatPendidikan] = useState("");
  const [posisi, setPosisi] = useState("");
  const [divisi, setDivisi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [status, setStatus] = useState("");
  const [gaji, setGaji] = useState(0);
  const [masakerja, setMasaKerja] = useState(0);
  const [tanggalAwalKontrak, setTanggalAwalKontrak] = useState(
    dayjs().locale("id").format("YYYY-MM-DD")
  );
  const [tanggalAkhirKontrak, setTanggalAkhirKontrak] = useState(
    dayjs().locale("id").format("YYYY-MM-DD")
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
    { value: "Karyawan Uji Coba", text: "Karyawan Uji Coba" },
  ];

  useEffect(() => {
    // setData();
    // you can use the userData here, or set it to state using setUser
  }, []);

  const setData = () => {
    setIsEdit(true);

    if (isSet == false) {
      setPreview(props.data.fotoTerbaru);
      setName(props.data.nama);
      setEmail(props.data.email);
      setNik(props.data.nik);
      setNoTelpon(props.data.nomorWhatsapp);
      setAlamat(props.data.alamat);
      setGaji(props.data.gaji);
      setMasaKerja(props.data.masaKerja);
      setTanggalAwalKontrak(props.data.tanggalAwalKontrak);
      setTanggalAkhirKontrak(props.data.tanggalAkhirKontrak);

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

      console.log(props.data.posisi, "lokasi2");
      setDivisi(divisiSelect[0]);
      setRiwayatPendidikan(pendidikanSelect[0]);
      setLokasi(lokasiSelect[0]);
      setStatus(statusSelect[0]);
      setPosisi(props.data.posisi);
      setIsSet(true);
    }
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
      setTanggalAwal(date);
      setTanggalAwalKontrak(formattedDate);
    } else {
      setTanggalAkhir(date);

      setTanggalAkhirKontrak(formattedDate);
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
          posisi: posisi,
          cabang: lokasi.text,
          riwayatPendidikan: riwayatPendidikan.text,
          gaji,
          divisi: divisi.text,
          masaKerja: masakerja,
          tanggalAwalKontrak: tanggalAwalKontrak,
          tanggalAkhirKontrak: tanggalAkhirKontrak,
          statusKaryawan: status.text,
          fotoTerbaru: imageUrl,
        };

        console.log(data, "update");
        // Update properti foto_tindakan pada dokumen tindakan yang sesuai
        const eventRef = doc(db, "employees", props.id);
        await updateDoc(eventRef, {
          email: email,
          nama: name,
          nik,
          alamat,
          nomorWhatsapp: noTelpon,
          posisi: posisi,
          cabang: lokasi.text,
          riwayatPendidikan: riwayatPendidikan.text,
          gaji,
          divisi: divisi.text,
          masaKerja: masakerja,
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
          posisi: posisi,
          cabang: lokasi.text,
          riwayatPendidikan: riwayatPendidikan.text,
          gaji,
          divisi: divisi.text,
          masaKerja: masakerja,
          tanggalAwalKontrak: tanggalAwalKontrak,
          tanggalAkhirKontrak: tanggalAkhirKontrak,
          statusKaryawan: status.text,
        };
        console.log(data, "update");
        // Jika tidak ada gambar baru, hanya perbarui properti nama_tindakan dan deskripsi_tindakan
        const eventRef = doc(db, "employees", props.id);
        await updateDoc(eventRef, {
          email: email,
          nama: name,
          nik,
          alamat,
          nomorWhatsapp: noTelpon,
          posisi: posisi,
          cabang: lokasi.text,
          riwayatPendidikan: riwayatPendidikan.text,
          gaji,
          divisi: divisi.text,
          masaKerja: masakerja,
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
        }
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  console.log(posisi, "divisi");
  return (
    <div className="flex w-full  justify-center items-center">
      <div
        data-aos="fade-down"
        data-aos-delay="50"
        className="w-[90%] flex flex-col justify-between items-end  rounded-lg relative playing border-2 border-slate-600 overflow-hidden shadow-xl mt-10"
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
        <div className="w-[100%] flex  justify-between items-start pb-8 gap-12  rounded-lg relative playing  overflow-hidden shadow-xl mb-6">
          <div
            data-aos="fade-down"
            data-aos-delay="250"
            className="flex flex-col justify-center items-start  w-[30%] p-8 gap-8 text-white"
          >
            <div className="card-profile ">
              <div className="content-profile ">
                <div className="back">
                  <div className="back-content">
                    <div className="flex justify-center items-center rounded-full  w-[15rem] h-[15rem] z-[99] ">
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
                      <h2 className="text-white font-semibold text-xl capitalize">
                        {props.data.nama}
                      </h2>
                      <h2 className="text-white font-normal text-base">
                        {props.data.posisi}
                      </h2>
                      <h2 className="text-white font-semibold text-xl mt-6">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isEdit ? (
            <>
              <div
                data-aos="fade-down"
                data-aos-delay="350"
                className="flex flex-col justify-start items-start p-6 w-[60%] gap-2 text-white overflow-y-scroll  h-[45rem]"
              >
                <div className="w-full gap-2 flex justify-between items-center p-2">
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">Nama</h4>

                    <input
                      type="text"
                      className="w-full flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">Email</h4>
                    <input
                      type="text"
                      className="w-full flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="w-full gap-2 flex justify-between items-center p-2">
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">NIK</h4>
                    <input
                      type="text"
                      className="w-full flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                      value={nik}
                      onChange={(e) => {
                        setNik(e.target.value);
                      }}
                    />
                  </div>
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">Posisi</h4>
                    <input
                      type="text"
                      className="w-full flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                      value={posisi}
                      onChange={(e) => {
                        setPosisi(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="w-full gap-2 flex justify-between items-start p-2">
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">No. WhatsApp</h4>
                    <input
                      type="text"
                      className="w-full flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                      value={noTelpon}
                      onChange={(e) => {
                        setNoTelpon(e.target.value);
                      }}
                    />
                  </div>
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">Alamat</h4>

                    <textarea
                      className="w-full p-2 bg-slate-700 text-white border-slate-500 border rounded-lg min-h-[3rem] h-[5rem] resize-none font-normal"
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
                    <h4 className="font-semibold text-base">Lokasi Kerja</h4>
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
                    <h4 className="font-semibold text-base">Divisi</h4>
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
                    <h4 className="font-semibold text-base">
                      Tanggal Awal Kontrak
                    </h4>
                    <Space direction="vertical" size={12}>
                      <DatePicker
                        defaultValue={dayjs(
                          props.data.tanggalAwalKontrak,
                          dateFormatList[0]
                        )}
                        onChange={(date) => {
                          handleChangeDate("startKontrak", date);
                        }}
                        format={dateFormatList}
                        className="bg-slate-700 text-white border border-slate-500 w-[100%] p-3 hover:text-slate-800 active:text-slate-800"
                      />
                    </Space>
                  </div>
                  <div className="w-[50%] flex justify-start  gap-6 flex-col">
                    <h4 className="font-semibold text-base">
                      Tanggal Akhir Kontrak
                    </h4>
                    <Space direction="vertical" size={12}>
                      <DatePicker
                        defaultValue={dayjs(
                          props.data.tanggalAkhirKontrak,
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
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">
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

                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">
                      Masa Kerja (Tahun)
                    </h4>
                    <input
                      type="text"
                      className="w-full flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                      value={masakerja}
                      onChange={(e) => {
                        setMasaKerja(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="w-full gap-2 flex justify-between items-start p-2">
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">Gaji</h4>
                    <input
                      type="text"
                      className="w-full flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
                      value={gaji}
                      onChange={(e) => {
                        setGaji(e.target.value);
                      }}
                    />
                  </div>
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">Status Karyawan</h4>
                    <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
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
                data-aos="fade-down"
                data-aos-delay="350"
                className="flex flex-col justify-start items-start p-6 w-[60%] gap-2 text-white overflow-y-scroll  h-[45rem]"
              >
                <div className="w-full gap-2 flex justify-between items-center p-2">
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">Nama</h4>

                    <div className="w-full flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]">
                      {props.data.nama}
                    </div>
                  </div>
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">Email</h4>
                    <div className="w-full flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]">
                      {props.data.email}
                    </div>
                  </div>
                </div>
                <div className="w-full gap-2 flex justify-between items-center p-2">
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">NIK</h4>
                    <div className="w-full flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]">
                      {props.data.nik}
                    </div>
                  </div>
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">Posisi</h4>
                    <div className="w-full gap-2 flex flex-col font-normal h-[3rem] justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                      {props.data.posisi}
                    </div>
                  </div>
                </div>
                <div className="w-full gap-2 flex justify-between items-start p-2">
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">No. WhatsApp</h4>
                    <div className="w-full flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]">
                      {props.data.nomorWhatsapp}
                    </div>
                  </div>
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">Alamat</h4>

                    <div className="w-full p-2 bg-slate-700 text-white border-slate-500 border rounded-lg min-h-[3rem] h-[5rem] resize-none font-normal">
                      {props.data.alamat}
                    </div>
                  </div>
                </div>
                <div className="w-full gap-2 flex justify-between items-start p-2">
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">Divisi</h4>
                    <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                      {props.data.divisi}
                    </div>
                  </div>

                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">Lokasi Kerja</h4>
                    <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                      {props.data.cabang}
                    </div>
                  </div>
                </div>
                <div className="w-full gap-2 flex justify-between items-start p-2">
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">
                      Tanggal Awal Kontrak
                    </h4>
                    <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                      {props.data.tanggalAwalKontrak}
                    </div>
                  </div>

                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">
                      Tanggal Akhir Kontrak
                    </h4>
                    <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                      {props.data.tanggalAkhirKontrak}
                    </div>
                  </div>
                </div>
                <div className="w-full gap-2 flex justify-between items-start p-2">
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">
                      Riwayat Pendidikan
                    </h4>
                    <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                      {props.data.riwayatPendidikan}
                    </div>
                  </div>

                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">
                      Masa Kerja (Tahun)
                    </h4>
                    <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                      {props.data.masaKerja}
                    </div>
                  </div>
                </div>
                <div className="w-full gap-2 flex justify-between items-start p-2">
                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">Gaji</h4>
                    <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                      {props.data.gaji}
                    </div>
                  </div>

                  <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                    <h4 className="font-semibold text-base">Status Karyawan</h4>
                    <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                      {props.data.statusKaryawan}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardDetailEmployee;
