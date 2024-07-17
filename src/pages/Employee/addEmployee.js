import React, { Component } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  addDoc,
  writeBatch,
} from "firebase/firestore";
import { db, dbImage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import FormAddEmployee from "../../components/employee/formAddEmployee";
import Swal from "sweetalert2";
import { generateRandomString } from "../../components/features/utils";

class AddEmployee extends Component {
  constructor(props) {
    super(props);
    const idPerusahaan = sessionStorage.getItem("refPerusahaan");
    this.state = {
      dataDivisi: [],
      dataKosong: [],
      dataLokasi: [],
      dataPosisi: [],
      refPerusahaan: idPerusahaan,
    };
  }

  componentDidMount() {
    this.getTimData();
    this.getAllCabang();
    this.getAllPosisi();
  }

  // getData
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

  // format data
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
          Input Data Karyawan
        </div>

        <FormAddEmployee
          dataDivisi={this.state.dataDivisi}
          dataLokasi={this.state.dataLokasi}
          dataPosisi={this.state.dataPosisi}
        />

        <div className="flex justify-center w-full items-start gap-16"></div>
      </div>
    );
  }
}

export default AddEmployee;
