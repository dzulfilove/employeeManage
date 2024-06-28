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
import { db, dbImage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import FormAddEmployee from "../components/employee/formAddEmployee";
import Swal from "sweetalert2";
import { generateRandomString } from "../components/features/utils";

class AddEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDivisi: [],
      dataKosong: [],
      dataLokasi: [],
    };
  }

  componentDidMount() {
    this.getTimData();
    this.getAllCabang();
  }

  // getData
  getTimData = async () => {
    try {
      const timCollection = collection(db, "Tim");
      const timSnapshot = await getDocs(timCollection);
      const timList = timSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const dataOption = timList.map((item) => ({
        value: item.id,
        text: item.Nama,
      }));

      this.setState({ dataDivisi: dataOption });
    } catch (error) {
      console.error("Error fetching Tim data: ", error);
      return [];
    }
  };

  getAllCabang = async () => {
    const refPerusahaan = doc(db, "Perusahaan", "42c0276C84e8chpCogKK");
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

  // handle Data

  render() {
    return (
      <div>
        <div className="flex w-full justify-start p-4 items-center text-white text-3xl mb-6">
          Input Data Karyawan
        </div>

        <FormAddEmployee
          dataDivisi={this.state.dataDivisi}
          dataLokasi={this.state.dataLokasi}
        />

        <div className="flex justify-center w-full items-start gap-16"></div>
      </div>
    );
  }
}

export default AddEmployee;
