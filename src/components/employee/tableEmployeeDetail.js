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
    <div
      data-aos="fade-down"
      data-aos-delay="450"
      className="p-4 bg-slate-800 w-[80%] rounded-xl shadow-lg mb-[4rem] mt-16"
    >
      <div className="mt-2 flex justify-start items-center mb-10 gap-10">
        <Tabs
          id="controlled-tab-example"
          activeKey={tab}
          onSelect={handleTab}
          className={"custom-tab-bar"}
        >
          <Tab eventKey="tab1" title="Semua Karyawan"></Tab>
          <Tab eventKey="tab2" title="Divisi"></Tab>
          <Tab eventKey="tab3" title="Akan Berakhir"></Tab>
          <Tab eventKey="tab4" title="Baru"></Tab>
        </Tabs>
        <div className="search">
          <div className="search-box">
            <div className="search-field">
              <input
                placeholder="Search..."
                className="input-search"
                type="text"
              />
              <div className="search-box-icon">
                <button className="btn-icon-content">
                  <i className="search-icon">
                    <svg
                      xmlns="://www.w3.org/2000/svg"
                      version="1.1"
                      viewBox="0 0 512 512"
                    >
                      <path
                        d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                        fill="#fff"
                      ></path>
                    </svg>
                  </i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-auto flex z-[999] justify-start gap-3 items-center p-1 border border-slate-400 rounded-md">
          <div className="flex items-center justify-center z-[999] w-[10rem]">
            <Select
              options={options}
              name="Lokasi"
              placeholder="Pilih Divisi"
              // value={kas}
              // onChange={(data) => {
              //   setKas(data);
              // }}
              classNames={{
                menuButton: ({ isDisabled }) =>
                  `ps-3 text-[15px] flex w-[10rem] text-md hover:cursor-pointer z-[999] text-white rounded-lg  transition-all duration-300 focus:outline-none ${
                    isDisabled ? "" : " focus:ring focus:ring-slate-700/20"
                  }`,
                menu: "  bg-white absolute w-full bg-slate-50  z-[999] w-[10rem] border rounded py-1 mt-1.5 text-base text-gray-700",
                listItem: ({ isSelected }) =>
                  `block transition duration-200 px-2 py-2 cursor-pointer z-[999] select-none truncate rounded-lg ${
                    isSelected
                      ? "text-slate-500 bg-slate-50"
                      : "text-slate-500 hover:bg-blue-100 hover:text-slate-500"
                  }`,
              }}
            />
          </div>
        </div>
      </div>

      <table
        data-aos="fade-up"
        data-aos-delay="550"
        className="w-[100%] text-left text-base font-normal"
      >
        <thead>
          <tr className="bg-slate-700 text-slate-300 rounded-xl font-normal py-6 w-full">
            <th className="px-4 py-4 font-medium rounded-l-xl">Foto</th>
            <th className="px-4 py-4 font-medium ">Nama</th>
            <th className="px-4 py-4 font-medium ">Divisi</th>

            <th className="px-4 py-4 font-medium">Posisi</th>
            <th className="px-4 py-4 font-medium">Lokasi Kerja</th>
            <th className="px-4 py-4 font-medium ">Awal Kontrak</th>
            <th className="px-4 py-4 font-medium ">Akhir Kontrak</th>

            <th className="px-4 py-4 font-medium rounded-r-xl">Masa Kerja </th>
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
