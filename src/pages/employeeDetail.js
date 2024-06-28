import React, { Component } from "react";

import CardDetailEmployee from "../components/employee/cardDetailEmployee";
import TableEmployeeDetail from "../components/employee/tableEmployeeDetail";
import withRouter from "../components/features/withRouter";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
class EmployeeDetail extends Component {
  constructor(props) {
    super(props);
    const { id } = this.props.params;

    this.state = {
      idEmployee: id,
      dataDivisi: [],
      dataLokasi: [],
      dataEmployee: {},
    };
  }

  componentDidMount() {
    this.getEmployee(this.state.idEmployee);
    this.getAllCabang();
    this.getTimData();
  }

  // Get data
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
    try {
      const timCollection = collection(db, "Tim");
      const timSnapshot = await getDocs(timCollection);
      const timList = timSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const dataOption = timList.map((item) => ({
        value: item.Nama,

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
        value: item.nama,

        text: item.nama,
      }));

      this.setState({ dataLokasi: dataOption });
    } catch (error) {
      console.error("Error fetching cabangList:", error.message);
    }
  };

  render() {
    return (
      <div className="flex flex-col justify-start items-center">
        <div className="flex w-[97%] justify-start p-4 pl-0  items-center text-white text-3xl mb-6 border-b border-b-teal-500 pb-10">
          Data Detail Karyawan
        </div>

        <CardDetailEmployee
          data={this.state.dataEmployee}
          dataDivisi={this.state.dataDivisi}
          dataLokasi={this.state.dataLokasi}
          id={this.state.idEmployee}
        />

        <div className="flex justify-center w-full items-start gap-16">
          <TableEmployeeDetail />
        </div>
      </div>
    );
  }
}

export default withRouter(EmployeeDetail);
