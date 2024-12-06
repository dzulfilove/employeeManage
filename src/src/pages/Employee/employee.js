import React, { Component } from "react";
import CardEmployee from "../../components/employee/cardEmployee";
import TableEmployee from "../../components/employee/tableEmployee";
import { db } from "../../config/firebase";
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
      isGetData: false,
      dataExport: [],
      judul: [],
      totalKaryawanBaru: 0,
      totalAkanBerakhir: 0,
      tanggal: dayjs().locale("id").format("YYYY/MM/DD"),
    };
  }

  componentDidMount() {
    this.getAllEmployees();
    this.getTimData();
    // this.getEmployeeDocuments();
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
        (item) => item.statusKaryawan != "Karyawan Tidak Aktif"
      );
      console.log(employeesData);
      const dataFormat = dataKaryawan.map((data) => ({
        ...data,
        sisaKontrak: this.sisaMasaKontrak(
          this.state.tanggal,
          data.tanggalAkhirKontrak
        ),
        lamaKerja: this.sisaMasaKontrak(
          data.tanggalAwalMasuk,
          this.state.tanggal
        ),
      }));

      const dataKontrak = dataFormat.filter(
        (item) => item.statusKaryawan !== "Karyawan Tetap"
      );
      const dataBerakhir = dataKontrak.filter(
        (data) =>
          data.sisaKontrak < 180 &&
          data.sisaKontrak > 0 &&
          data.statusKaryawan !== "Karyawan Tidak Aktif"
      );
      const sudahBerakhir = dataKontrak.filter(
        (item) =>
          item.statusKaryawan == "Karyawan Tidak Aktif" || item.sisaKontrak < 0
      );
      const dataBaru = dataKontrak.filter(
        (data) =>
          data.lamaKerja <= 60 && data.statusKaryawan !== "Karyawan Tidak Aktif"
      );
      console.log(dataFormat, "data Baru Format");

      this.formatCSVData(dataFormat);
      this.setState({
        dataEmployees: dataFormat,
        dataKaryawanBaru: dataBaru,
        datakaryawanBerakhir: dataBerakhir,
        dataBerakhir: sudahBerakhir,
        dataDisplay: dataFormat,
        totalKaryawan: dataKaryawan.length,
        isGetData: true,
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

  formatCSVData = (data) => {
    const sortedData = data.sort((a, b) => a.lamaKerja - b.lamaKerja);
    console.log(sortedData, "sort");
    const dataArrayString = sortedData.map((obj, index) => {
      return [
        index + 1,
        // obj.fotoTerbaru,
        obj.nama,
        obj.email,
        obj.nik.toString(),
        obj.alamat,
        obj.tanggalLahir,
        obj.riwayatPendidikan,
        obj.nomorWhatsapp ? ` ${obj.nomorWhatsapp.toString()}` : "",
        obj.kontakLain ? ` ${obj.kontakLain.toString()}` : "",
        obj.noRekening ? obj.noRekening.toString() : "",
        obj.tanggalAwalMasuk,
        obj.tanggalAwalKontrak,
        obj.tanggalAkhirKontrak,
        obj.posisi,
        obj.divisi,
        obj.cabang,
        obj.masaKerja,
        obj.gaji,
        obj.statusKaryawan,
      ];
    });
    console.log(dataArrayString[0], "array");
    const cleanedData = dataArrayString.map((row) =>
      row.map((item) => {
        // Pastikan hanya memproses string dan bukan tipe data lain
        return typeof item === "string" ? item.replace(/\n/g, "") : item;
      })
    );
    const propertyNames = [
      ["Rekap Data Karyawan"],
      [""],

      [""],
      [
        "No",
        // "Foto",
        "Nama Pegawai",
        "Email",
        "NIK",
        "Alamat",
        "Tanggal Lahir",
        "Riwayat Pendidikan",
        "Nomor Whatsapp",
        "Nomor Kontak Lain",
        "Nomor Rekening",
        "Tanggal Masuk",
        "Tanggal Awal Kontrak",
        "Tanggal Akhir Kontrak",
        "Posisi",
        "Divisi",
        "Lokasi Kerja",
        "Masa Kerja",
        "Gaji",
        "Status",
      ],
    ];

    this.setState({ judul: propertyNames, dataExport: cleanedData });
  };

  convertToCSV = (array) => {
    return array.map((row) => row.join(";")).join("\n");
  };

  downloadCSV = (data, fileName) => {
    const csvData = new Blob([data], { type: "text/csv;charset=utf-8;" });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  handleExport = () => {
    console.log(this.state.rekapKehadiran);
    const { dataExport, judul } = this.state;
    // Flatten the array for csv
    const csvContent = this.convertToCSV([...judul, ...dataExport]);
    this.downloadCSV(csvContent, `Data Rekap Karyawan Perusahaan.csv`);
  };
  removeNewLines = (arr) => {
    return arr.map((innerArray) =>
      innerArray.map((str) => str.replace(/\n/g, ""))
    );
  };
  render() {
    return (
      <div>
        <div className="flex w-full justify-start p-4 items-center text-white text-2xl border-b border-b-teal-500 pb-10">
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
            exportData={this.handleExport}
            data={this.state.dataDisplay}
            getData={this.state.isGetData}
            changeData={this.handleTab}
            dataDivisi={this.state.dataDivisi}
          />
        </div>
      </div>
    );
  }
}

export default Employee;
