import React, { Component } from "react";

import CardCandidate from "../components/candidate/cardCandidate";
import TableCandidate from "../components/candidate/tableCandidate";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
class Candidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataKosong: [],
      dataDivisi: [],
    };
  }

  componentDidMount() {
    this.getTimData();
  }

  // Get Data

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
  render() {
    return (
      <div>
        <div className="flex w-full justify-start p-4 items-center text-white text-3xl mb-6">
          Kandidat Calon Karyawan
        </div>
        <CardCandidate />
        <div className="flex justify-center w-full items-start gap-16">
          <TableCandidate dataDivisi={this.state.dataDivisi} />
        </div>
      </div>
    );
  }
}

export default Candidate;
