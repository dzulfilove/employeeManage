import React, { useState } from "react";
import swal from "sweetalert2";
import { Tabs, Tab } from "react-bootstrap";
import dayjs from "dayjs";
import "../../styles/tab.css";
import "dayjs/locale/id";

function TableDashboard(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [dataPerPageDetail] = useState(5);
  const [tab, setTab] = useState("tab1");
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const indexOfLastDataDetail = currentPage * dataPerPageDetail;
  const indexOfFirstDataDetail = indexOfLastDataDetail - dataPerPageDetail;
  const currentData = props.dataEmployees.slice(
    indexOfFirstData,
    indexOfLastData
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const convertDays = (days) => {
    // Jika jumlah hari kurang dari 30, langsung kembalikan sebagai hari
    if (days < 30) {
      return `${days} hari`;
    }

    // Hitung jumlah bulan dan hari
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;

    // Jika tidak ada sisa hari, kembalikan hanya bulan
    if (remainingDays === 0) {
      return `${months} bulan`;
    }

    // Kembalikan dalam format bulan dan hari
    return `${months} bulan ${remainingDays} hari`;
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

  const handleTab = (key) => {
    setTab(key);
  };

  const convertToTitleCase = (input) => {
    const words = input.split(/(?=[A-Z])/).map((word) => word.toLowerCase());
    const titleCaseWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    const titleCaseString = titleCaseWords.join(" ");
    return titleCaseString;
  };
  return (
    <div
      data-aos="fade-down"
      data-aos-delay="350"
      className="p-4 bg-slate-800 w-[70%] rounded-xl shadow-lg mb-[4rem] mt-16"
    >
      <div className="mt-2 flex justify-start items-center mb-6">
        <Tabs
          id="controlled-tab-example"
          activeKey={tab}
          onSelect={handleTab}
          className={"custom-tab-bar"}
        >
          <Tab eventKey="tab1" title="Kontrak Akan Berakhir"></Tab>
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
              {props.dataKandidat.map((item) => (
                <tr onClick={() => {}} className="hover:cursor-pointer">
                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                    {item.nama}
                  </td>

                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                    {item.divisi}
                  </td>

                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                    {item.posisi}
                  </td>

                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                    {item.tanggalMelamar}
                  </td>
                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                    {convertToTitleCase(item.statusTahap)}
                  </td>
                </tr>
              ))}
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
              {currentData.map((data) => (
                <tr onClick={() => {}} className="hover:cursor-pointer">
                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                    {data.nama}
                  </td>

                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                    {data.divisi}
                  </td>

                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                    {data.posisi}
                  </td>

                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                    {formatTanggal(data.tanggalAwalKontrak)} -{" "}
                    {formatTanggal(data.tanggalAkhirKontrak)}
                  </td>
                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                    {convertDays(data.sisaKontrak)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div className="mt-10">
        {Array.from(
          { length: Math.ceil(props.dataEmployees.length / dataPerPage) },
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
