import React, { Component } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SubCard from "../../components/candidate/subCard";
import MainCard from "../../components/candidate/manageCandidateCard";
import { db } from "../../config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

class ManageCandidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemNew: null,
      candidateList: [],
      tahapSeleksiAwal: [],
      tahapAdministrasi: [],
      tahapTes: [],
      tahapInterview: [],
      employees: [],
    };
  }

  componentDidMount = async () => {
    await this.getAllCandidate();
    await this.getCandidateFiltered();
    // this.getAllEmployees();
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

      await new Promise((resolve) => {
        this.setState({ candidateList: kandidatKaryawan }, resolve);
      });
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };

  getCandidateFiltered = () => {
    const { candidateList } = this.state;
    const tahapAwal = this.filterCandidate(candidateList, "tahapSeleksiAwal");
    const administrasi = this.filterCandidate(
      candidateList,
      "tahapAdministrasi"
    );
    const tahapTes = this.filterCandidate(candidateList, "tahapTes");
    const tahapInterview = this.filterCandidate(
      candidateList,
      "tahapInterview"
    );

    this.setState({
      tahapSeleksiAwal: tahapAwal,
      tahapAdministrasi: administrasi,
      tahapTes: tahapTes,
      tahapInterview: tahapInterview,
    });
  };

  handleDropGeneric = (item, targetTahap) => {
    const {
      tahapSeleksiAwal,
      tahapAdministrasi,
      tahapTes,
      tahapInterview,
      employees,
    } = this.state;
    const tahapan = {
      tahapSeleksiAwal,
      tahapAdministrasi,
      tahapTes,
      tahapInterview,
      employees,
    };

    // Update tahap yang sesuai dengan item baru
    const cekdata = tahapan[targetTahap].filter((a) => a.id == item.id);
    if (cekdata.length > 0) {
      Swal.fire({
        title: "Warning",
        text: "Ada Error, Harap Simpan Perubahan dan Refresh Halaman",
        icon: "error",
      });
    } else {
      const updatedTargetTahap = [...tahapan[targetTahap], item];
      console.log(item.nama, "nama");
      console.log(tahapan[targetTahap], "data awal");
      console.log(updatedTargetTahap, targetTahap);
      this.setState({
        [targetTahap]: updatedTargetTahap,
        itemNew: item,
      });

      // Update tahap lain dengan menghapus item
      Object.keys(tahapan).forEach((tahap) => {
        if (tahap !== targetTahap) {
          const updatedTahap = tahapan[tahap].filter(
            (data) => data.id !== item.id
          );
          this.setState({
            [tahap]: updatedTahap,
          });
        }
      });
    }
  };

  handleSaveChanges = async () => {
    const {
      tahapSeleksiAwal,
      tahapAdministrasi,
      tahapTes,
      tahapInterview,
      employees,
    } = this.state;

    const activeCandidateIds = new Set();

    // Collect all active candidate IDs
    [
      ...tahapSeleksiAwal,
      ...tahapAdministrasi,
      ...tahapTes,
      ...tahapInterview,
    ].forEach((candidate) => {
      activeCandidateIds.add(candidate.id);
    });

    // Update employeesApplicant collection
    const batch = writeBatch(db);
    const candidateUpdates = [];

    const upsertCandidateStatus = async (candidate, statusTahap) => {
      const docRef = doc(db, "employeesApplicant", candidate.id);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        batch.update(docRef, { statusTahap });
      } else {
        batch.set(docRef, { ...candidate, statusTahap });
      }
    };

    // Upsert tahapSeleksiAwal
    for (const candidate of tahapSeleksiAwal) {
      candidateUpdates.push(
        upsertCandidateStatus(candidate, "tahapSeleksiAwal")
      );
    }

    // Upsert tahapAdministrasi
    for (const candidate of tahapAdministrasi) {
      candidateUpdates.push(
        upsertCandidateStatus(candidate, "tahapAdministrasi")
      );
    }

    // Upsert tahapTes
    for (const candidate of tahapTes) {
      candidateUpdates.push(upsertCandidateStatus(candidate, "tahapTes"));
    }

    // Upsert tahapInterview
    for (const candidate of tahapInterview) {
      candidateUpdates.push(upsertCandidateStatus(candidate, "tahapInterview"));
    }

    try {
      await Promise.all(candidateUpdates);
      await batch.commit();
      toast.success(
        "Data tahapan kandidat berhasil diperbarui di employeesApplicant collection."
      );
    } catch (error) {
      console.error("Error updating candidates:", error.message);
      toast.error("Terjadi kesalahan saat memperbarui data kandidat.");
    }

    // Delete candidates not in active stages from employeesApplicant collection
    const deletePromises = [];
    const querySnapshot = await getDocs(collection(db, "employeesApplicant"));

    for (const doc of querySnapshot.docs) {
      const candidateId = doc.id;
      if (!activeCandidateIds.has(candidateId)) {
        // Delete the document itself
        deletePromises.push(deleteDoc(doc.ref));

        // Delete subcollection pengalamanKerja
        const pengalamanKerjaRef = collection(doc.ref, "pengalamanKerja");
        deletePromises.push(this.deleteSubcollection(pengalamanKerjaRef));
      }
    }

    try {
      await Promise.all(deletePromises);
      toast.success(
        "Data kandidat yang tidak lagi aktif beserta subkoleksinya berhasil dihapus dari employeesApplicant collection."
      );
    } catch (error) {
      console.error("Error deleting inactive candidates:", error.message);
      toast.error(
        "Terjadi kesalahan saat menghapus data kandidat tidak aktif."
      );
    }

    // Insert or update into employees collection only if there are changes in employees state
    if (employees.length > 0) {
      const batch = writeBatch(db);

      for (const employee of employees) {
        const employeeRef = doc(db, "employees", employee.id);

        const { pengalamanKerja, ...employeeData } = employee;

        batch.set(employeeRef, employeeData, { merge: true });

        if (Array.isArray(pengalamanKerja)) {
          const pengalamanKerjaRef = collection(employeeRef, "pengalamanKerja");
          for (const pengalaman of pengalamanKerja) {
            await addDoc(pengalamanKerjaRef, pengalaman);
          }
        } else {
          console.error("pengalamanKerja is not an array:", pengalamanKerja);
        }
      }

      try {
        await batch.commit();
        toast.success(
          "Data karyawan berhasil ditambahkan atau diperbarui di collection employees."
        );

        this.setState({ employees: [] });
      } catch (error) {
        console.error("Error adding or updating employees:", error.message);
        toast.error(
          "Terjadi kesalahan saat menambahkan atau memperbarui data karyawan."
        );
      }
    } else {
      toast.info("Tidak ada perubahan yang perlu disimpan untuk karyawan.");
    }

    await this.getAllCandidate();
    await this.getCandidateFiltered();
    window.location.href = "/manage-candidate";
  };

  deleteSubcollection = async (collectionRef) => {
    const deletePromises = [];
    const querySnapshot = await getDocs(collectionRef);

    for (const doc of querySnapshot.docs) {
      deletePromises.push(deleteDoc(doc.ref));
    }

    await Promise.all(deletePromises);
  };

  filterCandidate = (dataArray, status) => {
    return dataArray.filter((candidate) => candidate.statusTahap === status);
  };

  render() {
    const {
      tahapSeleksiAwal,
      tahapTes,
      tahapInterview,
      tahapAdministrasi,
      employees,
    } = this.state;
    return (
      <DndProvider backend={HTML5Backend}>
        <ToastContainer />
        <div>
          <div className="flex w-full mb-10 justify-start p-4 items-center text-white text-2xl border-b border-b-teal-500 pb-10 ">
            Manajemen Calon Kandidat Karyawan
          </div>

          <div className="w-full flex flex-col  mt-10 justify-between items-start pb-16">
            <div>
              <button className="button-add" onClick={this.handleSaveChanges}>
                Simpan Perubahan
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
            <div className="w-full flex  mt-10 justify-between items-start">
              <div
                data-aos="fade-down"
                data-aos-delay="50"
                className="w-[14rem]  h-auto  flex flex-col justify-start items-center relative gap-10 rounded-lg p-4 overflow-hidden"
              >
                <div className="w-[14rem] absolute bg-slate-400 opacity-15 h-full flex flex-col justify-start gap-10 rounded-lg"></div>

                <div className="w-full p-2  text-white bg-transparent shadow-xl text-base  border-b border-b-teal-500 pb-4 mt-2 flex justify-center items-center">
                  <h4>Tahap Awal Seleksi</h4>
                </div>
                <div className="flex  gap-4 flex-col justify-start items-center w-full z-[99]">
                  <div className="max-h-[25rem] overflow-y-scroll w-full flex gap-4 flex-col justify-start items-center px-2">
                    {tahapSeleksiAwal.map((item, index) => (
                      <SubCard key={index} name={item} />
                    ))}
                  </div>
                  <MainCard
                    onDrop={(item) =>
                      this.handleDropGeneric(item, "tahapSeleksiAwal")
                    }
                  />
                </div>
              </div>
              <div
                data-aos="fade-down"
                data-aos-delay="150"
                className="w-[14rem] h-full flex flex-col justify-start items-center relative gap-10 rounded-lg p-4"
              >
                <div className="w-[14rem] absolute bg-slate-400 opacity-15 h-full flex flex-col justify-start gap-10 rounded-lg"></div>

                <div className="w-full p-2  text-white bg-transparent shadow-xl  text-base border-b border-b-teal-500 pb-4 mt-2 flex justify-center items-center">
                  <h4>Tahap Administrasi</h4>
                </div>
                <div className="flex gap-4 flex-col justify-start items-center w-full z-[99]">
                  <div className="max-h-[25rem] overflow-y-scroll w-full flex gap-4 flex-col justify-start items-center px-2">
                    {tahapAdministrasi.map((item, index) => (
                      <SubCard key={index} name={item} />
                    ))}
                  </div>

                  <MainCard
                    onDrop={(item) =>
                      this.handleDropGeneric(item, "tahapAdministrasi")
                    }
                  />
                </div>
              </div>
              <div
                data-aos="fade-down"
                data-aos-delay="250"
                className="w-[14rem] h-full flex flex-col justify-start items-center relative gap-10 rounded-lg p-4"
              >
                <div className="w-[14rem]  absolute bg-slate-400 opacity-15 h-full flex flex-col justify-start gap-10 rounded-lg"></div>

                <div className="w-full p-2  text-white bg-transparent shadow-xl text-base border-b border-b-teal-500 pb-4 mt-2 flex justify-center items-center">
                  <h4>Tahap Tes</h4>
                </div>
                <div className="flex gap-4 flex-col justify-start items-center w-full z-[99]">
                  <div className="max-h-[25rem] overflow-y-scroll w-full flex gap-4 flex-col justify-start items-center px-2">
                    {tahapTes.map((item, index) => (
                      <SubCard key={index} name={item} />
                    ))}
                  </div>

                  <MainCard
                    onDrop={(item) => this.handleDropGeneric(item, "tahapTes")}
                  />
                </div>
              </div>
              <div
                data-aos="fade-down"
                data-aos-delay="250"
                className="w-[14rem] h-auto flex flex-col justify-start items-center relative gap-10 rounded-lg p-4"
              >
                <div className="w-[14rem]  absolute bg-slate-400 opacity-15 h-full flex flex-col justify-start gap-10 rounded-lg"></div>

                <div className="w-full p-2  text-white bg-transparent shadow-xl text-base border-b border-b-teal-500 pb-4 mt-2 flex justify-center items-center">
                  <h4>Tahap Interview</h4>
                </div>
                <div className="flex gap-4 flex-col justify-start items-center w-full z-[99]">
                  <div className="max-h-[25rem] overflow-y-scroll w-full flex gap-4 flex-col justify-start items-center px-2">
                    {tahapInterview.map((item, index) => (
                      <SubCard key={index} name={item} />
                    ))}
                  </div>

                  <MainCard
                    onDrop={(item) =>
                      this.handleDropGeneric(item, "tahapInterview")
                    }
                  />
                </div>
              </div>
              <div
                data-aos="fade-down"
                data-aos-delay="350"
                className="w-[14rem] h-full flex flex-col justify-start items-center relative gap-10 rounded-lg p-4"
              >
                <div className="w-[14rem] absolute bg-slate-400 opacity-15 h-full flex flex-col justify-start gap-10 rounded-lg"></div>

                <div className="w-full p-2  text-white bg-transparent shadow-xl text-base border-b border-b-teal-500 pb-4 mt-2 flex justify-center items-center">
                  <h4>Karyawan</h4>
                </div>
                <div className="flex gap-4 flex-col justify-start items-center w-full z-[99]">
                  <div className="max-h-[25rem] overflow-y-scroll w-full flex gap-4 flex-col justify-start items-center px-2">
                    {employees.map((item, index) => (
                      <SubCard key={index} name={item} />
                    ))}
                  </div>

                  <MainCard
                    onDrop={(item) => this.handleDropGeneric(item, "employees")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    );
  }
}

export default ManageCandidate;
