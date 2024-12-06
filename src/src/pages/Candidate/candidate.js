import React, { Component } from "react";

import CardCandidate from "../../components/candidate/cardCandidate";
import TableCandidate from "../../components/candidate/tableCandidate";
import { db } from "../../config/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
class Candidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataKosong: [],
      dataDivisi: [],
      candidateList: [],
      tahapSeleksiAwal: [],
      tahapAdministrasi: [],
      tahapTes: [],
      isGetData: false,
      tahapInterview: [],
      dataPosisi: [],
    };
  }

  async componentDidMount() {
    this.getTimData();
    await this.getAllCandidate();
    await this.getCandidateFiltered();
    this.getAllDivisions();
  }

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

  getCandidateFiltered = () => {
    const { candidateList } = this.state;
    const tahapAwal = this.filterCandidate(candidateList, "tahapSeleksiAwal");
    const administrasi = this.filterCandidate(
      candidateList,
      "tahapAdministrasi"
    );
    const tahapTes = this.filterCandidate(candidateList, "tahapTes");
    const tahapInterview = this.filterCandidate(
      candidateList,
      "tahapInterview"
    );
    this.setState({
      tahapSeleksiAwal: tahapAwal,
      tahapAdministrasi: administrasi,
      tahapTes: tahapTes,
      isGetData: true,

      tahapInterview: tahapInterview,
    });
  };

  getAllDivisions = async () => {
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
      console.log(dataOption, "data Option divisi");
      this.setState({ dataPosisi: dataOption });
    } catch (error) {
      console.error("Error fetching divisions:", error.message);
    }
  };
  getTimData = async () => {
    try {
      const timCollection = collection(db, "Tim");
      const timSnapshot = await getDocs(timCollection);
      const timList = timSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const dataOption = timList.map((item) => ({
        text: item.Nama,
        value: item.id,
      }));

      this.setState({ dataDivisi: dataOption });
    } catch (error) {
      console.error("Error fetching Tim data: ", error);
      return [];
    }
  };

  filterCandidate(dataArray, status) {
    return dataArray.filter((candidate) => candidate.statusTahap === status);
  }

  // hanldeData

  deleteEmployeeData = async (employeeId) => {
    const peran = sessionStorage.getItem("peran");
    if (peran !== "Scrum Master") {
      Swal.fire({
        title: "Perhatian!",
        text: "Anda Tidak Memiliki Akses Untuk Menghapus !",
        icon: "warning",
      });
      return;
    }
    const employeeRef = doc(db, "employeesApplicant", employeeId);

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Kandidat akan dihapus secara permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Hapus subkoleksi "pengalamanKerja" terlebih dahulu
          const pengalamanKerjaRef = collection(
            db,
            `employeesApplicant/${employeeId}/pengalamanKerja`
          );
          const snapshot = await getDocs(pengalamanKerjaRef);
          snapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
          });

          // Setelah menghapus subkoleksi, hapus dokumen dari koleksi utama
          await deleteDoc(employeeRef);
          console.log(
            `Dokumen dengan ID ${employeeId} dan subkoleksi 'pengalamanKerja' telah dihapus.`
          );

          Swal.fire({
            title: "Berhasil!",
            text: "Data Kandidat Berhasil Dihapus",
            icon: "success",
          });
          this.getAllCandidate();
        } catch (error) {
          console.error("Error removing document: ", error);
        }
      }
    });
  };

  render() {
    const { dataDivisi, candidateList } = this.state;
    const { tahapSeleksiAwal, tahapAdministrasi, tahapTes, tahapInterview } =
      this.state;
    return (
      <div>
        <div className="flex w-full justify-start p-4 items-center text-white text-2xl border-b border-b-teal-500 pb-10">
          Kandidat Calon Karyawan
        </div>
        <CardCandidate
          candidateList={candidateList}
          tahapSeleksiAwal={tahapSeleksiAwal}
          tahapAdministrasi={tahapAdministrasi}
          tahapTes={tahapTes}
          tahapInterview={tahapInterview}
        />
        <div className="flex justify-center w-full items-start gap-16">
          <TableCandidate
            dataDivisi={dataDivisi}
            dataPosisi={this.state.dataPosisi}
            candidateList={candidateList}
            tahapSeleksiAwal={tahapSeleksiAwal}
            tahapAdministrasi={tahapAdministrasi}
            tahapTes={tahapTes}
            getData={this.state.isGetData}
            tahapInterview={tahapInterview}
            deleteData={this.deleteEmployeeData}
          />
        </div>
      </div>
    );
  }
}

export default Candidate;
