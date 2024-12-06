import React, { Component } from "react";
import swal from "sweetalert2";

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
import CardDetailCandidate from "../../components/candidate/cardDetailCandidate";
class CandidateDetail extends Component {
  constructor(props) {
    super(props);
    const { id } = this.props.params;

    this.state = {
      idCandidate: id,
      dataDivisi: [],
      dataLokasi: [],
      dataCandidate: {},
      candidatePengalaman: [],
    };
  }

  componentDidMount() {
    this.getCandidate(this.state.idCandidate);
    this.getCandidateExperience(this.state.idCandidate);
  }

  // Get data
  getCandidate = async (id) => {
    try {
      const docRef = doc(db, "employeesApplicant", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Dokumen data:", docSnap.data());
        this.setState({ dataCandidate: docSnap.data() });
      } else {
        console.log("Tidak ada dokumen yang cocok!");
        this.setState({ dataCandidate: {} });
      }
    } catch (error) {
      console.error("Error mengambil dokumen: ", error);
      this.setState({ dataCandidate: {} });
    }
  };

  getCandidateExperience = async (id) => {
    try {
      const subCollectionRef = collection(
        db,
        "employeesApplicant",
        id,
        "pengalamanKerja"
      );
      const querySnapshot = await getDocs(subCollectionRef);
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      console.log("Dokumen Karyawan:", documents);
      this.setState({ candidatePengalaman: documents });
    } catch (error) {
      console.error("Error mengambil dokumen subkoleksi: ", error);
      this.setState({ candidatePengalaman: [] });
    }
  };

  render() {
    return (
      <div className="flex flex-col justify-start items-center">
        <div className="flex w-[97%] justify-start p-4 pl-0  items-center text-white text-2xl border-b border-b-teal-500 pb-10">
          Data Detail Kandidat
        </div>

        <CardDetailCandidate
          data={this.state.dataCandidate}
          dataDivisi={this.state.dataDivisi}
          dataLokasi={this.state.dataLokasi}
          id={this.state.idCandidate}
          getDataCandidate={this.getCandidate}
          experienceData={this.state.candidatePengalaman}
        />

        <div className="flex justify-center w-full items-start gap-16"></div>
      </div>
    );
  }
}

export default withRouter(CandidateDetail);
