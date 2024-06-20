import React, { useState } from "react";
import swal from "sweetalert2";
import { Tabs, Tab } from "react-bootstrap";
import dayjs from "dayjs";
import "../../styles/tab.css";
import "dayjs/locale/id";
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

function TableDashboard(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [dataPerPageDetail] = useState(5);
  const [tab, setTab] = useState("tab1");
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
  return (
    <div className="p-4 bg-slate-800 w-[70%] rounded-xl shadow-lg mb-[4rem] mt-16">
      <div className="mt-2 flex justify-start items-center mb-6">
        <Tabs
          id="controlled-tab-example"
          activeKey={tab}
          onSelect={handleTab}
          className={"custom-tab-bar"}
        >
          <Tab eventKey="tab1" title="Kontrak Berakhir"></Tab>
          <Tab eventKey="tab2" title="Calon Kandidat"></Tab>
        </Tabs>
      </div>
      {tab == "tab2" ? (
        <>
          <table className="w-[100%] text-left text-base font-normal">
            <thead>
              <tr className="bg-slate-700 text-slate-300 rounded-xl font-normal py-6 w-full">
                <th className="px-4 py-4 font-medium rounded-l-xl">Nama</th>
                <th className="px-4 py-4 font-medium ">Divisi</th>

                <th className="px-4 py-4 font-medium">Posisi</th>
                <th className="px-4 py-4 font-medium ">Tanggal Melamar</th>

                <th className="px-4 py-4 font-medium rounded-r-xl">
                  Tahap Seleksi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr onClick={() => {}} className="hover:cursor-pointer">
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
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <>
          <table className="w-[100%] text-left text-base font-normal">
            <thead>
              <tr className="bg-slate-700 text-slate-300 rounded-xl font-normal py-6 w-full">
                <th className="px-4 py-4 font-medium rounded-l-xl">Nama</th>
                <th className="px-4 py-4 font-medium ">Divisi</th>

                <th className="px-4 py-4 font-medium">Posisi</th>

                <th className="px-4 py-4 font-medium">Masa Kontrak</th>
                <th className="px-4 py-4 font-medium rounded-r-xl">
                  Sisa Kontrak
                </th>
              </tr>
            </thead>
            <tbody>
              <tr onClick={() => {}} className="hover:cursor-pointer">
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
              </tr>
            </tbody>
          </table>
        </>
      )}

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

export default TableDashboard;
