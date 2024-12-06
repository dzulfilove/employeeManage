import React, { Component } from "react";
import swal from "sweetalert2";

import CardDetailEmployee from "../../components/employee/cardDetailEmployee";
import TableEmployeeDetail from "../../components/employee/tableEmployeeDetail";
import withRouter from "../../components/features/withRouter";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import {
  addDoc,
  deleteDoc,
  getFirestore,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db } from "../../config/firebase";
import { generateRandomString } from "../../components/features/utils";
class EmployeeDetail extends Component {
  constructor(props) {
    super(props);
    const { id } = this.props.params;
    const idPerusahaan = sessionStorage.getItem("refPerusahaan");

    this.state = {
      idEmployee: id,
      dataDivisi: [],
      dataLokasi: [],
      dataPosisi: [],
      dataEmployee: {},
      isLoad: false,
      refPerusahaan: idPerusahaan,
      employeeDocuments: [],
    };
  }

  componentDidMount() {
    this.getEmployee(this.state.idEmployee);
    this.getAllCabang();
    this.getTimData();
    this.getEmployeeDocuments(this.state.idEmployee);
    this.getAllPosisi();
  }

  // Get data
  getAllPosisi = async () => {
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
  getEmployee = async (id) => {
    try {
      const docRef = doc(db, "employees", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Dokumen data:", docSnap.data());
        this.setState({ dataEmployee: docSnap.data() });
      } else {
        console.log("Tidak ada dokumen yang cocok!");
        this.setState({ dataEmployee: {} });
      }
    } catch (error) {
      console.error("Error mengambil dokumen: ", error);
      this.setState({ dataEmployee: {} });
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

  getAllCabang = async () => {
    const refPerusahaan = doc(db, "Perusahaan", this.state.refPerusahaan);
    try {
      const q = query(
        collection(db, "CabangPerusahaan"),
        where("refPerusahaan", "==", refPerusahaan)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("Tidak ada dokumen yang ditemukan.");
        return;
      }
      const cabangList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const dataOption = cabangList.map((item) => ({
        value: item.id,
        text: item.nama,
      }));

      this.setState({ dataLokasi: dataOption });
    } catch (error) {
      console.error("Error fetching cabangList:", error.message);
    }
  };

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

  handleSimpanDokumenKeStorage = async (file) => {
    if (!file) {
      throw new Error("File not found");
    }
    const random = generateRandomString(12);
    const storageRef = ref(
      getStorage(),
      `dokumenKaryawan/karyawan-${random}-${file.name}`
    );

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("berhasil Upload File");
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  handleSubmitDokumen = async (
    namaDokumen,
    kategoriDokumen,
    tanggalTerbitDokumen,
    tanggalBerakhirDokumen,
    tanggal,
    statusDokumen,
    fileDokumen
  ) => {
    this.setState({ isProses: true, isLoad: true });

    try {
      if (!fileDokumen) {
        throw new Error("Dokumen tidak ditemukan");
      }

      const dokumenURL = await this.handleSimpanDokumenKeStorage(fileDokumen);

      const dokumenKaryawan = {
        namaDokumen,
        kategoriDokumen: kategoriDokumen.text,
        tanggalTerbitDokumen,
        tanggalBerakhirDokumen,
        tanggalUpload: tanggal,
        statusDokumen,
        url: dokumenURL,
      };

      // Simpan dokumen ke subkoleksi dokumenKaryawan
      const employeeDocRef = doc(
        getFirestore(),
        "employees",
        this.state.idEmployee
      );
      await addDoc(
        collection(employeeDocRef, "dokumenKaryawan"),
        dokumenKaryawan
      );

      Swal.fire({
        title: "Berhasil!",
        text: "Dokumen berhasil disimpan",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          this.getEmployeeDocuments(this.state.idEmployee);
        }
      });
    } catch (error) {
      console.error("Error saving applicant data:", error);
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat menyimpan dokumen",
        icon: "error",
      });
    }

    this.setState({ isProses: false, isLoad: false });
  };

  handleUpdateDokumen = async (
    data,
    idData,
    namaDokumen,
    kategoriDokumen,
    tanggalTerbitDokumen,
    tanggalBerakhirDokumen,
    tanggal,
    statusDokumen,
    fileDokumen
  ) => {
    try {
      let dokumenURL;

      if (data.url !== fileDokumen) {
        // Unggah file baru dan dapatkan URL-nya
        dokumenURL = await this.handleSimpanDokumenKeStorage(fileDokumen);
      } else {
        // Gunakan URL yang sudah ada
        dokumenURL = fileDokumen;
      }
      const kategoriData = kategoriDokumen;
      const dokumenKaryawan = {
        namaDokumen,
        kategoriDokumen: kategoriDokumen.value,
        tanggalBerakhirDokumen,
        tanggalTerbitDokumen,
        statusDokumen: statusDokumen.text,
        url: dokumenURL,
      };

      console.log(kategoriDokumen, "data");
      console.log("data", idData);
      // Perbarui dokumen di subkoleksi dokumenKaryawan
      const db = getFirestore();
      const employeeDocRef = doc(db, "employees", this.state.idEmployee);
      const dokumenCollectionRef = collection(
        employeeDocRef,
        "dokumenKaryawan"
      );
      const dokumenRef = doc(dokumenCollectionRef, idData);

      await setDoc(dokumenRef, dokumenKaryawan, { merge: true });

      Swal.fire({
        title: "Berhasil!",
        text: "Dokumen berhasil diperbarui",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          this.getEmployeeDocuments(this.state.idEmployee);
        }
      });
    } catch (error) {
      console.error("Error updating document:", error);
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat memperbarui dokumen",
        icon: "error",
      });
    }

    this.setState({ isProses: false, isEdit: false, idDokumenEdit: null });
  };

  handleDeleteDokumen = async (data) => {
    const { idEmployee } = this.state;
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
      text: "Dokumen akan dihapus secara permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const storage = getStorage();
          const storageRef = ref(storage, data.url);

          // Hapus file dari Firebase Storage
          await deleteObject(storageRef);

          // Hapus dokumen dari Firestore
          const employeeDocRef = doc(getFirestore(), "employees", idEmployee);
          const dokumenRef = doc(employeeDocRef, "dokumenKaryawan", data.id);
          await deleteDoc(dokumenRef);

          Swal.fire({
            title: "Berhasil!",
            text: "Dokumen berhasil dihapus",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              this.getEmployeeDocuments(this.state.idEmployee);
            }
          });
        } catch (error) {
          console.error("Error deleting document:", error);
          Swal.fire({
            title: "Error!",
            text: "Terjadi kesalahan saat menghapus dokumen",
            icon: "error",
          });
        }
      }
    });
  };

  // FormatData

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
      <div className="flex flex-col justify-start items-center">
        <div className="flex w-[97%] justify-start p-4 pl-0  items-center text-white text-2xl  border-b border-b-teal-500 pb-10">
          Data Detail Karyawan
        </div>

        {this.state.isLoad == true ? (
          <>
            <div className="w-[90%] flex flex-col justify-start items-center p-6 gap-12  rounded-lg relative playing overflow-hidden mt-10">
              <div class="cssload-container">
                <ul class="cssload-flex-container">
                  <li>
                    <span class="cssload-loading cssload-one"></span>
                    <span class="cssload-loading cssload-two"></span>
                    <span class="cssload-loading-center"></span>
                  </li>
                </ul>
              </div>
              <h3 className="text-base text-slate-100">
                {" "}
                Data Sedang Ditambahkan
              </h3>
            </div>
          </>
        ) : (
          <>
            <CardDetailEmployee
              data={this.state.dataEmployee}
              dataDivisi={this.state.dataDivisi}
              dataLokasi={this.state.dataLokasi}
              dataPosisi={this.state.dataPosisi}
              id={this.state.idEmployee}
              getDataEmployee={this.getEmployee}
              getDataPosisi={this.getAllPosisi}
            />

            <div className="flex justify-center w-full items-start gap-16">
              <TableEmployeeDetail
                data={this.state.employeeDocuments}
                simpanDocument={this.handleSubmitDokumen}
                updateDocument={this.handleUpdateDokumen}
                deleteDocument={this.handleDeleteDokumen}
              />
            </div>
          </>
        )}
      </div>
    );
  }
}

export default withRouter(EmployeeDetail);
