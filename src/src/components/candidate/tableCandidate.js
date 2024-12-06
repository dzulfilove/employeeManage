import React, { useEffect, useState } from "react";
import swal from "sweetalert2";
import { Tabs, Tab } from "react-bootstrap";
import dayjs from "dayjs";
import "../../styles/tab.css";
import Select from "react-tailwindcss-select";
import "dayjs/locale/id";
import DropdownSearch from "../features/dropdown";
import { Link } from "react-router-dom";
import LoadingData from "../features/loading";
import animationData from "../../styles/noData.json";
import Lottie from "react-lottie";
function TableCandidate(props) {
  const {
    candidateList,
    tahapSeleksiAwal,
    tahapAdministrasi,
    tahapTes,
    tahapInterview,
    deleteData,
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;

  const [tab, setTab] = useState("tab1");
  const [dataTable, setDataTable] = useState(candidateList || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [isSelect, setIsSelect] = useState("");
  const [lengthData, setLengthData] = useState(0);
  const currentData = dataTable.slice(indexOfFirstData, indexOfLastData);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };
  useEffect(() => {
    setDataTable(candidateList || []);
  }, [candidateList]);

  const handleTab = (key) => {
    setTab(key);
    const tabDataMap = {
      tab1: candidateList || [],
      tab2: tahapSeleksiAwal || [],
      tab3: tahapAdministrasi || [],
      tab4: tahapTes || [],
      tab5: tahapInterview || [],
    };

    setDataTable(tabDataMap[key] || []);
  };

  const handleFilter = (data) => {
    setIsSelect(data.text);

    let filteredData = candidateList;

    if (isSearch) {
      filteredData = filteredData.filter((kandidat) =>
        kandidat.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const results = filteredData.filter((a) => a.posisi === data.text);

    setDataTable(results);

    setLengthData(results.length);
    setIsFilter(true);
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    let filteredData = candidateList;

    if (isFilter) {
      filteredData = filteredData.filter((a) => a.posisi === isSelect);
    }

    const results = filteredData.filter((kandidat) =>
      kandidat.nama.toLowerCase().includes(searchValue.toLowerCase())
    );

    setDataTable(results);
    setLengthData(results.length);
    setIsSearch(true);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  console.log({ tab: tab });
  console.log({ dataDable: dataTable });

  const convertToTitleCase = (input) => {
    const words = input.split(/(?=[A-Z])/).map((word) => word.toLowerCase());
    const titleCaseWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    const titleCaseString = titleCaseWords.join(" ");
    return titleCaseString;
  };

  const handleDelete = (data) => {
    deleteData(data.id);
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
  return (
    <div
      data-aos="fade-down"
      data-aos-delay="450"
      className="p-4 bg-slate-800 w-[97%] rounded-xl shadow-lg mb-[4rem] mt-6"
    >
      <div className="mt-2 sm:flex justify-start items-center mb-10 gap-10 hidden">
      <div className="search ">
          <div className="search-box">
            <div className="search-field font-normal">
              <input
                placeholder="Search..."
                className="input-search font-normal"
                type="text"
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
        <div className="w-auto z-[999] justify-start gap-3 items-center p-1 border border-slate-400 rounded-md">
          <div className="flex items-center justify-center z-[999] w-[15rem]">
            <DropdownSearch
              options={props.dataPosisi}
              name={"Posisi"}
              change={(item) => handleFilter(item)}
            />
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-start items-center mb-10 gap-8">
        <Tabs
          id="controlled-tab-example"
          activeKey={tab}
          onSelect={handleTab}
          className={"custom-tab-bar"}
        >
          <Tab eventKey="tab1" title="Semua"></Tab>
          <Tab eventKey="tab2" title="Seleksi Awal"></Tab>
          <Tab eventKey="tab3" title="Administrasi"></Tab>
          <Tab eventKey="tab4" title="Tes"></Tab>
          <Tab eventKey="tab5" title="Interview"></Tab>
        </Tabs>
        <div className="search xl:block hidden">
          <div className="search-box">
            <div className="search-field font-normal">
              <input
                placeholder="Search..."
                className="input-search font-normal"
                type="text"
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
        <div className="w-auto xl:flex hidden z-[999] justify-start gap-3 items-center p-1 border border-slate-400 rounded-md">
          <div className="flex items-center justify-center z-[999] w-[15rem]">
            <DropdownSearch
              options={props.dataPosisi}
              name={"Posisi"}
              change={(item) => handleFilter(item)}
            />
          </div>
        </div>
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
            <th className="px-4 py-4 font-medium">Posisi</th>
            {props.getData == false && (
              <>
                <th className="px-4 py-4 font-medium ">Tahap Seleksi</th>
              </>
            )}
            <th className="px-4 py-4 font-medium ">Tanggal Melamar</th>
            <th className="px-4 py-4 font-medium ">Tahap Seleksi</th>
            <th className="px-4 py-4 font-medium "> Aksi</th>
          </tr>
        </thead>
        <tbody>
          {props.getData == false ? (
            <>
              <tr className="hover:cursor-pointer">
                <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] px-4 py-2 text-white w-[1%]"></td>
                <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] px-4 py-2 text-white w-[1%]"></td>
                <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] px-4 py-2 text-white w-[1%]"></td>
                <td className="border-b border-blue-gray-300 h-[4rem] px-4 py-2 text-white w-[0%]">
                  <div className=" self-center  flex justify-center items-center">
                    <div className="w-[100%] gap-4  h-[20rem] pb-10 bg-transparent px-2 pt-4 flex rounded-xl justify-center flex-col items-center">
                      <LoadingData />
                    </div>
                  </div>
                </td>
                <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] px-4 py-2 text-white w-[1%]"></td>
                <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] px-4 py-2 text-white w-[1%]"></td>
                <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] px-4 py-2 text-white w-[1%]"></td>
              </tr>
            </>
          ) : (
            <>
              {currentData.length > 0 ? (
                <>
                  {currentData.map((kandidat) => (
                    <tr onClick={() => {}} className="">
                      <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                        <img
                          src={kandidat.fotoTerbaru}
                          className="object-cover w-[4rem] h-[4rem] rounded-full"
                        />
                      </td>
                      <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                        {kandidat.nama}
                      </td>
                      <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                        {kandidat.posisi}
                      </td>
                      <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                        {formatTanggal(kandidat.tanggalMelamar)}
                      </td>
                      <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                        {convertToTitleCase(kandidat.statusTahap)}
                      </td>
                      <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 text-white">
                        <div className="flex w-full justify-between items-center max-w-[18rem] ">
                          {" "}
                          <Link
                            to={`/candidate-detail/${kandidat.id}`}
                            className="animated-button-doc"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="arr-2"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                            </svg>
                            <span className="text">Lihat</span>
                            <svg
                              viewBox="0 0 24 24"
                              className="arr-1"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                            </svg>
                          </Link>
                          <div className="h-[3.2rem] w-[3.2rem] hover:border-2 hover:border-teal-500 flex justify-center items-center rounded-full bg-transparent p-1 relative ">
                            <div className="h-full w-full justify-center items-center rounded-full bg-white opacity-15 absolute top-0 left-0 "></div>
                            <button
                              className="btnCloud-delete"
                              onClick={() => handleDelete(kandidat)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="white"
                                  fill-rule="evenodd"
                                  d="M8.106 2.553A1 1 0 0 1 9 2h6a1 1 0 0 1 .894.553L17.618 6H20a1 1 0 1 1 0 2h-1v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8H4a1 1 0 0 1 0-2h2.382zM14.382 4l1 2H8.618l1-2zM11 11a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0zm4 0a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  <tr className="hover:cursor-pointer">
                    <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] px-4 py-2 text-white w-[12%]"></td>
                    <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] px-4 py-2 text-white w-[12%]"></td>
                    <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] px-4 py-2 text-white w-[12%]"></td>
                    <td className="border-b border-blue-gray-300 h-[4rem] px-4 py-2 text-white w-[0%]">
                      <div className=" self-center  flex justify-center items-center">
                        <div className="w-[100%]  h-[20rem] pb-10 bg-transparent px-2 flex rounded-xl justify-center flex-col items-center">
                          <Lottie
                            options={defaultOptions}
                            height={250}
                            width={250}
                          />
                          <h3 className="text-base text-white font-medium text-center">
                            Belum Ada Data
                          </h3>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] px-4 py-2 text-white w-[12%]"></td>
                    <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] px-4 py-2 text-white w-[12%]"></td>
                    <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] px-4 py-2 text-white w-[12%]"></td>
                  </tr>
                </>
              )}
            </>
          )}
        </tbody>
      </table>

      <div className="mt-10 ">
        {Array.from(
          { length: Math.ceil(dataTable.length / dataPerPage) },
          (_, i) => i + 1
        ).map((page) => (
          <button
            key={page}
            className={`mx-1 rounded-md border h-12 w-12 py-2 px-2 m-2 ${
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

export default TableCandidate;
