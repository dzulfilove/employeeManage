import React, { useEffect, useState } from "react";
import swal from "sweetalert2";
import { Tabs, Tab } from "react-bootstrap";
import "../../../styles/tab.css";
import "../../../styles/button.css";
import "dayjs/locale/id";
import { TESelect } from "tw-elements-react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/id";
import DropdownSearch from "../../features/dropdown";
import LoadingData from "../../features/loading";
import animationData from "../../../styles/noData.json";
import Lottie from "react-lottie";

function TablePosition(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [lengthData, setLengthData] = useState(props.dataPosisi.length);
  const [tab, setTab] = useState("tab1");
  const [select, setSelect] = useState(false);
  const [filter, setIsFilter] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [posisi, setPosisi] = useState("");
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;

  const currentData = props.dataPosisi.slice(indexOfFirstData, indexOfLastData);
  const currentDataLoker = props.dataPosisiLoker.slice(
    indexOfFirstData,
    indexOfLastData
  );
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [addPosisi, setAddPosisi] = useState(false);
  const [addPosisiLoker, setAddPosisiLoker] = useState(false);
  const [dataLoker, setDataLoker] = useState([]);
  const [dataAwal, setDataAwal] = useState(props.data);
  const [tanggal, setTanggal] = useState(
    dayjs().locale("id").format("YYYY/MM/DD")
  );

  useEffect(() => {
    setLengthData(props.dataPosisi.length);

    setDataAwal(props.dataPosisi);
    // you can use the userData here, or set it to state using setUser
  }, [dataAwal, lengthData]);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };
  // handle data
  const handleTab = (key) => {
    setTab(key);
    setAddPosisi(false);
    setAddPosisiLoker(false);
    setIsFilter(false);
    props.changeData(key);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const results = props.dataPosisi.filter((item) =>
      item.namaPosisi.toLowerCase().includes(value.toLowerCase())
    );
    const resultsLoker = props.dataPosisiLoker.filter((item) =>
      item.text.toLowerCase().includes(value.toLowerCase())
    );
    setData(results);
    setDataLoker(resultsLoker);

    console.log(dataAwal, "dataAwal");
    console.log(value, "search");
    console.log(results, "data Hasil");

    setIsSearch(true);
  };

  const handleAdd = () => {
    if (tab == "tab1") {
      if (addPosisi == true) {
        setAddPosisi(false);
      } else {
        setAddPosisi(true);
      }

      setAddPosisiLoker(false);
    } else {
      if (addPosisiLoker == true) {
        setAddPosisiLoker(false);
      } else {
        setAddPosisiLoker(true);
      }
      setAddPosisi(false);
    }
  };

  const submitPosisiLoker = (e) => {
    e.preventDefault();
    const data = {
      text: posisi,
      value: posisi,
    };
    props.submitPosisiLoker(data);
  };

  const submitPosisi = (e) => {
    e.preventDefault();
    const data = {
      namaPosisi: posisi,
    };
    props.submitPosisi(data);
  };

  const deletePosisi = (data) => {
    props.deletePosisi(data);
  };
  const deletePosisiLoker = (data) => {
    props.deletePosisiLoker(data);
  };
  const options = props.dataDivisi;
  const currentDataFilter = data.slice(indexOfFirstData, indexOfLastData);
  const currentDataLokerFilter = dataLoker.slice(
    indexOfFirstData,
    indexOfLastData
  );
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
          <Tab eventKey="tab1" title="Posisi Pegawai"></Tab>

          <Tab eventKey="tab2" title="Posisi Kandidat"></Tab>
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

        <button onClick={handleAdd} className="button-add">
          Tambah
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div
        className={`w-full  ${
          addPosisi == true
            ? "h-[8.4rem] p-4 mb-8 border border-slate-100 overflow-hidden"
            : "h-0 p-0"
        } duration-500 flex justify-start items-end rounded-lg gap-8`}
      >
        <div
          className={`w-[33%] gap-2 ${
            addPosisi == true ? "flex" : "hidden"
          } flex-col justify-start items-start p-2 text-white gap-4 `}
        >
          <h4 className="font-semibold text-sm">Posisi</h4>
          <input
            type="text"
            className="w-full flex p-2 text-sm bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
            onChange={(e) => {
              setPosisi(e.target.value);
            }}
          />
        </div>

        <button
          className={`button-add m-3 ${addPosisi == true ? "flex" : "hidden"}`}
          onClick={submitPosisi}
        >
          Simpan Posisi
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div
        className={`w-full ${
          addPosisiLoker == true
            ? "h-[8.4rem] p-4 mb-8 border border-slate-100 "
            : "h-[0rem] p-0 overflow-hidden"
        } duration-500 flex justify-start items-end rounded-lg  gap-8`}
      >
        <div
          className={`flex w-full justify-start items-end gap-8 rounded-lg mb-2  ${
            addPosisiLoker ? "" : "hidden "
          }`}
        >
          <div
            className={`w-[33%] gap-2 ${
              addPosisiLoker == true ? "flex " : "hidden"
            }  flex-col justify-start items-start p-2 text-white gap-4 `}
          >
            <h4 className="font-semibold text-sm">Posisi Kandidat</h4>
            <div className="flex w-full justify-center items-center p-2 border border-slate-500 bg-slate-700 rounded-lg">
              <DropdownSearch
                options={props.optionPosisi}
                change={(data) => {
                  setPosisi(data.text);
                }}
                name={"Posisi"}
              />
            </div>
          </div>

          <button
            className={`button-add m-3 ${
              addPosisiLoker == true ? "flex" : "hidden"
            }`}
            onClick={submitPosisiLoker}
          >
            Simpan Posisi
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      {tab == "tab2" ? (
        <>
          <table
            data-aos="fade-up"
            data-aos-delay="550"
            className="w-[100%] text-left text-sm font-normal"
          >
            <thead>
              <tr className="bg-slate-700 text-slate-300 rounded-xl font-normal py-6 w-full">
                <th className="px-4 py-4 font-medium rounded-l-xl">Nama</th>

                <th className="px-4 py-4 font-medium ">Jumlah Pelamar</th>
                <th className="px-4 py-4 font-medium rounded-r-xl">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {props.getData == false ? (
                <>
                  <tr className="hover:cursor-pointer">
                    <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] w-[12%] px-4 py-2 text-white"></td>

                    <td className="border-b border-blue-gray-300 h-[4rem] px-4 py-2 text-white w-[100%]"></td>
                  </tr>
                </>
              ) : (
                <>
                  {props.dataPosisiLoker.length > 0 ? (
                    <>
                      {isSearch ? (
                        <>
                          {currentDataLokerFilter.map((data) => (
                            <tr className="hover:cursor-pointer py-6">
                              <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white capitalize">
                                {data.value}
                              </td>
                              <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                                {data.jumlahPelamar}
                              </td>
                              <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                                <div className="flex w-full justify-between items-center">
                                  <div className="h-[2.5rem] w-[2.5rem] hover:border-2 hover:border-teal-500 flex justify-center items-center rounded-full bg-transparent p-1 relative ">
                                    <div className="h-full w-full justify-center items-center rounded-full bg-white opacity-15 absolute top-0 left-0 "></div>
                                    <button
                                      className="btnCloud-delete"
                                      onClick={() => deletePosisiLoker(data)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
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
                          {currentDataLoker.map((data) => (
                            <tr className="hover:cursor-pointer py-6">
                              <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white capitalize">
                                {data.value}
                              </td>
                              <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                                {data.jumlahPelamar}
                              </td>
                              <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                                <div className="flex w-full justify-between items-center">
                                  <div className="h-[2.5rem] w-[2.5rem] hover:border-2 hover:border-teal-500 flex justify-center items-center rounded-full bg-transparent p-1 relative ">
                                    <div className="h-full w-full justify-center items-center rounded-full bg-white opacity-15 absolute top-0 left-0 "></div>
                                    <button
                                      className="btnCloud-delete"
                                      onClick={() => deletePosisiLoker(data)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
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
                      )}
                    </>
                  ) : (
                    <>
                      <tr className="hover:cursor-pointer">
                        <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] w-[12%] px-4 py-2 text-white"></td>

                        <td className="border-b border-blue-gray-300 h-[4rem] px-4 py-2 text-white w-[100%]">
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
                      </tr>
                    </>
                  )}
                </>
              )}
            </tbody>
          </table>
          {isSearch == false ? (
            <>
              <div className="mt-10">
                {Array.from(
                  {
                    length: Math.ceil(
                      props.dataPosisiLoker.length / dataPerPage
                    ),
                  },
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
                  { length: Math.ceil(dataLoker.length / dataPerPage) },
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
        </>
      ) : (
        <>
          <table
            data-aos="fade-up"
            data-aos-delay="550"
            className="w-[100%] text-left text-sm font-normal"
          >
            <thead>
              <tr className="bg-slate-700 text-slate-300 rounded-xl font-normal py-6 w-full">
                <th className="px-4 py-4 font-medium rounded-l-xl">Nama</th>
                <th className="px-4 py-4 font-medium ">Jumlah Karyawan </th>
                <th className="px-4 py-4 font-medium rounded-r-xl">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {props.getData == false ? (
                <>
                  <tr className="hover:cursor-pointer">
                    <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] w-[12%] px-4 py-2 text-white"></td>

                    <td className="border-b border-blue-gray-300 h-[4rem] px-4 py-2 text-white w-[100%]"></td>
                  </tr>
                </>
              ) : (
                <>
                  {props.dataPosisi.length > 0 ? (
                    <>
                      {isSearch ? (
                        <>
                          {currentDataFilter.map((data) => (
                            <tr className="hover:cursor-pointer py-6">
                              <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white capitalize">
                                {data.namaPosisi}
                              </td>
                              <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                                {data.jumlahPegawai}
                              </td>
                              <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                                <div className="flex w-full justify-between items-center">
                                  <div className="h-[2.5rem] w-[2.5rem] hover:border-2 hover:border-teal-500 flex justify-center items-center rounded-full bg-transparent p-1 relative ">
                                    <div className="h-full w-full justify-center items-center rounded-full bg-white opacity-15 absolute top-0 left-0 "></div>
                                    <button
                                      className="btnCloud-delete"
                                      onClick={() => deletePosisi(data)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
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
                          {currentData.map((data) => (
                            <tr className="hover:cursor-pointer py-6">
                              <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white capitalize">
                                {data.namaPosisi}
                              </td>
                              <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                                {data.jumlahPegawai}
                              </td>
                              <td className="border-b border-blue-slate-300 h-[4rem] max-h-[6rem] px-4 py-6 text-white">
                                <div className="flex w-full justify-between items-center">
                                  <div className="h-[2.5rem] w-[2.5rem] hover:border-2 hover:border-teal-500 flex justify-center items-center rounded-full bg-transparent p-1 relative ">
                                    <div className="h-full w-full justify-center items-center rounded-full bg-white opacity-15 absolute top-0 left-0 "></div>
                                    <button
                                      className="btnCloud-delete"
                                      onClick={() => deletePosisi(data)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
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
                      )}
                    </>
                  ) : (
                    <>
                      <tr className="hover:cursor-pointer">
                        <td className="border-b border-blue-gray-300 h-[4rem] max-h-[1rem] w-[12%] px-4 py-2 text-white"></td>

                        <td className="border-b border-blue-gray-300 h-[4rem] px-4 py-2 text-white w-[100%]">
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
                      </tr>
                    </>
                  )}
                </>
              )}
            </tbody>
          </table>
          {isSearch == false ? (
            <>
              <div className="mt-10">
                {Array.from(
                  { length: Math.ceil(props.dataPosisi.length / dataPerPage) },
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
        </>
      )}
      {props.getData == false && (
        <>
          <div className=" self-center w-full  flex justify-center items-center">
            <div className="w-[100%] gap-4  h-[20rem] pb-10 bg-transparent px-2 pt-4 flex rounded-xl justify-center flex-col items-center">
              <LoadingData />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TablePosition;
