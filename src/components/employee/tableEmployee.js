import React, { useEffect, useState } from "react";
import swal from "sweetalert2";
import { Tabs, Tab } from "react-bootstrap";
import "../../styles/tab.css";
import "../../styles/button.css";
import "dayjs/locale/id";
import { TESelect } from "tw-elements-react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/id";
import DropdownSearch from "../features/dropdown";

function TableEmployee(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [lengthData, setLengthData] = useState(props.data.length);
  const [tab, setTab] = useState("tab1");
  const [select, setSelect] = useState(false);
  const [filter, setIsFilter] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;

  const currentData = props.data.slice(indexOfFirstData, indexOfLastData);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [dataAwal, setDataAwal] = useState(props.data);
  const [tanggal, setTanggal] = useState(
    dayjs().locale("id").format("YYYY/MM/DD")
  );

  useEffect(() => {
    setLengthData(props.data.length);

    setDataAwal(props.data);
    // you can use the userData here, or set it to state using setUser
  }, [dataAwal, lengthData]);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // handle data
  const handleTab = (key) => {
    setTab(key);
    setIsFilter(false);
    setLengthData(props.data.length);
    props.changeData(key);
  };

  const handleFilter = (item) => {
    if (isSearch == true) {
      const dataFilter = props.data.filter((a) => a.divisi == item.text);
      const results = dataFilter.filter((item) =>
        item.nama.toLowerCase().includes(search.toLowerCase())
      );
      setData(results);
      setLengthData(dataFilter.length);
      setIsFilter(true);
      setSelect(item);
    } else {
      const dataFilter = props.data.filter((a) => a.divisi == item.text);
      setData(dataFilter);
      setLengthData(dataFilter.length);
      setIsFilter(true);
      setSelect(item);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (filter == true) {
      const dataFilter = props.data.filter((a) => a.divisi == select.text);
      const results = dataFilter.filter((item) =>
        item.nama.toLowerCase().includes(value.toLowerCase())
      );

      console.log(dataFilter, "filter");
      setData(results);
    } else {
      const results = props.data.filter((item) =>
        item.nama.toLowerCase().includes(value.toLowerCase())
      );
      setData(results);

      console.log(dataAwal, "dataAwal");
      console.log(value, "search");
      console.log(results, "data Hasil");
    }
    setIsSearch(true);
  };

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

  const options = props.dataDivisi;
  const currentDataFilter = data.slice(indexOfFirstData, indexOfLastData);
  console.log(props.data, "dataaa");
  return (
    <div
      data-aos="fade-down"
      data-aos-delay="450"
      className="p-4 bg-slate-800 w-[900%] rounded-xl shadow-lg mb-[4rem] mt-6"
    >
      <div className="mt-2 flex justify-start items-center mb-10 gap-10">
        <Tabs
          id="controlled-tab-example"
          activeKey={tab}
          onSelect={handleTab}
          className={"custom-tab-bar"}
        >
          <Tab eventKey="tab1" title="Semua Karyawan"></Tab>

          <Tab eventKey="tab2" title="Akan Berakhir"></Tab>
          <Tab eventKey="tab3" title="Berakhir"></Tab>
          <Tab eventKey="tab4" title="Baru"></Tab>
        </Tabs>
        <div className="search">
          <div className="search-box">
            <div className="search-field">
              <input
                placeholder="Search..."
                className="input-search"
                type="text"
                value={search}
                onChange={handleSearch}
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
          <div className="flex items-center justify-center z-[999] w-[12rem]">
            <DropdownSearch
              options={props.dataDivisi}
              change={(item) => handleFilter(item)}
              name={"Divisi"}
            />
          </div>
        </div>

        <Link to="/add-employee" className="button-add">
          Tambah
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </Link>
      </div>

      <table
        data-aos="fade-up"
        data-aos-delay="550"
        className="w-[100%] text-left text-sm font-normal"
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
            <th className="px-4 py-4 font-medium ">Sisa Masa Kerja</th>
            <th className="px-4 py-4 font-medium rounded-r-xl">Status </th>
          </tr>
        </thead>
        <tbody>
          {filter || isSearch ? (
            <>
              {currentDataFilter.map((data) => (
                <tr className="hover:cursor-pointer py-6">
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      <img
                        src={data.fotoTerbaru}
                        className="object-cover w-[4rem] h-[4rem] rounded-full"
                      />
                    </Link>
                  </td>
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white capitalize">
                    <Link to={`/employee-detail/${data.id}`}>{data.nama}</Link>
                  </td>
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      {data.divisi ? data.divisi : ""}
                    </Link>
                  </td>
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      {data.posisi}
                    </Link>
                  </td>
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      {data.cabang ? data.cabang : ""}
                    </Link>
                  </td>
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      {data.tanggalAwalKontrak
                        ? formatTanggal(data.tanggalAwalKontrak)
                        : ""}
                    </Link>
                  </td>
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      {data.statusKaryawan == "Karyawan Tetap"
                        ? "Tidak Ada"
                        : data.tanggalAkhirKontrak
                        ? formatTanggal(data.tanggalAkhirKontrak)
                        : ""}
                    </Link>
                  </td>
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      {data.statusKaryawan == "Karyawan Tetap"
                        ? "Selamanya"
                        : sisaMasaKontrak(tanggal, data.tanggalAkhirKontrak)}
                    </Link>
                  </td>{" "}
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      {data.statusKaryawan ? data.statusKaryawan : ""}
                    </Link>
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <>
              {currentData.map((data) => (
                <tr className="hover:cursor-pointer py-6">
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      <img
                        src={data.fotoTerbaru}
                        className="object-cover w-[4rem] h-[4rem] rounded-full"
                      />
                    </Link>
                  </td>
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white capitalize">
                    <Link to={`/employee-detail/${data.id}`}>{data.nama}</Link>
                  </td>
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      {data.divisi ? data.divisi : ""}
                    </Link>
                  </td>
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      {data.posisi}
                    </Link>
                  </td>
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      {data.cabang ? data.cabang : ""}
                    </Link>
                  </td>
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      {data.tanggalAwalKontrak
                        ? formatTanggal(data.tanggalAwalKontrak)
                        : ""}
                    </Link>
                  </td>
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      {data.statusKaryawan == "Karyawan Tetap"
                        ? "Selamanya"
                        : data.tanggalAkhirKontrak
                        ? formatTanggal(data.tanggalAkhirKontrak)
                        : ""}
                    </Link>
                  </td>
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      {data.statusKaryawan == "Karyawan Tetap"
                        ? "Selamanya"
                        : sisaMasaKontrak(tanggal, data.tanggalAkhirKontrak)}
                    </Link>
                  </td>{" "}
                  <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                    <Link to={`/employee-detail/${data.id}`}>
                      {data.statusKaryawan ? data.statusKaryawan : ""}
                    </Link>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
      {filter == false ? (
        <>
          <div className="mt-10">
            {Array.from(
              { length: Math.ceil(props.data.length / dataPerPage) },
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
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default TableEmployee;
