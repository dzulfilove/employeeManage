import React, { useState } from "react";
import swal from "sweetalert2";
import { Tabs, Tab } from "react-bootstrap";
import dayjs from "dayjs";
import "../../styles/tab.css";
import "../../styles/button.css";
import "dayjs/locale/id";
import Select from "react-tailwindcss-select";
const data = [
  { id: 1, name: "John Doe", age: 25 },
  { id: 2, name: "Jane Doe", age: 30 },
  { id: 3, name: "Jim Smith", age: 35 },
  { id: 4, name: "Jill Smith", age: 40 },
  { id: 5, name: "Jake Brown", age: 45 },
  { id: 6, name: "Jessica Brown", age: 50 },
  { id: 7, name: "Jay Green", age: 55 },
  { id: 8, name: "Jill Green", age: 60 },
  { id: 9, name: "Joe White", age: 65 },
  { id: 10, name: "Joan White", age: 70 },
];

function TableEmployeeDetail(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [dataPerPageDetail] = useState(5);
  const [tab, setTab] = useState("tab1");
  const [select, setSelect] = useState(false);
  const [isAddData, setIsAddData] = useState(false);
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const indexOfLastDataDetail = currentPage * dataPerPageDetail;
  const indexOfFirstDataDetail = indexOfLastDataDetail - dataPerPageDetail;
  const currentData = data.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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
  const formatDurasi = (durasi) => {
    if (durasi < 60) {
      return durasi + " menit";
    } else if (durasi === 60) {
      return "1 jam";
    } else {
      const jam = Math.floor(durasi / 60);
      const menit = durasi % 60;
      if (menit === 0) {
        return jam + " jam";
      } else {
        return jam + " jam " + menit + " menit";
      }
    }
  };

  const formatTanggal = (tanggal) => {
    const hari = dayjs(tanggal).locale("id").format("dddd");
    const bulan = dayjs(tanggal).locale("id").format("MMMM");
    const hasil =
      tanggal.substring(8, 10) + " " + bulan + " " + tanggal.substring(0, 4);
    console.log("tanggal", dayjs(tanggal).locale("id").format("MMMM"));

    return hasil;
  };

  const sortByDateAndTimeDescending = (arrayObjek) => {
    return arrayObjek.sort((a, b) => {
      const dateA = new Date(a.tanggal);
      const dateB = new Date(b.tanggal);

      if (dateB - dateA !== 0) {
        return dateB - dateA;
      }

      // Menggunakan metode sortir jam keluar dari user
      let [jamAInt, menitAInt] = a.lokasiAkhir[0].jamSampai
        .split(":")
        .map(Number);
      let [jamBInt, menitBInt] = b.lokasiAkhir[0].jamSampai
        .split(":")
        .map(Number);

      if (jamAInt !== jamBInt) {
        return jamBInt - jamAInt;
      } else {
        return menitBInt - menitAInt;
      }
    });
  };

  const handleTab = (key) => {
    setTab(key);
  };

  const options = [
    { value: "Programmer", label: "Programmer" },
    { value: "Komersial", label: "Komersial" },
  ];
  return (
    <div className="p-4 bg-slate-800 w-[90%] rounded-xl shadow-lg mb-[8rem] mt-16">
      <div className="mt-2 flex justify-start items-center mb-10 gap-10">
        <button
          class="button-add"
          onClick={() => {
            setIsAddData(!isAddData);
          }}
        >
          Tambah Dokumen
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div
        className={` ${
          isAddData ? "h-[12rem] mb-6 p-6" : "h-[0rem] "
        } duration-500 flex w-full flex-col justify-between items-start border border-slate-400 rounded-lg `}
      >
        <div
          className={`flex w-full justify-between items-center rounded-lg mb-10 ${
            isAddData ? "" : "hidden "
          }`}
        >
          <div className="w-[15rem] flex p-2 bg-slate-700 border-slate-500 border rounded-lg justify-start items-center h-[3rem] text-white">
            Nama Dokumen
          </div>
          <div className="w-[15rem] flex p-2 bg-slate-700 border-slate-500 border rounded-lg justify-start items-center h-[3rem] text-white">
            kategori Dokumenn
          </div>
          <div className="w-[15rem] flex p-2 bg-slate-700 border-slate-500 border rounded-lg justify-start items-center h-[3rem] text-white">
            Tanggal Terbit
          </div>
          <div className="w-[15rem] flex p-2 bg-slate-700 border-slate-500 border rounded-lg justify-start items-center h-[3rem] text-white">
            Status
          </div>
        </div>
        {isAddData && (
          <>
            <button class="button-add">
              Simpan dokumen
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </>
        )}
      </div>

      <table className="w-[100%] text-left text-base font-normal">
        <thead>
          <tr className="bg-slate-700 text-slate-300 rounded-xl font-normal py-6 w-full">
            <th className="px-4 py-4 font-medium rounded-l-xl">Nama Dokumen</th>
            <th className="px-4 py-4 font-medium ">Kategori Dokumen</th>
            <th className="px-4 py-4 font-medium ">Tanggal Dibuat</th>

            <th className="px-4 py-4 font-medium">Tanggal Diunggah</th>
            <th className="px-4 py-4 font-medium">Link Dokumen</th>

            <th className="px-4 py-4 font-medium rounded-r-xl">
              Lihat Dokumen
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            onClick={() => {
              window.location.href = "/employee-detail";
            }}
            className="hover:cursor-pointer"
          >
            <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
              gggg
            </td>

            <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
              ggg
            </td>

            <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
              ggg
            </td>

            <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
              gggg
            </td>
            <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
              ggg
            </td>

            <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
              gggg
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-10">
        {Array.from(
          { length: Math.ceil(data.length / dataPerPage) },
          (_, i) => i + 1
        ).map((page) => (
          <button
            key={page}
            className={`mx-1 rounded-md border h-12 w-12 py-2 px-2 ${
              currentPage === page
                ? "bg-teal-500 text-white border-none"
                : "bg-slate-700 text-slate-400 border-none"
            }`}
            onClick={() => paginate(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TableEmployeeDetail;
