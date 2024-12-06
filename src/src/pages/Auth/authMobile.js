import React, { Component, createRef } from "react";
import "../../styles/card.css";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import { db } from "../../config/firebase";
import { IoMdRefresh } from "react-icons/io";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
class AuthMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
      captchaInput: "",
      captchaError: "",
      userData: {},
      captchaVerified: false,
      captchaLoadError: false,
      formError: "",
      timeoutError: false, // Menyimpan status timeout error
      captchaLoading: false, // Status untuk menampilkan loading CAPTCHA
    };
    this.recaptchaRef = createRef(); // Buat referensi untuk elemen ReCAPTCHA
  }

  handleEmailChange = (event) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validasi saat user mengetik
    if (!emailRegex.test(event.target.value)) {
      this.setState({ error: "Harap masukkan email yang valid." });
    } else {
      this.setState({ email: event.target.value, error: "" });
    }
  };

  handleChange = (e) => {
    const email = e.target.value;
    if (!this.emailRegex.test(email)) {
      this.setState({ email, error: "Harap masukkan email yang valid." });
    } else {
      this.setState({ email, error: "" });
    }
  };

  handleCaptcha = (value) => {
    if (value) {
      this.setState({ captchaVerified: true, captchaError: "" });
    } else {
      this.setState({
        captchaVerified: false,
        captchaError: "Verifikasi CAPTCHA gagal, silakan coba lagi.",
      });
    }
  };

  handleCaptchaError = () => {
    this.setState({
      captchaLoadError: true,
      captchaLoading: false,
    });
  };

  handleCaptchaLoaded = () => {
    // alert("ReCAPTCHA loaded successfully!");
    this.setState({
      captchaLoading: false,
    });
  };

  handleRefreshCaptcha = () => {
    if (this.recaptchaRef.current) {
      this.recaptchaRef.current.reset(); // Reset status CAPTCHA
    }
    this.setState({
      captchaVerified: false,
      captchaError: "",
      captchaLoadError: false,
      timeoutError: false, // Reset timeout error
      captchaLoading: true, // Set loading state
    });
  };

  handleTimeoutError = () => {
    this.setState({ timeoutError: true });
    setTimeout(() => {
      window.location.reload(); // Refresh halaman setelah timeout
    }, 3000); // Tunggu 3 detik sebelum menyegarkan halaman
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
      sessionStorage.setItem("peran", userData.peran);

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
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Harap Isi Semua Kolom",
        text: "Isi Email dan Password",
        showConfirmButton: true,
      });
      return;
    }

    if (!this.state.captchaVerified) {
      this.setState({ captchaError: "Silakan selesaikan verifikasi CAPTCHA." });
      return;
    }
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
    const siteKey = "6Lcrr5IqAAAAAPdbKBWuh6lWkmQhGUWfvKMhI7Eq";
    return (
      <>
  
        <div className="w-full h-[100vh] overflow-hidden  relative">
          <img
            src="https://images.unsplash.com/photo-1622126807280-9b5b32b28e77?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="w-full h-[100vh] overflow-hidden absolute "
          />
          <div className="w-full flex flex-col justify-center  h-[100vh] overflow-hidden absolute bg-gradient-to-r from-slate-900/100 via-slate-900/90  to-slate-900/10">
            <div className="min-h-screen flex items-center justify-center  px-4">
              <div className="bg-transparent border-2 text-white border-white shadow-lg rounded-lg p-6 w-full max-w-sm">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-100">
                    Welcome Back To Employee Management App
                  </h2>
                  <p className="text-sm mt-6 text-gray-100">
                    Login to your account
                  </p>
                </div>

                {/* Form */}
                <form className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-100"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      onChange={this.handleEmailChange}
                      required
                      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                    {this.state.error && (
                      <p className="text-red-500 text-sm mb-2 mt-2">
                        {this.state.error}
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-100"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      onChange={(e) => {
                        this.setState({ password: e.target.value });
                      }}
                      required
                      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div data-aos="fade-down" data-aos-delay="450" className="mb-6">
                <div className="flex justify-between items-center">
                  {this.state.captchaLoading ? (
                    <p className="text-gray-500">Memuat CAPTCHA...</p>
                  ) : (
                    <>
                      {this.state.captchaLoadError ? (
                        <p className="text-red-500 text-sm">
                          Gagal memuat CAPTCHA. Silakan refresh halaman.
                        </p>
                      ) : (
                        <>
                          {" "}
                          <div className="flex flex-col justify-between items-center">
                            <ReCAPTCHA
                              ref={this.recaptchaRef} // Pasang referensi pada elemen ReCAPTCHA
                              sitekey={siteKey}
                              onChange={this.handleCaptcha}
                              onErrored={this.handleCaptchaError}
                              onLoaded={this.handleCaptchaLoaded} // Pastikan ini ada
                            />
                            {this.state.captchaError && (
                              <div className="border-2 border-red-600 flex justify-center items-center p-1 w-full rounded-lg mt-2">
                                <p className="text-red-500 text-sm font-semibold">
                                  {this.state.captchaError}
                                </p>
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={this.handleRefreshCaptcha}
                            className="bg-white text-base text-black py-1 px-2 rounded hover:bg-gray-400 mr-2"
                          >
                            <IoMdRefresh className="text-2xl" />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
                {this.state.timeoutError && (
                  <div className="text-center text-red-500">
                    <p>
                      Terjadi kesalahan jaringan. Halaman akan disegarkan dalam
                      beberapa detik...
                    </p>
                  </div>
                )}
              </div>

                  {/* Submit Button */}

                  <button
                    // data-aos="fade-down"
                    // data-aos-delay="550"
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
        </div>
      </>
    );
  }
}

export default AuthMobile;
