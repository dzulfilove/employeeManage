import React, { Component } from "react";
import "../../styles/card.css";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

import { db } from "../../config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      userData: {},
    };
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value.toLowerCase() });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };
  getUserLogin = async (email) => {
    try {
      const userRef = collection(db, "User");
      const q = query(userRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      const userData = querySnapshot.docs[0].data();

      await new Promise((resolve) => {
        this.setState({ user: userData }, resolve);
      });
      sessionStorage.setItem("refPerusahaan", userData.refPerusahaan.id);

      return userData;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  issessionStorageAvailable = () => {
    try {
      const testKey = "__test__";
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    if (!email || !password) return;

    await this.getUserLogin(email);
    const peran = this.state.userData.peran;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const cekStorage = this.issessionStorageAvailable();
      if (!cekStorage) {
        Swal.fire({
          icon: "warning",
          title: "sessionStorage is not available",
          text: "Please disable private browsing or use another browser. ",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      sessionStorage.setItem("isLoggedIn", true);
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("peran", peran);
      Swal.fire(
        {
          icon: "success",
          title: "Berhasil",
          text: "Selamat, Anda Berhasil Masuk ",
          showConfirmButton: false,
          timer: 1500,
        },
        () => {}
      );
      window.location.href = "/";
      console.log("Login successful");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Anda Gagal Masuk, Periksa Kembali Passowrd dan Email Anda ",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(error);
    }
  };
  render() {
    return (
      <div className="w-full h-[100vh] overflow-hidden  relative">
        <img
          src="https://images.unsplash.com/photo-1622126807280-9b5b32b28e77?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="w-full h-[100vh] overflow-hidden absolute "
        />
        <div className="w-full flex flex-col pl-[5rem]  h-[100vh] overflow-hidden absolute bg-gradient-to-r from-slate-900/100 via-slate-900/90  to-slate-900/10">
          <div
            data-aos="fade-down"
            data-aos-delay="50"
            className="border-b pb-6 border-b-teal-500 ml-8 text-[3rem] text-slate-300 font-semibold mt-32 w-[44rem]"
          >
            <h1 className="">Employee Management App</h1>
          </div>
          <div
            data-aos="fade-down"
            data-aos-delay="250"
            className=" h-[28rem] bg-opacity-80 p-10 rounded-lg shadow-lg w-full max-w-md    flex justify-center flex-col items-center"
          >
            <div className="text-start  text-slate-300 mb-8 w-full">
              <h1 className="text-3xl font-semibold">Masuk Akun</h1>
            </div>
            <form className="w-full">
              <div
                data-aos="fade-down"
                data-aos-delay="350"
                className="mb-4 w-full"
              >
                <label className="block text-gray-400 mb-2 w-full">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 h-14 rounded-xl bg-gray-800 text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Masukkan Email anda"
                  onChange={this.handleEmailChange}
                />
              </div>
              <div data-aos="fade-down" data-aos-delay="450" className="mb-6">
                <label className="block text-gray-400 mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 h-14 rounded-xl bg-gray-800 text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Masukkan Passoword Anda"
                  onChange={(e) => {
                    this.setState({ password: e.target.value });
                  }}
                />
              </div>
              <button
                data-aos="fade-down"
                data-aos-delay="550"
                className="button-add w-full font-bold"
                onClick={this.handleSubmit}
              >
                Masuk
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Auth;
