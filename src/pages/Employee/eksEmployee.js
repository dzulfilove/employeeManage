import React, { Component } from "react";
import CardEmployee from "../../components/employee/cardEmployee";
import TableEmployee from "../../components/employee/tableEmployee";
import { db } from "../../config/firebase";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import TableEksEmployee from "../../components/employee/tableEksEmployee";
import CardEksEmployee from "../../components/employee/cardEksEmployee";
class EksEmployee extends Component {
  constructor(props) {
    super(props);
    const idPerusahaan = sessionStorage.getItem("refPerusahaan");

    this.state = {
      dataEmployees: [],
      dataDivisi: [],
      dataDisplay: [],
      dataKaryawanBaru: [],
      dataKaryawanLama: [],
      dataBerakhir: [],
      employeeDocuments: [],
      totalKaryawan: 0,
      totalDivisi: 0,
      refPerusahaan: idPerusahaan,
      isGetData: false,
      totalKaryawanBaru: 0,
      totalKaryawanLama: 0,
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

      const dataKaryawan = employeesData.filter(
        (item) => item.statusKaryawan == "Karyawan Tidak Aktif"
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
          data.tanggalBerhentiKontrak
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
      console.log(dataBaru, "baru");
      console.log(dataLama, "lama");
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
      this.setState({ dataDisplay: this.state.dataKaryawanBaru });
    } else {
      this.setState({ dataDisplay: this.state.dataKaryawanLama });
    }
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
          Karyawan Perusahaan
        </div>
        <CardEksEmployee
          totalKaryawan={this.state.totalKaryawan}
          totalKaryawanBaru={this.state.totalKaryawanBaru}
          totalKaryawanLama={this.state.totalKaryawanLama}
          totalDivisi={this.state.totalDivisi}
        />
        <div className="flex justify-center w-full items-start gap-16 text-md">
          <TableEksEmployee
            getData={this.state.isGetData}
            data={this.state.dataDisplay}
            changeData={this.handleTab}
            dataDivisi={this.state.dataDivisi}
          />
        </div>
      </div>
    );
  }
}

export default EksEmployee;
