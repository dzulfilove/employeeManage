import React, { Component } from "react";
import CardEmployee from "../components/employee/cardEmployee";
import TableEmployee from "../components/employee/tableEmployee";
import { db } from "../config/firebase";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
class Employee extends Component {
  constructor(props) {
    super(props);
    const idPerusahaan = sessionStorage.getItem("refPerusahaan");

    this.state = {
      dataEmployees: [],
      dataDivisi: [],
      dataDisplay: [],
      dataKaryawanBaru: [],
      datakaryawanBerakhir: [],
      dataBerakhir: [],
      employeeDocuments: [],
      totalKaryawan: 0,
      totalDivisi: 0,
      refPerusahaan: idPerusahaan,

      totalKaryawanBaru: 0,
      totalAkanBerakhir: 0,
      tanggal: dayjs().locale("id").format("YYYY/MM/DD"),
    };
  }

  componentDidMount() {
    this.getAllEmployees();
    this.getTimData();
    this.getEmployeeDocuments();
  }

  // Get Data
  getEmployeeDocuments = async (id) => {
    try {
      const subCollectionRef = collection(
        db,
        "employees",
        id,
        "dokumenKaryawan"
      );
      const querySnapshot = await getDocs(subCollectionRef);
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      console.log("Dokumen Karyawan:", documents);
      this.setState({ employeeDocuments: documents });
    } catch (error) {
      console.error("Error mengambil dokumen subkoleksi: ", error);
      this.setState({ employeeDocuments: [] });
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

      const dataBerakhir = dataFormat.filter(
        (data) =>
          data.sisaKontrak < 90 &&
          data.statusKaryawan !== "Karyawan Tidak Aktif"
      );
      const sudahBerakhir = dataFormat.filter(
        (item) => item.statusKaryawan == "Karyawan Tidak Aktif"
      );
      const dataBaru = dataFormat.filter(
        (data) =>
          data.lamaKerja <= 30 && data.statusKaryawan !== "Karyawan Tidak Aktif"
      );
      console.log(dataFormat, "data Baru Format");
      this.setState({
        dataEmployees: dataFormat,
        dataKaryawanBaru: dataBaru,
        datakaryawanBerakhir: dataBerakhir,
        dataBerakhir: sudahBerakhir,
        dataDisplay: dataFormat,
        totalKaryawan: employeesData.length,
        totalKaryawanBaru: dataBaru.length,
        totalAkanBerakhir: dataBerakhir.length,
      });
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };

  getTimData = async () => {
    const refPerusahaan = doc(db, "Perusahaan", this.state.refPerusahaan);

    try {
      const q = query(
        collection(db, "Tim"),
        where("refPerusahaan", "==", refPerusahaan)
      );
      const querySnapshot = await getDocs(q);

      const timList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const data = this.removeDuplicates(timList);
      const dataOption = data.map((item) => ({
        text: item.Nama,
        value: item.Nama,
      }));
      this.setState({ dataDivisi: dataOption });
    } catch (error) {
      console.error("Error fetching Tim data: ", error);
      return [];
    }
  };

  // handleData
  handleTab = (name) => {
    if (name == "tab1") {
      this.setState({ dataDisplay: this.state.dataEmployees });
    } else if (name == "tab2") {
      this.setState({ dataDisplay: this.state.datakaryawanBerakhir });
    } else if (name == "tab3") {
      this.setState({ dataDisplay: this.state.dataBerakhir });
    } else {
      this.setState({ dataDisplay: this.state.dataKaryawanBaru });
    }
  };
  // Format data
  sisaMasaKontrak = (startDate, endDate) => {
    const start = dayjs(startDate, "YYYY/MM/DD");
    const end = dayjs(endDate, "YYYY/MM/DD");

    const diffInDays = end.diff(start, "day");

    return diffInDays - 1;
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
        <div className="flex w-full justify-start p-4 items-center text-white text-3xl mb-6">
          Karyawan Perusahaan
        </div>
        <CardEmployee
          totalKaryawan={this.state.totalKaryawan}
          totalAkanBerakhir={this.state.totalAkanBerakhir}
          totalKaryawanBaru={this.state.totalKaryawanBaru}
          totalDivisi={this.state.totalDivisi}
        />
        <div className="flex justify-center w-full items-start gap-16 text-md">
          <TableEmployee
            data={this.state.dataDisplay}
            changeData={this.handleTab}
            dataDivisi={this.state.dataDivisi}
          />
        </div>
      </div>
    );
  }
}

export default Employee;
