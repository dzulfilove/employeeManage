import React, { Component } from "react";

import { db } from "../../config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import TablePosition from "../../components/masterData/position/tablePosition";
import Swal from "sweetalert2";
class MasterDataPosition extends Component {
  constructor(props) {
    super(props);
    const idPerusahaan = sessionStorage.getItem("refPerusahaan");

    this.state = {
      dataEmployees: [],
      candidateList: [],
      dataDisplay: [],
      dataKaryawanBaru: [],
      dataKaryawanLama: [],
      dataBerakhir: [],
      employeeDocuments: [],
      totalKaryawan: 0,
      totalDivisi: 0,
      refPerusahaan: idPerusahaan,
      isGetData: false,
      optionPosisi: [],
      dataPosisi: [],
      dataPosisiLoker: [],
      tanggal: dayjs().locale("id").format("YYYY/MM/DD"),
    };
  }

  componentDidMount() {
    this.getAllEmployees();
    this.getAllCandidate();
  }

  // Get Data
  getAllCandidate = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "employeesApplicant"));

      if (querySnapshot.empty) {
        console.log("Tidak ada dokumen yang ditemukan.");
        return;
      }

      let kandidatKaryawan = [];
      for (const doc of querySnapshot.docs) {
        const employeeData = { id: doc.id, ...doc.data() };

        const experienceCollectionRef = collection(doc.ref, "pengalamanKerja");
        const experienceSnapshot = await getDocs(experienceCollectionRef);
        let experienceData = [];
        experienceSnapshot.forEach((expDoc) => {
          experienceData.push({ id: expDoc.id, ...expDoc.data() });
        });
        employeeData.pengalamanKerja = experienceData;

        kandidatKaryawan.push(employeeData);
      }
      this.getAllPosisiLoker(kandidatKaryawan);

      await new Promise((resolve) => {
        this.setState(
          {
            candidateList: kandidatKaryawan,
          },
          resolve
        );
      });
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };
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
      const dataFormat = dataKaryawan.map((data) => ({
        ...data,
        // waktuKerja: this.sisaMasaKontrak(
        //   data.tanggalAwalMasuk,
        //   data.tanggalBerhentiKontrak
        // ),
        lamaKerja: this.sisaMasaKontrak(
          data.tanggalAwalMasuk,
          data.tanggalAkhirKontrak
        ),
      }));

      const dataBaru = dataFormat.filter((data) => data.lamaKerja <= 140);
      const dataLama = dataFormat.filter((data) => data.lamaKerja > 140);
      console.log(dataFormat, "data Baru Format");
      this.setState({
        dataEmployees: dataFormat,
        dataKaryawanBaru: dataBaru,
        dataKaryawanLama: dataLama,
        dataDisplay: dataFormat,
        totalKaryawanBaru: dataBaru.length,
        totalKaryawanLama: dataLama.length,
        totalKaryawan: dataKaryawan.length,
        isGetData: true,
      });
      this.getAllPosisi(dataKaryawan);

      console.log(dataBaru, "baru");
      console.log(dataLama, "lama");
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };

  getAllPosisi = async (data) => {
    try {
      const querySnapshot = await getDocs(collection(db, "divisions"));

      if (querySnapshot.empty) {
        console.log("Tidak ada dokumen yang ditemukan.");
        return;
      }
      const divisions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const dataOption = divisions.map((data) => ({
        text: data.namaPosisi,
        value: data.namaPosisi,
      }));

      const posisiDenganJumlahPegawai = divisions.map((posisiObj) => {
        const jumlahPegawai = data.filter(
          (pegawaiObj) => pegawaiObj.posisi === posisiObj.namaPosisi
        ).length;
        return {
          ...posisiObj,
          jumlahPegawai: jumlahPegawai,
        };
      });
      const dataFilter = posisiDenganJumlahPegawai.filter(
        (item) => item.jumlahPegawai > 0
      );

      console.log(dataFilter, "posisi gawai");
      console.log(dataOption, "data Option divisi");
      console.log(data, "posisi Pegawai");
      console.log("posisi baru Pegawai", posisiDenganJumlahPegawai);
      this.setState({
        dataPosisi: posisiDenganJumlahPegawai,
        optionPosisi: dataOption,
        isGetData: true,
      });
    } catch (error) {
      console.error("Error fetching divisions:", error.message);
    }
  };

  getAllPosisiLoker = async (data) => {
    try {
      const querySnapshot = await getDocs(collection(db, "posisiLoker"));

      if (querySnapshot.empty) {
        console.log("Tidak ada dokumen yang ditemukan.");
        return;
      }
      const divisions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const posisiDenganJumlahPelamar = divisions.map((posisiObj) => {
        const jumlahPelamar = data.filter(
          (pegawaiObj) => pegawaiObj.posisi === posisiObj.text
        ).length;
        return {
          ...posisiObj,
          jumlahPelamar: jumlahPelamar,
        };
      });

      this.setState({
        dataPosisiLoker: posisiDenganJumlahPelamar,

        isGetData: true,
      });
    } catch (error) {
      console.error("Error fetching divisions:", error.message);
    }
  };

  // handleData
  handleTab = (name) => {
    if (name == "tab1") {
      this.setState({ dataDisplay: this.state.dataEmployees });
    } else if (name == "tab2") {
      this.setState({ dataDisplay: this.state.dataKaryawanBaru });
    } else {
      this.setState({ dataDisplay: this.state.dataKaryawanLama });
    }
  };

  submitPosisiLoker = async (data) => {
    if (data.text == "") {
      Swal.fire({
        title: "Gagal",
        text: "Pilih Nama Posisi Terlebih Dahulu",
        icon: "error",
      });
    } else {
      try {
        const divisionRef = await addDoc(collection(db, "posisiLoker"), data);
        Swal.fire({
          title: "Berhasil!",
          text: "Data Posisi Kandidat Berhasil Ditambahkan",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            this.getAllPosisiLoker(this.state.candidateList);
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
  submitPosisi = async (data) => {
    if (data.namaPosisi == "") {
      Swal.fire({
        title: "Gagal",
        text: "Tambahkan Nama Posisi Terlebih Dahulu",
        icon: "error",
      });
    } else {
      try {
        const divisionRef = await addDoc(collection(db, "divisions"), data);
        Swal.fire({
          title: "Berhasil!",
          text: "Data Posisi Berhasil Ditambahkan",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            this.getAllPosisi(this.state.dataEmployees);
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

  handleDeletePosisi = async (data) => {
    const posisiRef = doc(db, "divisions", data.id);
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
      text: "Posisi Ini Akan Dihapus Secara Permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Setelah menghapus subkoleksi, hapus dokumen dari koleksi utama
          await deleteDoc(posisiRef);
          console.log(
            `Dokumen dengan ID ${data} dan subkoleksi 'pengalamanKerja' telah dihapus.`
          );

          Swal.fire({
            title: "Berhasil!",
            text: "Data Posisi Berhasil Dihapus",
            icon: "success",
          });
          this.getAllPosisi(this.state.dataEmployees);
        } catch (error) {
          console.error("Error removing document: ", error);
        }
      }
    });
  };

  handleDeletePosisiLoker = async (data) => {
    const posisiRef = doc(db, "posisiLoker", data.id);

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Posisi Ini Akan Dihapus Secara Permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Setelah menghapus subkoleksi, hapus dokumen dari koleksi utama
          await deleteDoc(posisiRef);
          console.log(
            `Dokumen dengan ID ${data} dan subkoleksi 'pengalamanKerja' telah dihapus.`
          );

          Swal.fire({
            title: "Berhasil!",
            text: "Data Posisi Berhasil Dihapus",
            icon: "success",
          });
          this.getAllPosisiLoker(this.state.candidateList);
        } catch (error) {
          console.error("Error removing document: ", error);
        }
      }
    });
  };

  // Format data
  sisaMasaKontrak = (startDate, endDate) => {
    const start = dayjs(startDate, "YYYY/MM/DD");
    const end = dayjs(endDate, "YYYY/MM/DD");

    const diffInDays = end.diff(start, "day");

    return diffInDays;
  };

  removeDuplicates(dataArray) {
    // Gunakan objek untuk melacak nama yang sudah ada
    const uniqueNames = {};

    // Filter dataArray untuk hanya menyimpan objek dengan nama yang unik
    const filteredArray = dataArray.filter((item) => {
      if (!uniqueNames[item.Nama]) {
        uniqueNames[item.Nama] = true;
        return true; // Simpan item jika nama belum ada dalam uniqueNames
      }
      return false; // Abaikan item jika nama sudah ada dalam uniqueNames
    });

    return filteredArray;
  }

  render() {
    return (
      <div>
        <div className="flex w-full justify-start p-4 items-center text-white text-2xl border-b border-b-teal-500 pb-10">
          Master Data Posisi Karyawan
        </div>

        <div className="flex justify-center w-full items-start gap-16 text-md">
          <TablePosition
            getData={this.state.isGetData}
            dataPosisi={this.state.dataPosisi}
            optionPosisi={this.state.optionPosisi}
            changeData={this.handleTab}
            dataPosisiLoker={this.state.dataPosisiLoker}
            submitPosisiLoker={this.submitPosisiLoker}
            submitPosisi={this.submitPosisi}
            deletePosisi={this.handleDeletePosisi}
            deletePosisiLoker={this.handleDeletePosisiLoker}
          />
        </div>
      </div>
    );
  }
}

export default MasterDataPosition;
