import React, { Component } from "react";

import { db } from "../../config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import TablePosition from "../../components/masterData/position/tablePosition";
import Swal from "sweetalert2";
import TableDivision from "../../components/masterData/division/tableDivision";
class MasterDataDivisi extends Component {
  constructor(props) {
    super(props);
    const idPerusahaan = sessionStorage.getItem("refPerusahaan");

    this.state = {
      dataEmployees: [],
      candidateList: [],
      dataDisplay: [],
      optionperusahaan: [],
      totalKaryawan: 0,

      refPerusahaan: idPerusahaan,
      isGetData: false,
      dataDivisi: [],
      tanggal: dayjs().locale("id").format("YYYY/MM/DD"),
    };
  }

  componentDidMount() {
    this.getAllEmployees();
    this.getPerusahaanData();
  }

  // Get Data

  getAllEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "employees"));

      if (querySnapshot.empty) {
        console.log("Tidak ada dokumen yang ditemukan.");
        return;
      }

      let employeesData = [];
      for (const doc of querySnapshot.docs) {
        const employeeData = { id: doc.id, ...doc.data() };

        // Sub Collection Pengalaman
        const experienceCollectionRef = collection(doc.ref, "experience");
        const experienceSnapshot = await getDocs(experienceCollectionRef);
        let experienceData = [];
        experienceSnapshot.forEach((expDoc) => {
          experienceData.push({ id: expDoc.id, ...expDoc.data() });
        });
        employeeData.experience = experienceData;

        // Sub Collection Documentnya
        const documentsEmployeCollectionRef = collection(
          doc.ref,
          "documentsEmploye"
        );
        const documentsEmployeSnapshot = await getDocs(
          documentsEmployeCollectionRef
        );
        let documentsEmployeData = [];
        documentsEmployeSnapshot.forEach((docDoc) => {
          documentsEmployeData.push({ id: docDoc.id, ...docDoc.data() });
        });
        employeeData.documentsEmploye = documentsEmployeData;

        employeesData.push(employeeData);
      }

      const dataKaryawan = employeesData.filter(
        (item) => item.statusKaryawan !== "Karyawan Tidak Aktif"
      );
      console.log(employeesData);

      this.setState({
        dataEmployees: dataKaryawan,

        dataDisplay: dataKaryawan,

        totalKaryawan: dataKaryawan.length,
      });

      this.getTimData(dataKaryawan);
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };

  getTimData = async (dataPegawai) => {
    try {
      const querySnapshot = await getDocs(collection(db, "Tim"));

      const timList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch namaPerusahaan based on refPerusahaan for each tim object
      const timListWithCompanyNames = await Promise.all(
        timList.map(async (tim) => {
          if (tim.refPerusahaan) {
            const perusahaanDoc = await getDoc(tim.refPerusahaan);
            if (perusahaanDoc.exists()) {
              return {
                ...tim,
                namaPerusahaan: perusahaanDoc.data().nama,
              };
            }
          }
          return tim;
        })
      );

      const dataOption = timListWithCompanyNames.map((item) => ({
        text: item.Nama,
        value: item.Nama,
      }));

      const posisiDenganJumlahPegawai = timListWithCompanyNames.map(
        (divisiObj) => {
          const jumlahPegawai = dataPegawai.filter(
            (pegawaiObj) => pegawaiObj.divisi === divisiObj.Nama
          ).length;
          return {
            ...divisiObj,
            jumlahPegawai: jumlahPegawai,
          };
        }
      );

      console.log(posisiDenganJumlahPegawai, "data Divisi");
      this.setState({
        dataDivisi: posisiDenganJumlahPegawai,

        isGetData: true,
      });
    } catch (error) {
      console.error("Error fetching Tim data: ", error);
      return [];
    }
  };

  getPerusahaanData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Perusahaan"));

      if (querySnapshot.empty) {
        console.log("Tidak ada dokumen yang ditemukan.");
        return;
      }
      const perusahaan = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const dataOption = perusahaan.map((data) => ({
        text: data.nama,
        value: data.id,
      }));

      this.setState({
        optionperusahaan: dataOption,
      });
    } catch (error) {
      console.error("Error fetching Tim data: ", error);
      return [];
    }
  };

  // handleData
  submitDivisi = async (data) => {
    if (data.Nama == "" || data.Deskripsi == "" || data.refPerusahaan == "") {
      Swal.fire({
        title: "Gagal",
        text: "Lengkapi Data Terlebih Dahulu",
        icon: "error",
      });
    } else {
      try {
        const divisionRef = await addDoc(collection(db, "Tim"), data);
        Swal.fire({
          title: "Berhasil!",
          text: "Data Posisi Berhasil Ditambahkan",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            this.getTimData(this.state.dataEmployees);
          }
        });
      } catch (error) {
        console.error("Error saving applicant data:", error);
        Swal.fire({
          title: "Error!",
          text: "Wih, Error tuch",
          icon: "error",
        });
      }
    }
  };

  handleDeleteDivisi = async (data) => {
    const DivisiRef = doc(db, "Tim", data.id);
    const peran = sessionStorage.getItem("peran");
    if (peran !== "Scrum Master") {
      Swal.fire({
        title: "Perhatian!",
        text: "Anda Tidak Memiliki Akses Untuk Menghapus !",
        icon: "warning",
      });
      return;
    }
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Divisi Ini Akan Dihapus Secara Permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Setelah menghapus subkoleksi, hapus dokumen dari koleksi utama
          await deleteDoc(DivisiRef);
          console.log(
            `Dokumen dengan ID ${data} dan subkoleksi 'pengalamanKerja' telah dihapus.`
          );

          Swal.fire({
            title: "Berhasil!",
            text: "Data Divisi Berhasil Dihapus",
            icon: "success",
          });
          this.getTimData(this.state.dataEmployees);
        } catch (error) {
          console.error("Error removing document: ", error);
        }
      }
    });
  };

  // Format data

  render() {
    return (
      <div>
        <div className="flex w-full justify-start p-4 items-center text-white text-2xl border-b border-b-teal-500 pb-10">
          Master Data Divisi Karyawan
        </div>

        <div className="flex justify-center w-full items-start gap-16 text-md">
          <TableDivision
            getData={this.state.isGetData}
            data={this.state.dataDivisi}
            optionData={this.state.optionperusahaan}
            submitDivisi={this.submitDivisi}
            deleteDivisi={this.handleDeleteDivisi}
          />
        </div>
      </div>
    );
  }
}

export default MasterDataDivisi;
