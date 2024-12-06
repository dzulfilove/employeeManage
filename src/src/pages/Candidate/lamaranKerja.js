import { Component } from "react";
import { db, dbImage } from "../../config/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { generateRandomString } from "../../components/features/utils";
import "../../styles/card.css";
import "../../styles/button.css";
import "../../styles/loading.css";
import DropdownForm from "../../components/features/dropdownForm";
import dayjs from "dayjs";
import { withRouter } from "react-router-dom";
import { Navigate } from "react-router-dom";
class FormLamaran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      nama: "",
      nik: 0,
      alamat: "",
      nomorWhatsapp: "",
      posisi: "",
      ratting: 0,
      riwayatPendidikan: "",
      pengalamanKerjaList: [], // Ubah menjadi pengalamanKerjaList
      isAddingPengalaman: false,
      lokasiPengalaman: "",
      tanggalPengalaman: "",
      posisiPengalaman: "",
      deskripsiPengalaman: "",
      gajiYangDiharapkan: 0,
      fotoTerbaru: "",
      fotoTerbaruFile: null,
      cvTerbaru: "",
      cvTerbaruFile: null,
      jurusan: "",
      isJaminanIjazah: false,
      isStrAktif: false,
      penempatanCabang: false,
      sumberInformasi: "",
      divisions: [],
      pelamar: {},
      isProses: false,
      tanggal: dayjs().locale("id").format("YYYY/MM/DD"),
    };
  }

  componentDidMount = () => {
    this.getAllDivisions();
  };

  getAllDivisions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "posisiLoker"));

      if (querySnapshot.empty) {
        console.log("Tidak ada dokumen yang ditemukan.");
        return;
      }
      const divisions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const dataOption = divisions.map((data) => ({
        text: data.text,
        value: data.value,
      }));
      console.log(dataOption, "data Option divisi");
      this.setState({ divisions: dataOption });
    } catch (error) {
      console.error("Error fetching divisions:", error.message);
    }
  };

  handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    if (type === "file") {
      if (name == "fotoTerbaru") {
        this.setState({
          fotoTerbaruFile: files[0],
        });
      } else {
        this.setState({
          cvTerbaruFile: files[0],
        });
      }
    } else {
      this.setState({
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  handleTambahPengalaman = () => {
    this.setState({
      isAddingPengalaman: true,
    });
  };

  handleChangePengalaman = (event, field) => {
    const { value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  handleDeletePengalaman = (index) => {
    const { pengalamanKerjaList } = this.state;
    const updatedData = pengalamanKerjaList.filter(
      (item) => item.index !== index
    );
    console.log(index);
    this.setState({ pengalamanKerjaList: updatedData });
  };
  handleSubmitPengalaman = () => {
    const {
      lokasiPengalaman,
      posisiPengalaman,
      deskripsiPengalaman,
      tanggalPengalaman,
      pengalamanKerjaList,
    } = this.state;

    const index = pengalamanKerjaList.length;
    // Add new pengalaman kerja
    const newPengalaman = {
      index,
      lokasiPengalaman,
      deskripsiPengalaman,
      posisiPengalaman,
      lamaKerja: tanggalPengalaman,
    };
    toast.success("🦄 Pengalaman berhasil ditambah!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    this.setState(
      {
        pengalamanKerjaList: [...pengalamanKerjaList, newPengalaman],
        isAddingPengalaman: false,
        lokasiPengalaman: "",
        posisiPengalaman: "",
        deskripsiPengalaman: "",
        tanggalPengalaman: "",
      },
      () => {}
    );
  };

  handleSaveCv = async (file) => {
    if (!file) {
      throw new Error("File not found");
    }
    const random = generateRandomString(12);
    const storageRef = ref(dbImage, `cvPegawai/${random}-${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  sendMessage = async (text, foto) => {
    try {
      const response = await fetch(
        "https://api.telegram.org/bot6823587684:AAE4Ya6Lpwbfw8QxFYec6xAqWkBYeP53MLQ/sendPhoto",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: "-1001812360373",
            // chat_id: "6546310886",
            photo: foto,
            caption: text,
            message_thread_id: "3231",
            parse_mode: "html",
          }),
        }
      );

      if (response.ok) {
        // Swal.fire("Berhasil", "Alasan Telah Berhasil Dikirim", "success");
        console.log("Berhasil Dikirmkan");
      } else {
        // Swal.fire("Perhatian", "Alasan Gagal dikirim", "warning");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      email,
      nama,
      nik,
      alamat,
      nomorWhatsapp,
      posisi,
      ratting,
      riwayatPendidikan,
      pengalamanKerjaList,
      gajiYangDiharapkan,
      isJaminanIjazah,
      isStrAktif,
      penempatanCabang,
      sumberInformasi,
      fotoTerbaruFile,
      cvTerbaruFile,
      tanggal,
      jurusan,
      lokasiPengalaman,
      posisiPengalaman,
      deskripsiPengalaman,
      tanggalPengalaman,
    } = this.state;

    let cek = this.handleCheckEmptyFields();

    if (cvTerbaruFile && !fotoTerbaruFile) {
      cek = true;
      Swal.fire({
        title: "Gagal",
        text: "Foto terbaru tidak ditemukan, Harap Tambahkan Foto Terbaru Anda",
        icon: "error",
      });
    } else if (!cvTerbaruFile && fotoTerbaruFile) {
      cek = true;

      Swal.fire({
        title: "Gagal",
        text: "CV terbaru tidak ditemukan, Harap Tambahkan CV Terbaru Anda",
        icon: "error",
      });
    } else if (!cvTerbaruFile && !fotoTerbaruFile) {
      cek = true;

      Swal.fire({
        title: "Gagal",
        text: "CV dan Foto terbaru tidak ditemukan, Harap Tambahkan CV dan Foto Terbaru Anda",
        icon: "error",
      });
    }
    if (cek == false) {
      this.setState({ isProses: true });

      try {
        const fotoTerbaruURL = await this.handleFoto(fotoTerbaruFile);
        const cvTerbaruURL = await this.handleSaveCv(cvTerbaruFile);

        // Simpan URL foto terbaru dan CV terbaru ke state
        this.setState({
          fotoTerbaru: fotoTerbaruURL,
          cvTerbaru: cvTerbaruURL,
        });

        // Persiapkan dokumen utama untuk employeesApplicant
        const pelamar = {
          email,
          nama,
          nik,
          alamat,
          nomorWhatsapp,
          posisi,
          riwayatPendidikan,
          gajiYangDiharapkan,
          fotoTerbaru: fotoTerbaruURL,
          cvTerbaru: cvTerbaruURL,
          isJaminanIjazah,
          isStrAktif,
          jurusan,
          penempatanCabang,
          tanggalMelamar: tanggal,
          sumberInformasi,
          statusTahap: "tahapSeleksiAwal",
        };

        // Simpan dokumen pelamar ke koleksi "employeesApplicant"
        const pelamarRef = await addDoc(
          collection(db, "employeesApplicant"),
          pelamar
        );

        // Persiapkan untuk menyimpan pengalaman kerja sebagai subcollection
        const batch = writeBatch(db);
        const pengalamanRef = doc(db, "employeesApplicant", pelamarRef.id);

        // Membuat subcollection "pengalamanKerja" di dalam dokumen pelamar
        const pengalamanKerjaCol = collection(pengalamanRef, "pengalamanKerja");

        let listPengalaman = [];

        if (
          pengalamanKerjaList.length == 0 &&
          lokasiPengalaman !== "" &&
          posisiPengalaman !== "" &&
          deskripsiPengalaman !== "" &&
          tanggalPengalaman !== ""
        ) {
          listPengalaman = [
            {
              lokasiKerja: lokasiPengalaman,
              lamaKerja: tanggalPengalaman,
              posisi: posisiPengalaman,
              deskripsiPengalaman,
            },
          ];
        } else {
          listPengalaman = pengalamanKerjaList;
        }
        // Iterasi pengalamanKerjaList dan tambahkan ke subcollection
        listPengalaman.forEach((pengalaman) => {
          const {
            lokasiPengalaman,
            posisiPengalaman,
            deskripsiPengalaman,
            lamaKerja,
          } = pengalaman;
          const newPengalamanRef = doc(pengalamanKerjaCol);
          batch.set(newPengalamanRef, {
            lokasiKerja: lokasiPengalaman,
            posisi: posisiPengalaman,
            deskripsiPengalaman,
            lamaKerja,
          });
        });
        await batch.commit();

        const foto = fotoTerbaruURL;
        const textPengalaman = listPengalaman
          .map(
            (p, i) =>
              `<b>${i + 1}. ${p.posisiPengalaman}</b>\n   <b>Di ${
                p.lokasiPengalaman
              }</b>. ${p.deskripsiPengalaman}`
          )
          .join("\n");
        const text = `<b>Ada Pelamar ${posisi} Baru</b>\n\n<b>Tanggal:</b> ${this.formatTanggal(
          tanggal
        )}\n<b>Nama: </b> ${nama}\n<b>Email:</b> ${email}\n<b>No. Telepon:</b> ${nomorWhatsapp}\n<b>Pendidikan Terakhir:</b> ${riwayatPendidikan} ${jurusan}\n<b>Posisi Yang Dilamar:</b> ${posisi}\n<b>Bersedia Menyimpan Ijazah:</b> ${
          isJaminanIjazah == true ? "Ya" : "Tidak"
        }\n<b>Pengalaman Kerja:</b>\n${textPengalaman}\n<b>Link CV:</b> ${cvTerbaruURL} `;

        await this.sendMessage(text, foto);
        Swal.fire({
          title: "Berhasil!",
          text: "Lamaran Anda Berhasil Diajukan",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            sessionStorage.setItem("isLamaran", true);
            window.location.href = "/sended-form";
          }
        });
      } catch (error) {
        console.error("Error saving applicant data:", error);
        Swal.fire({
          title: "Error!",
          text: "Wih, Error tuch",
          icon: "error",
        });
      }
      this.setState({ isProses: false });
    }
  };

  handleCheckEmptyFields = () => {
    const emptyFields = [];
    const fieldsToCheck = [
      { key: "email", label: "Email" },
      { key: "nama", label: "Nama" },
      { key: "nik", label: "NIK" },
      { key: "alamat", label: "Alamat" },
      { key: "nomorWhatsapp", label: "Nomor Whatsapp" },
      { key: "posisi", label: "Posisi" },
      { key: "riwayatPendidikan", label: "Riwayat Pendidikan" },

      { key: "gajiYangDiharapkan", label: "Gaji Yang Diharapkan" },

      { key: "sumberInformasi", label: "Sumber Informasi" },
    ];

    fieldsToCheck.forEach((field) => {
      if (
        this.state[field.key] === "" ||
        this.state[field.key] === 0 ||
        this.state[field.key] === null
      ) {
        console.log(field.label, this.state[field.key]);
        emptyFields.push(field.label);
      }
    });

    if (emptyFields.length > 0) {
      Swal.fire({
        title: "Data Tidak Lengkap",
        text: `Field berikut harus diisi: ${emptyFields.join(", ")}`,
        icon: "warning",
        button: "OK",
      });

      return true;
    } else {
      return false;
    }
  };

  handleFoto = async (file) => {
    try {
      // Fungsi untuk mengompres gambar menggunakan canvas
      const compressImage = (file, maxWidth, maxHeight, quality) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height = Math.round((height *= maxWidth / width));
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = Math.round((width *= maxHeight / height));
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                resolve(blob);
              },
              "image/jpeg",
              quality
            );
          };
          img.onerror = (err) => {
            reject(err);
          };
        });
      };

      // Kompresi gambar dengan resolusi maksimal 1920x1920 dan kualitas 0.7
      const compressedFile = await compressImage(file, 1920, 1920, 0.7);

      const random = generateRandomString(12);
      const storageRef = ref(dbImage, `fotoPegawai/${random}-${file.name}`);

      await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Gagal mengunggah foto:", error);
    }
  };

  // Fungsi untuk mengonversi data URI menjadi Blob
  dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };
  formatTanggal = (tanggal) => {
    // Parsing tanggal dengan format "DD-MM-YYYY"
    const parsedDate = dayjs(tanggal, "YYYY/MM/DD");

    // Ambil nama hari dan bulan dalam bahasa Indonesia
    const hari = parsedDate.locale("id").format("dddd");
    const bulan = parsedDate.locale("id").format("MMMM");

    // Format ulang tanggal sesuai keinginan
    const hasil =
      parsedDate.format("DD") + " " + bulan + " " + parsedDate.format("YYYY");

    return hasil;
  };
  render() {
    const optionPendidikan = [
      { value: "SD", text: "SD" },
      { value: "SMP", text: "SMP" },
      { value: "SMA", text: "SMA" },
      { value: "D3", text: "D3" },
      { value: "S1", text: "S1" },
      { value: "S2", text: "S2" },
    ];

    const { divisions, isAddingPengalaman, isProses } = this.state;
    return (
      <div className="w-full h-[100vh] flex justify-center items-start bg-slate-100 overflow-hidden pb-16">
        <div className=" flex relative h-full w-full justify-start items-center flex-col overflow-y-scroll bg-slate-100">
          {this.state.isProses == true ? (
            <>
              <div className="absolute z-[99999] w-full h-[100vh] flex justify-center items-center bg-white flex-col gap-4">
                <div className="loader-form"></div>
                <h3 className="text-sm font-medium absolute top-[58%]">
                  Mohon Tunggu....
                </h3>
                <h3 className="text-sm font-normal absolute top-[62%]">
                  Jangan Tutup Halaman Ini
                </h3>
              </div>
            </>
          ) : (
            <>
              <div className="background-form w-full rounded-b-xl h-[15rem] p-4 flex flex-col items-center justify-start gap-6">
                <div className="glass-effect-form w-full h-full p-4 top-0 flex flex-col items-center justify-start gap-6 absolute"></div>

                <div className=" flex justify-center flex-col gap-4 items-center  rounded-xl p-4  w-full z-[99]">
                  <img
                    className="w-[5rem] h-[5rem] flex justify-center items-center rounded-lg object-cover"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlWVsdsDTYT4AMpwEGauuoX7Kr7Pyia3ENAA&s"
                  />
                  <h1 className="text-xl font-semibold text-black">
                    KOSASIH GROUP
                  </h1>
                </div>
              </div>
              <div className="w-[95%] gap-6 top-[25%] shadow-xl pb-10 bg-white px-2 pt-4 flex rounded-xl justify-start flex-col items-center border border- absolute">
                <h3 className="text-xl font-semibold  mb-2">
                  Form Lamaran Kerja
                </h3>

                <div className="flex flex-col justify-between items-start w-full gap-2">
                  <h3 className=" font-semibold">Email</h3>
                  <input
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full  p-2"
                    required
                  />
                </div>

                <div className="flex flex-col justify-between items-start w-full gap-2">
                  <h3 className=" font-semibold">Nama:</h3>
                  <input
                    type="text"
                    name="nama"
                    value={this.state.nama}
                    onChange={this.handleChange}
                    className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full  p-2"
                    required
                  />
                </div>

                <div className="flex flex-col justify-between items-start w-full gap-2">
                  <h3 className=" font-semibold">NIK:</h3>
                  <input
                    type="number"
                    name="nik"
                    value={this.state.nik}
                    onChange={this.handleChange}
                    className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full  p-2"
                    required
                  />
                </div>
                <div className="flex flex-col justify-between items-start w-full gap-2">
                  <h3 className=" font-semibold">Alamat:</h3>
                  <input
                    type="text"
                    name="alamat"
                    value={this.state.alamat}
                    onChange={this.handleChange}
                    className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full  p-2"
                    required
                  />
                </div>

                <div className="flex flex-col justify-between items-start w-full gap-2">
                  <h3 className=" font-semibold">Nomor Whatsapp:</h3>
                  <input
                    type="text"
                    name="nomorWhatsapp"
                    value={this.state.nomorWhatsapp}
                    onChange={this.handleChange}
                    className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full  p-2"
                    required
                  />
                </div>
                <div className="flex flex-col justify-between items-start w-full gap-2">
                  <h3 className=" font-semibold">Posisi Dilamar</h3>
                  <div className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full">
                    <DropdownForm
                      options={this.state.divisions}
                      color={true}
                      name={"Posisi"}
                      change={(data) => {
                        this.setState({ posisi: data.text });
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-between items-start w-full gap-2">
                  <h3 className=" font-semibold">Pendidikan Terakhir</h3>
                  <div className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full">
                    <DropdownForm
                      options={optionPendidikan}
                      change={(data) => {
                        this.setState({ riwayatPendidikan: data.text });
                      }}
                      name={"Pendidikan Terakhir"}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-between items-start w-full gap-2">
                  <h3 className=" font-semibold">Jurusan:</h3>
                  <input
                    type="text"
                    name="jurusan"
                    value={this.state.jurusan}
                    onChange={this.handleChange}
                    className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full  p-2"
                    required
                  />
                </div>
                <div className="flex flex-col justify-between items-start w-full gap-2">
                  <h3 className="font-semibold">Pengalaman Kerja</h3>
                  <button
                    className="flex justify-center items-center p-2 rounded-xl bg-emerald-500 text-white w-[12rem] "
                    type="button"
                    onClick={this.handleTambahPengalaman}
                  >
                    Tambah Pengalaman
                  </button>

                  {isAddingPengalaman && (
                    <div className="flex flex-col justify-between items-start w-full gap-5 ">
                      <input
                        type="text"
                        name="namaPengalaman"
                        placeholder="Tempat Kerja"
                        value={this.state.lokasiPengalaman}
                        className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full  p-2"
                        onChange={(e) =>
                          this.handleChangePengalaman(e, "lokasiPengalaman")
                        }
                        required
                      />
                      <input
                        type="text"
                        name="namaPengalaman"
                        placeholder="Posisi"
                        value={this.state.posisiPengalaman}
                        className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full  p-2"
                        onChange={(e) =>
                          this.handleChangePengalaman(e, "posisiPengalaman")
                        }
                        required
                      />
                      <input
                        type="text"
                        name="tanggalPengalaman"
                        placeholder="Lama Kerja"
                        value={this.state.tanggalPengalaman}
                        className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full  p-2"
                        onChange={(e) =>
                          this.handleChangePengalaman(e, "tanggalPengalaman")
                        }
                        required
                      />
                      <textarea
                        name="deskripsiPengalaman"
                        placeholder="Deskripsi Pengalaman"
                        value={this.state.deskripsiPengalaman}
                        className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full  p-2"
                        onChange={(e) =>
                          this.handleChangePengalaman(e, "deskripsiPengalaman")
                        }
                        required
                      />
                      <div className="flex flex-col justify-between w-full items-start">
                        <button
                          className="flex justify-center items-center p-2 rounded-xl bg-emerald-500  w-[8rem] text-white"
                          type="button"
                          onClick={() => this.handleSubmitPengalaman(null)}
                        >
                          Simpan
                        </button>
                        <h3 className="text-sm text-teal-600 font-normal mt-2">
                          *Klik Untuk Menyimpan Pengalaman Anda
                        </h3>
                      </div>
                    </div>
                  )}

                  {/* Menampilkan daftar pengalaman kerja */}
                  {this.state.pengalamanKerjaList.map((pengalaman, index) => (
                    <div
                      className="flex flex-col justify-between items-start w-full border border-slate-800 p-2 rounded-xl mt-2"
                      key={index}
                    >
                      <div className=" w-full flex justify-between  p-2 font-semibold items-center">
                        <div className="w-[85%] ">
                          {index + 1}. {pengalaman.posisiPengalaman} di{" "}
                          {pengalaman.lokasiPengalaman}
                        </div>
                        <div className="w-[15%] flex justify-end items-center ">
                          <button
                            onClick={() => {
                              this.handleDeletePengalaman(index);
                            }}
                            className="bg-red-200 border-red-600 flex justify-center items-center w-[2rem] h-[2rem] rounded-full "
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#d92626"
                                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className=" w-full  pl-6">
                        {pengalaman.deskripsiPengalaman}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col justify-between items-start w-full gap-2">
                  <h3 className=" font-semibold">Gaji yang Diharapkan</h3>
                  <input
                    type="number"
                    name="gajiYangDiharapkan"
                    value={this.state.gajiYangDiharapkan}
                    className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full  p-2"
                    onChange={this.handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col justify-between items-start w-full gap-2">
                  <h3 className=" font-semibold">Foto Terbaru</h3>
                  <input
                    type="file"
                    name="fotoTerbaru"
                    onChange={this.handleChange}
                    className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full  p-2"
                    required
                  />
                </div>

                <div className="flex flex-col justify-between items-start w-full gap-2">
                  <h3 className=" font-semibold">CV Terbaru (PDF / Image)</h3>
                  <input
                    type="file"
                    name="cvTerbaru"
                    onChange={this.handleChange}
                    className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full  p-2"
                    required
                  />
                </div>

                <div className="flex flex-col justify-between items-start w-full gap-3">
                  <h3 className="font-semibold">
                    Apakah Bersedia Ijazah Ditahan? (Ceklis jika Ya)
                  </h3>
                  <div className="checkbox-wrapper">
                    <input
                      id="terms-checkbox-1"
                      type="checkbox"
                      name="isJaminanIjazah"
                      checked={this.state.isJaminanIjazah}
                      onChange={this.handleChange}
                    />
                    <label className="terms-label" htmlFor="terms-checkbox-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 200 200"
                        className="checkbox-svg"
                      >
                        <mask fill="white" id="path-1-inside-1_476_5-1">
                          <rect height="200" width="200"></rect>
                        </mask>
                        <rect
                          mask="url(#path-1-inside-1_476_5-1)"
                          strokeWidth="40"
                          className="checkbox-box"
                          height="200"
                          width="200"
                        ></rect>
                        <path
                          strokeWidth="15"
                          d="M52 111.018L76.9867 136L149 64"
                          className="checkbox-tick"
                        ></path>
                      </svg>
                      <span className="label-text">Jaminan Ijazah</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-start w-full gap-2">
                  <h3 className="font-semibold">
                    Apakah Memiliki STR Aktif? (Ceklis jika Ya)
                  </h3>
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      id="terms-checkbox-2"
                      name="isStrAktif"
                      checked={this.state.isStrAktif}
                      onChange={this.handleChange}
                    />
                    <label className="terms-label" htmlFor="terms-checkbox-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 200 200"
                        className="checkbox-svg"
                      >
                        <mask fill="white" id="path-1-inside-1_476_5-2">
                          <rect height="200" width="200"></rect>
                        </mask>
                        <rect
                          mask="url(#path-1-inside-1_476_5-2)"
                          strokeWidth="40"
                          className="checkbox-box"
                          height="200"
                          width="200"
                        ></rect>
                        <path
                          strokeWidth="15"
                          d="M52 111.018L76.9867 136L149 64"
                          className="checkbox-tick"
                        ></path>
                      </svg>
                      <span className="label-text">STR Aktif</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-start w-full gap-2">
                  <h3 className=" font-semibold">
                    Apakah Bersedia Ditempatkan Di Seluruh Cabang Kosasih ?
                    (Ceklis jika Ya)
                  </h3>
                  <div className="checkbox-wrapper">
                    <input
                      id="terms-checkbox-3"
                      type="checkbox"
                      name="penempatanCabang"
                      checked={this.state.penempatanCabang}
                      onChange={this.handleChange}
                    />
                    <label className="terms-label" htmlFor="terms-checkbox-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 200 200"
                        className="checkbox-svg"
                      >
                        <mask fill="white" id="path-1-inside-1_476_5-2">
                          <rect height="200" width="200"></rect>
                        </mask>
                        <rect
                          mask="url(#path-1-inside-1_476_5-2)"
                          strokeWidth="40"
                          className="checkbox-box"
                          height="200"
                          width="200"
                        ></rect>
                        <path
                          strokeWidth="15"
                          d="M52 111.018L76.9867 136L149 64"
                          className="checkbox-tick"
                        ></path>
                      </svg>
                      <span className="label-text">Bersedia</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-start w-full gap-2">
                  <h3 className=" font-semibold">Sumber Informasi</h3>

                  <input
                    type="text"
                    name="sumberInformasi"
                    value={this.state.sumberInformasi}
                    className="border border-slate-500 rounded-lg bg-slate-50 h-[3rem] w-full  p-2"
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  onClick={this.handleSubmit}
                  className="flex justify-center items-center p-2 rounded-xl bg-emerald-500  w-[80%] text-white font-medium"
                >
                  Ajukan Lamaran
                </button>
              </div>
            </>
          )}
          {/* <ToastContainer /> */}
        </div>
      </div>
    );
  }
}

export default FormLamaran;
