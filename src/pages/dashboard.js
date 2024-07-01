import React, { Component } from "react";
import CardDashboard from "../components/dashboard/cardDashboard";
import TableDashboard from "../components/dashboard/tableDashboard";
import TableDashboardDivision from "../components/dashboard/tableDashboardDivision";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import dayjs from "dayjs";
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataKosong: [],
      dataDivisi: [],
      dataEmployees: [],
      totalKaryawan: 0,
      totalAkanBerakhir: 0,
      totalDivisi: 0,
      tanggal: dayjs().locale("id").format("YYYY/MM/DD"),
      totalkandidat: 0,
      candidateList: [],
    };
  }

  componentDidMount() {
    this.getAllEmployees();
    this.getAllCandidate();
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

      console.log(employeesData);
      const dataFormat = employeesData.map((data) => ({
        ...data,
        sisaKontrak: this.sisaMasaKontrak(
          this.state.tanggal,
          data.tanggalAkhirKontrak
        ),
        lamaKerja: this.sisaMasaKontrak(
          data.tanggalAwalKontrak,
          this.state.tanggal
        ),
      }));

      const dataBerakhir = dataFormat.filter((data) => data.sisaKontrak < 90);
      console.log(dataFormat, "data Baru Format");
      this.setState({
        dataEmployees: dataBerakhir,
        totalKaryawan: dataFormat.length,
        totalAkanBerakhir: dataBerakhir.length,
      });
      this.getTimData(dataFormat);
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };

  getTimData = async (dataEmployee) => {
    try {
      const timCollection = collection(db, "Tim");
      const timSnapshot = await getDocs(timCollection);
      const timList = timSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const data = this.removeDuplicates(timList);

      console.log(data, "tim");
      // Langkah 1: Buat objek untuk menyimpan jumlah pengguna per kelas
      const userCounts = {};

      // Langkah 2: Iterasi melalui array users untuk menghitung jumlah pengguna per kelas
      dataEmployee.forEach((user) => {
        if (userCounts[user.divisi]) {
          userCounts[user.divisi]++;
        } else {
          userCounts[user.divisi] = 1;
        }
      });

      // Langkah 3: Iterasi melalui array classes untuk menambahkan properti jumlahUser
      const updatedClasses = data.map((classItem) => ({
        ...classItem,
        jumlahKaryawan: userCounts[classItem.Nama] || 0,
      }));
      this.setState({ dataDivisi: updatedClasses, totalDivisi: data.length });
    } catch (error) {
      console.error("Error fetching Tim data: ", error);
      return [];
    }
  };

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
      console.log("kandidat", kandidatKaryawan);
      await new Promise((resolve) => {
        this.setState({ candidateList: kandidatKaryawan }, resolve);
      });
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };

  // Format data

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
  sisaMasaKontrak = (startDate, endDate) => {
    const start = dayjs(startDate, "YYYY/MM/DD");
    const end = dayjs(endDate, "YYYY/MM/DD");

    const diffInDays = end.diff(start, "day");

    return diffInDays;
  };

  render() {
    console.log(this.state.dataDivisi, "divisi");
    return (
      <div>
        <div className="flex w-full justify-start p-4 items-center text-white text-3xl mb-6">
          Employee Management System
        </div>
        <CardDashboard
          totalKaryawan={this.state.totalKaryawan}
          totalAkanBerakhir={this.state.totalAkanBerakhir}
          totalDivisi={this.state.totalDivisi}
          totalKandidat={this.state.totalkandidat}
        />
        <div className="flex justify-between w-full items-start gap-16">
          <TableDashboard
            dataEmployees={this.state.dataEmployees}
            dataKandidat={this.state.candidateList}
          />

          <TableDashboardDivision dataDivisi={this.state.dataDivisi} />
        </div>
      </div>
    );
  }
}

export default Dashboard;
