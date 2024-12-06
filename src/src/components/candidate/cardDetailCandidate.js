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
        className="w-[90%] flex flex-col xl:flex-row justify-between items-end mb-16  rounded-lg relative playing border-2 border-slate-600 overflow-hidden shadow-xl mt-10"
      >
        <div className="w-full flex justify-center items-center left-0 m-0 p-0  bg-white rounded-lg absolute opacity-5 h-full"></div>
        <div className="w-[25rem] h-[25rem] opacity-10 rounded-full blur-3xl bg-white absolute left-[5%] top-[5%]"></div>

        <div className="w-[100%]  flex flex-col xl:flex-row justify-between items-center xl:items-start pb-8 gap-12  rounded-lg relative playing  overflow-hidden shadow-xl mb-6">
          <div
            data-aos="fade-down"
            data-aos-delay="250"
            className="flex flex-col justify-center  items-center xl:items-start w-full xl:w-[30%] p-8 gap-8 text-white"
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
                      <h2 className="text-white font-semibold text-lg capitalize">
                        {props.data.nama}
                      </h2>
                      <h2 className="text-white font-normal text-sm">
                        {props.data.posisi}
                      </h2>
                      <h2 className="text-white font-semibold text-lg mt-6">
                        Informasi Pribadi
                      </h2>

                      <div className=" flex w-full justify-start  items-start gap-6  ">
                        <div className=" flex  justify-center text-sm text-slate-300  items-center gap-2 mt-4  flex-col  border-slate-400 border p-2 rounded-lg">
                          {props.data.nomorWhatsapp}
                        </div>
                        {/* <div className=" button-link">
                        
                        </div> */}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={props.data.cvTerbaru}
                          class="mt-3 cursor-pointer group group-hover:before:duration-500 border-slate-400 group-hover:after:duration-500 after:duration-500 hover:border-teal-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500  hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4  origin-left hover:decoration-2 hover:text-teal-300 relative bg-slate-900 h- w-64 border text-left p-3 text-gray-50 text-sm font-bold rounded-lg  overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-blue-500 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-teal-300 after:right-8 after:top-3 after:rounded-full after:blur-lg"
                        >
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href={props.data.cvTerbaru}
                          >
                            Lihat CV
                          </a>
                        </a>
                      </div>
                      <h2 className="text-white font-semibold text-lg mt-6">
                        Tahap Seleksi
                      </h2>

                      <div className=" flex w-full justify-start  items-start gap-6  ">
                        <div className=" flex  justify-center text-sm text-slate-300  items-center gap-2 mt-4  flex-col  border-slate-400 border p-2 rounded-lg">
                          {props.data.statusTahap
                            ? camelCaseToNormal(props.data.statusTahap)
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            data-aos-delay="350"
            className="flex flex-col justify-start items-start p-6 w-full xl:w-[60%] gap-2 text-white text-sm "
          >
            <div className="w-full gap-2 flex justify-between items-center p-2">
              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-sm">Nama</h4>

                <div className="w-full flex p-2 bg-slate-700 font-normal text-sm border-slate-500 border rounded-lg justify-start items-center h-[3rem]">
                  {props.data.nama}
                </div>
              </div>
              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-sm">Email</h4>
                <div className="w-full flex p-2 bg-slate-700 font-normal text-sm border-slate-500 border rounded-lg justify-start items-center h-[3rem]">
                  {props.data.email}
                </div>
              </div>
            </div>
            <div className="w-full gap-2 flex justify-between items-center p-2">
              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-sm">NIK</h4>
                <div className="w-full flex p-2 bg-slate-700 font-normal text-sm border-slate-500 border rounded-lg justify-start items-center h-[3rem]">
                  {props.data.nik}
                </div>
              </div>
              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-sm">Posisi</h4>
                <div className="w-full gap-2 flex flex-col font-normal h-[3rem] justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {props.data.posisi}
                </div>
              </div>
            </div>
            <div className="w-full gap-2 flex justify-between items-start p-2">
              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-sm">No. WhatsApp</h4>
                <div className="w-full flex p-2 bg-slate-700 font-normal text-sm border-slate-500 border rounded-lg justify-start items-center h-[3rem]">
                  {props.data.nomorWhatsapp}
                </div>
              </div>
              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-sm">Alamat</h4>

                <div className="w-full p-2 bg-slate-700 text-white border-slate-500 border rounded-lg min-h-[3rem] h-[5rem] resize-none font-normal">
                  {props.data.alamat}
                </div>
              </div>
            </div>
            <div className="w-full gap-2 flex justify-between items-start p-2">
              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-sm">Riwayat Pendidikan</h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {props.data.riwayatPendidikan}
                </div>
              </div>

              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-sm">Memiliki STR Aktif</h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {props.data.isStrAktif == true ? "Ya" : "Tidak"}
                </div>
              </div>
            </div>
            <div className="w-full gap-2 flex justify-between items-start p-2">
              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-sm">
                  Bersedia Ijazah Ditahan
                </h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {props.data.isJaminanIjazah == true ? "Ya" : "Tidak"}
                </div>
              </div>

              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-sm">
                  Bersedia Ditempatkan Di Seluruh cabang
                </h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {props.data.penempatanCabang == true ? "Ya" : "Tidak"}
                </div>
              </div>
            </div>
            <div className="w-full gap-2 flex justify-between items-start p-2">
              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-sm">Tanggal Melamar</h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {formatTanggal(props.data.tanggalMelamar)}
                </div>
              </div>

              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-sm">Sumber Informasi</h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {props.data.sumberInformasi}
                </div>
              </div>
            </div>

            <div className="w-full gap-2 flex justify-between items-start p-2">
              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-sm">Gaji Yang Diharapkan</h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {formatRupiah(props.data.gajiYangDiharapkan)}
                </div>
              </div>

              <div className="w-[50%] gap-2 flex flex-col justify-start items-start p-2">
                <h4 className="font-semibold text-sm">Tahap Seleksi</h4>
                <div className="w-full gap-2 flex flex-col font-normal justify-start items-start p-2 border border-slate-500 rounded-xl bg-slate-700">
                  {props.data.statusTahap
                    ? camelCaseToNormal(props.data.statusTahap)
                    : ""}
                </div>
              </div>
            </div>

            <div className="w-full gap-2 flex flex-col justify-between items-start p-2 px-4 ">
              <h4 className="font-semibold text-sm">Pengalaman Kerja</h4>

              <div className="w-full gap-8 flex flex-col justify-between items-start   rounded-xl bg-transparent pt-2">
                {props.experienceData.map((item) => (
                  <div className="flex justify-between w-full items-center ">
                    <div className=" w-full gap-2 flex flex-col font-normal justify-start items-center p-2 border  border-slate-500 rounded-xl bg-slate-700">
                      <div className="flex justify-between text-sm items-center w-full">
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
