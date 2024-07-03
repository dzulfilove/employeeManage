import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import dayjs from "dayjs";
import "../../styles/tab.css";
import "../../styles/button.css";
import "dayjs/locale/id";
import { DatePicker, Space } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import Swal from "sweetalert2";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { generateRandomString } from "../features/utils";
import DropdownSearch from "../features/dropdown";
import { Link } from "react-router-dom";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function TableEmployeeDetail(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [dataPerPageDetail] = useState(5);
  const [tab, setTab] = useState("tab1");
  const [namaDokumen, setNamaDokumen] = useState("");
  const [kategoriDokumen, setKategoriDokumen] = useState("");
  const [tanggalTerbitDokumen, setTanggalTerbitDokumen] = useState(
    dayjs().locale("id").format("YYYY/MM/DD")
  );
  const [tanggal, setTanggal] = useState(
    dayjs().locale("id").format("YYYY/MM/DD")
  );
  const [statusDokumen, setStatusDokumen] = useState(null);
  const [fileDokumen, setFileDokumen] = useState(null);
  const [select, setSelect] = useState(false);
  const [data, setData] = useState(null);
  const [idData, setIdData] = useState("");
  const [tanggalTerbit, setTanggalTerbit] = useState(dayjs().locale("id"));
  const [isAddData, setIsAddData] = useState(false);
  const [isEditData, setIsEditData] = useState(false);
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const indexOfLastDataDetail = currentPage * dataPerPageDetail;
  const indexOfFirstDataDetail = indexOfLastDataDetail - dataPerPageDetail;
  const currentData = props.data.slice(indexOfFirstData, indexOfLastData);
  const optionStatus = [
    { text: "Aktif", value: "Aktif" },
    { text: "Tidak Aktif", value: "Tidak Aktif" },
  ];
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // handle data
  const handleChangeDate = (name, date) => {
    const dayjsDate = dayjs(date);

    if (!dayjsDate.isValid()) {
      return;
    }

    const formattedDate = dayjsDate.format("YYYY/MM/DD");
    setTanggalTerbitDokumen(formattedDate);
    setTanggalTerbit(dayjsDate);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileDokumen(file);
  };

  const handleAdd = () => {
    if (isEditData) {
      setIsEditData(false);
    } else {
      setIsAddData(!isAddData);
    }
    setData({});
    setIdData("");
    setNamaDokumen("");
    setKategoriDokumen("");
    setTanggalTerbitDokumen(dayjs().locale("id").format("DD/MM/YYYY"));
    setStatusDokumen(null);
    setFileDokumen(null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const cek = handleCheckEmptyDocumentFields();
    if (cek == false) {
      props.simpanDocument(
        namaDokumen,
        kategoriDokumen,
        tanggalTerbitDokumen,
        tanggal,
        statusDokumen,
        fileDokumen
      );
      setIsAddData(false);
      setIsEditData(false);
      setData({});
      setIdData("");
      setNamaDokumen("");
      setKategoriDokumen("");
      setTanggalTerbitDokumen(dayjs().locale("id").format("DD/MM/YYYY"));
      setStatusDokumen(null);
      setFileDokumen(null);
    }
  };

  const handleEdit = (data) => {
    setData(data);
    setIsAddData(true);
    setIsEditData(true);
    setIdData(data.id);
    setNamaDokumen(data.namaDokumen);
    setKategoriDokumen(data.kategoriDokumen);
    setTanggalTerbitDokumen(data.tanggalTerbitDokumen);
    setStatusDokumen(data.statusDokumen);
    setFileDokumen(data.url);
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    props.updateDocument(
      data,
      idData,
      namaDokumen,
      kategoriDokumen,
      tanggalTerbitDokumen,
      tanggal,
      statusDokumen,
      fileDokumen
    );
    setIsAddData(false);
    setIsEditData(false);
    setData({});
    setIdData("");
    setNamaDokumen("");
    setKategoriDokumen("");
    setTanggalTerbitDokumen(dayjs().locale("id").format("DD/MM/YYYY"));
    setStatusDokumen(null);
    setFileDokumen(null);
  };
  const handleDelete = (data) => {
    props.deleteDocument(data);
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

  function ubahFormatTanggal(tanggal) {
    // Memisahkan string tanggal berdasarkan karakter '/'
    const [tahun, bulan, hari] = tanggal.split("/");

    // Menggabungkan kembali dalam format DD/MM/YYYY
    const formatBaru = `${hari}/${bulan}/${tahun}`;

    return formatBaru;
  }

  const handleCheckEmptyDocumentFields = () => {
    const emptyFields = [];
    const fieldsToCheck = [
      { key: "namaDokumen", label: "Nama Dokumen" },
      { key: "kategoriDokumen", label: "Kategori Dokumen" },
      { key: "tanggalTerbitDokumen", label: "Tanggal Terbit Dokumen" },
      { key: "tanggal", label: "Tanggal" },
      { key: "statusDokumen", label: "Status Dokumen" },
      { key: "fileDokumen", label: "File Dokumen" },
    ];

    fieldsToCheck.forEach((field) => {
      if (eval(field.key) === "" || eval(field.key) === null) {
        console.log(field.label, eval(field.key));
        emptyFields.push(field.label);
      }
    });

    if (emptyFields.length > 0) {
      Swal.fire({
        title: "Data Dokumen Tidak Lengkap",
        text: `Field berikut harus diisi: ${emptyFields.join(", ")}`,
        icon: "warning",
        button: "OK",
      });

      return true;
    } else {
      return false;
    }
  };

  console.log(data);
  return (
    <div className="p-4 bg-slate-800 w-[97%] rounded-xl shadow-lg mb-[8rem] mt-10">
      <div className="mt-2 flex justify-start items-center mb-10 gap-10">
        <button className="button-add" onClick={handleAdd}>
          Tambah Dokumen
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div
        className={` ${
          isAddData ? "h-[16rem] mb-6 p-6" : "h-[0rem] "
        } duration-500 flex w-full flex-col justify-between items-start border border-slate-400 rounded-lg `}
      >
        <div
          className={`flex w-full justify-between items-center rounded-lg mb-10  ${
            isAddData ? "" : "hidden "
          }`}
        >
          <div className="w-[14rem] gap-2 flex flex-col justify-start items-start p-2 text-white gap-4 ">
            <h4 className="font-semibold text-sm">Nama Dokumen</h4>
            <input
              type="text"
              className="w-full flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
              value={namaDokumen}
              onChange={(e) => {
                setNamaDokumen(e.target.value);
              }}
            />
          </div>
          <div className="w-[14rem] gap-2 flex flex-col justify-start items-start p-2 text-white gap-4 ">
            <h4 className="font-semibold text-sm"> Kategori Dokumen</h4>
            <input
              type="text"
              className="w-full flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
              value={kategoriDokumen}
              onChange={(e) => {
                setKategoriDokumen(e.target.value);
              }}
            />
          </div>
          <div className="w-[10rem] gap-2 flex flex-col justify-start items-start p-2 text-white gap-4 ">
            <h4 className="font-semibold text-sm">Tanggal Terbit</h4>

            <Space direction="vertical" size={12}>
              <DatePicker
                defaultValue={dayjs(
                  ubahFormatTanggal(tanggalTerbitDokumen),
                  dateFormatList[0]
                )}
                format={dateFormatList}
                onChange={(date) => {
                  handleChangeDate("startKontrak", date);
                }}
                className="bg-slate-700 text-white border w-full border-slate-500  p-3 hover:text-slate-800 active:text-slate-800"
              />
            </Space>
          </div>

          <div className="w-[14rem] gap-2 flex flex-col justify-start items-start p-2 text-white gap-4 ">
            <h4 className="font-semibold text-sm">Status</h4>
            <div className="flex w-full justify-center items-center p-2 border border-slate-500 bg-slate-700 rounded-lg">
              <DropdownSearch
                options={optionStatus}
                change={(data) => {
                  setStatusDokumen(data.text);
                }}
                name={"Status"}
              />
            </div>
          </div>
          <div className="w-[14rem] gap-2 flex flex-col justify-start items-start p-2 text-white gap-4 ">
            <h4 className="font-semibold text-sm"> File Dokumen</h4>

            <input
              type="file"
              className="w-full flex p-2 bg-slate-700 font-normal border-slate-500 border rounded-lg justify-start items-center h-[3rem]"
              onChange={handleFileChange}
            />
          </div>
        </div>
        {isAddData && isEditData == false && (
          <>
            <button className="button-add" onClick={handleSubmit}>
              Simpan dokumen
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </>
        )}
        {isAddData == true && isEditData == true && (
          <>
            <button className="button-add" onClick={handleUpdate}>
              Update dokumen
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </>
        )}
      </div>

      <table className="w-[100%] text-left text-sm font-normal">
        <thead>
          <tr className="bg-slate-700 text-slate-300 rounded-xl font-normal py-6 w-full">
            <th className="px-4 py-4 font-medium rounded-l-xl">Nama Dokumen</th>
            <th className="px-4 py-4 font-medium ">Kategori Dokumen</th>
            <th className="px-4 py-4 font-medium ">Tanggal Terbit</th>

            <th className="px-4 py-4 font-medium">Tanggal Diunggah</th>
            <th className="px-4 py-4 font-medium ">Status</th>

            <th className="px-4 py-4 font-medium rounded-r-xl">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((data) => (
            <tr className="hover:cursor-pointer">
              <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-4 text-white capitalize">
                {data.namaDokumen}
              </td>

              <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-4 text-white capitalize">
                {data.kategoriDokumen}
              </td>

              <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-4 text-white">
                {formatTanggal(data.tanggalTerbitDokumen)}
              </td>

              <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-4 text-white">
                {formatTanggal(data.tanggalUpload)}
              </td>
              <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-4 text-white">
                {data.statusDokumen}
              </td>
              <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] max-w-[17rem] px-4 py-4 text-white">
                <div className="flex w-full justify-between items-center">
                  <div className="h-[3.2rem] w-[3.2rem] hover:border-2 hover:border-teal-500 flex justify-center items-center rounded-full bg-transparent p-1 relative ">
                    <div className="h-full w-full justify-center items-center rounded-full bg-white opacity-15 absolute top-0 left-0 "></div>
                    <button
                      className="btnCloud"
                      onClick={() => handleEdit(data)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="white"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 20h4L18.5 9.5a2.828 2.828 0 1 0-4-4L4 16zm9.5-13.5l4 4"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="h-[3.2rem] w-[3.2rem] hover:border-2 hover:border-teal-500 flex justify-center items-center rounded-full bg-transparent p-1 relative ">
                    <div className="h-full w-full justify-center items-center rounded-full bg-white opacity-15 absolute top-0 left-0 "></div>
                    <button
                      className="btnCloud-delete"
                      onClick={() => handleDelete(data)}
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
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={data.url}
                    className="animated-button-doc"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="arr-2"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                    </svg>
                    <span className="text">Lihat Dokumen</span>
                    <svg
                      viewBox="0 0 24 24"
                      className="arr-1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                    </svg>
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
}

export default TableEmployeeDetail;
