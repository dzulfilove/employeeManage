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
function CardDetailCandidate(props) {
  const [preview, setPreview] = useState(props.data.fotoTerbaru);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSet, setIsSet] = useState(false);

  useEffect(() => {
    console.log(props.data, "Data Kandidat");
    // setData();
    // you can use the userData here, or set it to state using setUser
  }, []);
  function camelCaseToNormal(str) {
    // Tambahkan spasi sebelum huruf besar dan ubah string menjadi huruf kecil
    const result = str.replace(/([A-Z])/g, " $1").toLowerCase();

    // Ubah huruf pertama menjadi huruf besar

    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  // Format data
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
  const formatRupiah = (angka) => {
    const nilai = parseFloat(angka);
    return nilai.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  return (
    <div className="flex w-full  justify-center items-center">
      <div
        data-aos="fade-down"
        data-aos-delay="50"
        className="w-[90%] flex flex-col justify-between items-end mb-16  rounded-lg relative playing border-2 border-slate-600 overflow-hidden shadow-xl mt-10"
      >
        <div className="w-full flex justify-center items-center left-0 m-0 p-0  bg-white rounded-lg absolute opacity-5 h-full"></div>
        <div className="w-[25rem] h-[25rem] opacity-10 rounded-full blur-3xl bg-white absolute left-[5%] top-[5%]"></div>

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
                        src={props.data.fotoTerbaru}
                      />
                    </div>

                    <div className="flex w-full justify-start items-start px-8 flex-col gap-2 z-[99] mt-6 ">
                      <h2 className="text-white font-semibold text-xl capitalize">
                        {props.data.nama}
                      </h2>
                      <h2 className="text-white font-normal text-base">
                        {props.data.posisi}
                      </h2>
                      <h2 className="text-white font-semibold text-xl mt-6">
                        Informasi Pribadi
                      </h2>

                      <div className=" flex w-full justify-start  items-start gap-6  ">
                        <div className=" flex  justify-center text-sm text-slate-300  items-center gap-2 mt-4  flex-col  border-slate-400 border p-2 rounded-lg">
                          {props.data.nomorWhatsapp}
                        </div>
                        <div className=" flex hover:bg-teal-500 transition-all hover:text-slate-800 justify-center text-sm text-slate-300  items-center gap-2 mt-4  flex-col  border-slate-400 border p-2 rounded-lg">
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href={props.data.cvTerbaru}
                          >
                            CV Terbaru
                          </a>
                        </div>
                      </div>
                      <h2 className="text-white font-semibold text-xl mt-6">
                        Tahap Seleksi
                      </h2>

                      <h2 className="text-white font-semibold text-base mt-6 capitalize">
                        {props.data.statusTahap
                          ? camelCaseToNormal(props.data.statusTahap)
                          : ""}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            data-aos="fade-down"
            data-aos-delay="350"
            className="flex flex-col justify-start items-start p-6 w-[60%] gap-2 text-white  "
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
                <h4 className="font-semibold text-base">Riwayat Pendidikan</h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {props.data.riwayatPendidikan}
                </div>
              </div>

              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-base">Memiliki STR Aktif</h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {props.data.isStrAktif == true ? "Ya" : "Tidak"}
                </div>
              </div>
            </div>
            <div className="w-full gap-2 flex justify-between items-start p-2">
              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-base">
                  Bersedia Ijazah Ditahan
                </h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {props.data.isJaminanIjazah == true ? "Ya" : "Tidak"}
                </div>
              </div>

              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-base">
                  Bersedia Ditempatkan Di Seluruh cabang
                </h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {props.data.penempatanCabang == true ? "Ya" : "Tidak"}
                </div>
              </div>
            </div>
            <div className="w-full gap-2 flex justify-between items-start p-2">
              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-base">Tanggal Melamar</h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {formatTanggal(props.data.tanggalMelamar)}
                </div>
              </div>

              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-base">Sumber Informasi</h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {props.data.sumberInformasi}
                </div>
              </div>
            </div>

            <div className="w-full gap-2 flex justify-between items-start p-2">
              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-base">
                  Gaji Yang Diharapkan
                </h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {formatRupiah(props.data.gajiYangDiharapkan)}
                </div>
              </div>

              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-base">Tahap Seleksi</h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {props.data.statusTahap
                    ? camelCaseToNormal(props.data.statusTahap)
                    : ""}
                </div>
              </div>
            </div>

            <div className="w-full gap-2 flex flex-col justify-between items-start p-2 px-4 ">
              <h4 className="font-semibold text-base">Pengalaman Kerja</h4>

              <div className="w-full gap-8 flex flex-col justify-between items-start p-2  rounded-xl bg-slate-800">
                {props.experienceData.map((item) => (
                  <div className="flex justify-between w-full items-center ">
                    <div className=" w-full gap-2 flex flex-col font-normal justify-start items-center p-2 border  border-slate-500 rounded-xl bg-slate-700">
                      <div className="flex justify-between text-base items-center w-full">
                        <h3 className="font-semibold text-white">
                          {item.posisi}
                        </h3>
                        <h3 className="font-semibold text-white">
                          {item.lamaKerja}
                        </h3>
                      </div>
                      <div className="flex justify-between text-sm items-center w-full">
                        <h3 className="font-normal text-white">
                          {item.lokasiKerja}
                        </h3>
                      </div>
                      <div className="flex pl-8 mt-2 justify-between text-sm items-center w-full flex-wrap whitespace-nowrap">
                        <h3 className="font-normal text-white">
                          {item.deskripsiPengalaman}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetailCandidate;
