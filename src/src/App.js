import "./App.css";
import "../src/styles/button.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Redirect,
  Navigate,
  useLocation,
} from "react-router-dom";

import React, { useEffect, useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { BsPersonWorkspace } from "react-icons/bs";
import { CgDatabase } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "dayjs/locale/id";

import { IoMdExit } from "react-icons/io";

import { BsPersonLinesFill } from "react-icons/bs";
import Dashboard from "./pages/Dashboard/dashboard";
import Candidate from "./pages/Candidate/candidate";
import CandidateDetail from "./pages/Candidate/candidateDetail";
import Employee from "./pages/Employee/employee";
import EmployeeDetail from "./pages/Employee/employeeDetail";
import EksEmployee from "./pages/Employee/eksEmployee";
import FormLamaran from "./pages/Candidate/lamaranKerja";
import EndedContract from "./pages/others/endedContract";
import ManageCandidate from "./pages/Candidate/manageCandidate";
import AddEmployee from "./pages/Employee/addEmployee";

import SendedForm from "./pages/others/sendedForm";
import Auth from "./pages/Auth/auth";
import MasterDataPosition from "./pages/masterData/masterDataPosition";
import MasterDataDivisi from "./pages/masterData/masterDataDivisi";
import PDFViewer from "./components/features/pdfViewer";
import DocumentViewer from "./components/features/docViewer";
import axios from "axios";
import AuthMobile from "./pages/Auth/authMobile";
import NavbarMobile from "./components/features/navbarMobile";
import EmployeeMobile from "./pages/Employee/employeeMobile";
import EmployeeDetailMobile from "./pages/Employee/employeeDetailMobile";

const App = () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const isLamaran = sessionStorage.getItem("isLamaran");
  const peran = sessionStorage.getItem("peran");
  const location = useLocation();
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [isAkses, setIsAkses] = useState(false);

  // const isLoggedIn = true;
  const menus = [
    { name: "Dashboard", link: "", icon: MdOutlineDashboard, main: false },
    // {
    //   name: "Kandidat",
    //   link: "candidate",
    //   icon: BsPersonLinesFill,
    //   main: true,
    // },
    { name: "Karyawan", link: "employee", icon: BsPersonWorkspace, main: true },
    {
      name: "Master Data",
      link: "masterData",
      icon: CgDatabase,
      main: true,
    },
  ];

  const menusHRD = [
    { name: "Dashboard", link: "", icon: MdOutlineDashboard, main: false },
    {
      name: "Kandidat",
      link: "candidate",
      icon: BsPersonLinesFill,
      main: true,
    },
    { name: "Karyawan", link: "employee", icon: BsPersonWorkspace, main: true },
    {
      name: "Master Data",
      link: "masterData",
      icon: CgDatabase,
      main: true,
    },
  ];

  const listMenu = peran == "Scrum Master" ? menusHRD : menus;
  const [open, setOpen] = useState(true);
  const [openKaryawan, setOpenKaryawan] = useState(true);
  const [openMasterData, setOpenMasterData] = useState(true);
  const [menu, setMenu] = useState("dashboard");
  const [isSubMenu, setIsSubMenu] = useState(false);
  const [isSubMenuKaryawan, setIsSubMenuKaryawan] = useState(false);
  const [isSubMenuMasterData, setIsSubMenuMasterData] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700 });
    if (location.pathname === "/preview") {
      setSidebarVisible(false);
    } else {
      setSidebarVisible(true);
    }
    const checkDeviceSize = () => {
      const width = window.innerWidth;

      setIsMobile(width < 768); // Mobile: kurang dari 768px
    };

    // Inisialisasi cek ukuran perangkat
    checkDeviceSize();
    window.addEventListener("resize", checkDeviceSize);

    return () => {
      window.removeEventListener("resize", checkDeviceSize);
    };
  }, [location]);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userID");
    sessionStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  return (
    <>
      {isMobile ? (
        <>
          <div className="relative flex flex-col w-full h-[100vh]">
            <div className=" w-full">
              <NavbarMobile />
            </div>

            {isLoggedIn ? (
              <>
                <div className=" w-full overflow-y-scroll pb-10">
                  <Routes>
                    <Route path="/" element={<EmployeeMobile />} />
                    <Route
                      path="/employee-detail/:id"
                      element={<EmployeeDetailMobile />}
                    />
                    <Route path="/employee" element={<EmployeeMobile />} />
                  </Routes>
                </div>
              </>
            ) : (
              <>
                <Routes>
                  <Route path="/" element={<AuthMobile />} />
                </Routes>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {isLoggedIn ? (
            <>
              {/* <Router> */}
              {isSidebarVisible ? (
                <>
                  <section
                    className={` flex w-full gap-6 bg-slate-900 h-full p-0`}
                  >
                    <div
                      className={`bg-slate-800 min-h-screen pl-8 z-[999] ${
                        open ? "w-[17rem]" : "w-[6rem]"
                      } duration-500 text-gray-100 px-4 text-sm border-r-2 border-r-slate-600`}
                    >
                      <div className="flex justify-between items-center mt-12 w-full border-b border-b-slate-600 pb-12">
                        <div
                          className={`flex ${
                            open ? "px-4" : "px-0"
                          }items-center justify-center gap-2 py-5.5 lg:py-6.5  `}
                        >
                          <div
                            className="flex px-1 justify-start gap-5 w-full items-center text-blue-100"
                            onClick={() => {
                              window.location.href = "/";
                            }}
                          >
                            <FaRegUser />
                            {open && (
                              <>
                                <h5
                                  style={{
                                    transitionDelay: `${4}00ms`,
                                  }}
                                  className={`text-base font-semibold text-blue-100 text-center whitespace-pre duration-500 ${
                                    !open &&
                                    "opacity-0 translate-x-28 overflow-hidden"
                                  }`}
                                >
                                  Halo Admin
                                </h5>
                              </>
                            )}
                          </div>
                        </div>
                        <div className=" flex justify-end items-center ">
                          <HiMenuAlt3
                            size={26}
                            className="cursor-pointer"
                            onClick={() => {
                              setOpen(!open);
                              setOpenKaryawan(!openKaryawan);
                              setOpenMasterData(!openMasterData);
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-4 relative text-blue-100 ">
                        {isLoggedIn ? (
                          <>
                            {listMenu.map((menu) => (
                              <div
                                className={`flex flex-col justify-start  gap-3 items-center ${
                                  open ? "overflow-y-hidden" : ""
                                }`}
                              >
                                {menu.main == false ? (
                                  <>
                                    <Link
                                      to={`/${menu.link}`}
                                      className={` ${
                                        menu?.margin && "mt-5"
                                      } z-[9] group flex ${
                                        open == true
                                          ? "justify-start w-[10rem] px-4 gap-3.5"
                                          : " p-2 justify-center w-[4rem]"
                                      } items-center  text-lg button  font-medium rounded-md  transition duration-300 ease-in-out`}
                                    >
                                      <div className="button-content">
                                        {React.createElement(menu.icon, {
                                          size: "20",
                                        })}
                                      </div>
                                      <h2
                                        style={{
                                          transitionDelay: `${1 + 3}00ms`,
                                        }}
                                        className={`whitespace-pre duration-500 button-content text-sm ${
                                          !open &&
                                          "opacity-0 hidden translate-x-28  "
                                        }`}
                                      >
                                        {menu.name}
                                      </h2>
                                      <h2
                                        className={`${
                                          open && "hidden"
                                        } absolute z-[99999] text-sm left-48 bg-slate-300 font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                                      >
                                        {menu.name}
                                      </h2>
                                    </Link>
                                  </>
                                ) : (
                                  <>
                                    {menu.name == "Kandidat" && (
                                      <>
                                        <button
                                          onClick={() =>
                                            setIsSubMenu(!isSubMenu)
                                          }
                                          className={` ${
                                            menu?.margin && "mt-5"
                                          } z-[9] group flex ${
                                            open == true
                                              ? "justify-start w-[10rem] px-4 gap-3.5"
                                              : " p-2 justify-center w-[4rem]"
                                          } items-center  text-lg button  font-medium rounded-md  transition duration-300 ease-in-out`}
                                        >
                                          <div className="button-content">
                                            {React.createElement(menu.icon, {
                                              size: "20",
                                            })}
                                          </div>
                                          <h2
                                            style={{
                                              transitionDelay: `${1 + 3}00ms`,
                                            }}
                                            className={`whitespace-pre duration-500 button-content text-sm ${
                                              !open &&
                                              "opacity-0 hidden translate-x-28  "
                                            }`}
                                          >
                                            {menu.name}
                                          </h2>
                                          <h2
                                            className={`${
                                              open && "hidden"
                                            } absolute z-[99999] left-48 text-sm bg-slate-300 font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                                          >
                                            {menu.name}
                                          </h2>
                                        </button>
                                      </>
                                    )}
                                    {menu.name == "Karyawan" && (
                                      <>
                                        <button
                                          onClick={() =>
                                            setIsSubMenuKaryawan(
                                              !isSubMenuKaryawan
                                            )
                                          }
                                          className={` ${
                                            menu?.margin && "mt-5"
                                          } z-[9] group flex ${
                                            openKaryawan == true
                                              ? "justify-start w-[10rem] px-4 gap-3.5"
                                              : " p-2 justify-center w-[4rem]"
                                          } items-center  text-lg button  font-medium rounded-md  transition duration-300 ease-in-out`}
                                        >
                                          <div className="button-content">
                                            {React.createElement(menu.icon, {
                                              size: "20",
                                            })}
                                          </div>
                                          <h2
                                            style={{
                                              transitionDelay: `${1 + 3}00ms`,
                                            }}
                                            className={`whitespace-pre duration-500 button-content text-sm ${
                                              !openKaryawan &&
                                              "opacity-0 hidden translate-x-28  "
                                            }`}
                                          >
                                            {menu.name}
                                          </h2>
                                          <h2
                                            className={`${
                                              openKaryawan && "hidden"
                                            } absolute z-[99999] left-48 text-sm bg-slate-300 font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                                          >
                                            {menu.name}
                                          </h2>
                                        </button>
                                      </>
                                    )}
                                    {menu.name == "Master Data" && (
                                      <>
                                        <button
                                          onClick={() =>
                                            setIsSubMenuMasterData(
                                              !isSubMenuMasterData
                                            )
                                          }
                                          className={` ${
                                            menu?.margin && "mt-5"
                                          } z-[9] group flex ${
                                            openMasterData == true
                                              ? "justify-start w-[10rem] px-4 gap-3.5"
                                              : " p-2 justify-center w-[4rem]"
                                          } items-center  text-lg button  font-medium rounded-md  transition duration-300 ease-in-out`}
                                        >
                                          <div className="button-content">
                                            {React.createElement(menu.icon, {
                                              size: "20",
                                            })}
                                          </div>
                                          <h2
                                            style={{
                                              transitionDelay: `${1 + 3}00ms`,
                                            }}
                                            className={`whitespace-pre duration-500 button-content text-sm ${
                                              !openMasterData &&
                                              "opacity-0 hidden translate-x-28  "
                                            }`}
                                          >
                                            {menu.name}
                                          </h2>
                                          <h2
                                            className={`${
                                              openMasterData && "hidden"
                                            } absolute z-[99999] left-48 text-sm bg-slate-300 font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                                          >
                                            {menu.name}
                                          </h2>
                                        </button>
                                      </>
                                    )}
                                  </>
                                )}

                                {isSubMenu &&
                                  menu.name == "Kandidat" &&
                                  open && (
                                    <div
                                      data-aos="slide-down"
                                      className=" top-full left-0 w-48  shadow-md py-2  rounded text-sm overlow-hidden text-sm"
                                      onAnimationEnd={() => setIsSubMenu(false)}
                                    >
                                      <ul>
                                        <li className="  py-2 button  text-slate-300 flex items-center justify-start pl-10 ">
                                          <Link
                                            to="/all-candidate"
                                            className=" button-content  text-slate-300 text-sm"
                                          >
                                            Semua Kandidat
                                          </Link>
                                        </li>
                                        <li className=" mt-4  py-2 button  text-slate-300 flex items-center justify-start pl-10">
                                          <Link
                                            to="/manage-candidate"
                                            className=" button-content text-slate-300 "
                                          >
                                            Kelola kandidat
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                                {isSubMenuKaryawan &&
                                  menu.name == "Karyawan" &&
                                  openKaryawan && (
                                    <div
                                      data-aos="slide-down"
                                      className=" top-full left-0 w-48  shadow-md py-2  rounded text-sm overlow-hidden text-sm"
                                      onAnimationEnd={() => setIsSubMenu(false)}
                                    >
                                      <ul>
                                        <li className="  py-2 button  text-slate-300 flex items-center justify-start pl-10 ">
                                          <Link
                                            to="/employee"
                                            className=" button-content  text-slate-300 text-sm"
                                          >
                                            Karyawan Aktif
                                          </Link>
                                        </li>
                                        <li className=" mt-4  py-2 button  text-slate-300 flex items-center justify-start pl-10">
                                          <Link
                                            to="/employee-nonaktif"
                                            className=" button-content text-slate-300 "
                                          >
                                            Karyawan Non Aktif
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                                {isSubMenuMasterData &&
                                  menu.name == "Master Data" &&
                                  openMasterData && (
                                    <div
                                      data-aos="slide-down"
                                      className=" top-full left-0 w-48  shadow-md py-2  rounded text-sm overlow-hidden text-sm"
                                      onAnimationEnd={() => setIsSubMenu(false)}
                                    >
                                      <ul>
                                        <li className="  py-2 button  text-slate-300 flex items-center justify-start pl-10 ">
                                          <Link
                                            to="/data-position"
                                            className=" button-content  text-slate-300 text-sm"
                                          >
                                            Data Posisi
                                          </Link>
                                        </li>
                                        <li className=" mt-4  py-2 button  text-slate-300 flex items-center justify-start pl-10">
                                          <Link
                                            to="/data-division"
                                            className=" button-content text-slate-300 "
                                          >
                                            Data Divisi
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            ))}
                            <div
                              className={`flex flex-col justify-start  gap-3 items-center ${
                                open ? "overflow-y-hidden" : ""
                              }`}
                            >
                              <button
                                onClick={handleLogout}
                                className={` ${
                                  menu?.margin && "mt-5"
                                } z-[9] group flex ${
                                  open == true
                                    ? "justify-start w-[10rem] px-4 gap-3.5"
                                    : " p-2 justify-center w-[4rem]"
                                } items-center  text-lg button  font-medium rounded-md  transition duration-300 ease-in-out`}
                              >
                                <div className="button-content">
                                  <div>
                                    {React.createElement(IoMdExit, {
                                      size: "20",
                                    })}
                                  </div>
                                </div>
                                <h2
                                  style={{
                                    transitionDelay: `${1 + 3}00ms`,
                                  }}
                                  className={`whitespace-pre duration-500 button-content text-sm ${
                                    !open && "opacity-0 hidden translate-x-28  "
                                  }`}
                                >
                                  Logout
                                </h2>
                                <h2
                                  className={`${
                                    open && "hidden"
                                  } absolute z-[99999] left-48 text-sm bg-slate-300 font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                                >
                                  Logout
                                </h2>
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                window.location.href = `/`;
                              }}
                              className={` ${
                                menu?.margin && "mt-5"
                              } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-blue-600 rounded-md`}
                            >
                              <div>
                                {React.createElement(MdOutlineDashboard, {
                                  size: "20",
                                })}
                              </div>
                              <h2
                                style={{
                                  transitionDelay: `${1 + 3}00ms`,
                                }}
                                className={`whitespace-pre duration-500 ${
                                  !open &&
                                  "opacity-0 translate-x-28 overflow-hidden"
                                }`}
                              >
                                Dashboard
                              </h2>
                              <h2
                                className={`${
                                  open && "hidden"
                                } absolute left-48 bg-slate-900 font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                              >
                                Dashboard
                              </h2>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className=" mt-8 text-gray-900 font-semibold w-full flex flex-col justify-start items-center bg-slate-900 px-6 overflow-y-scroll">
                      <div className="h-[100vh] w-[100%]  p-0 m-0">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route
                            path="/data-division"
                            element={<MasterDataDivisi />}
                          />
                          <Route
                            path="/data-position"
                            element={<MasterDataPosition />}
                          />

                          <Route
                            path="/all-candidate"
                            element={<Candidate />}
                          />
                          <Route path="/employee" element={<Employee />} />
                          <Route
                            path="/employee-nonaktif"
                            element={<EksEmployee />}
                          />
                          <Route
                            path="/lamar-kerja"
                            element={<FormLamaran />}
                          />
                          <Route
                            path="/employee-detail/:id"
                            element={<EmployeeDetail />}
                          />
                          <Route
                            path="/send-notif"
                            element={<EndedContract />}
                          />

                          <Route
                            path="/candidate-detail/:id"
                            element={<CandidateDetail />}
                          />
                          <Route
                            path="/add-employee"
                            element={<AddEmployee />}
                          />
                          <Route
                            path="/manage-candidate"
                            element={<ManageCandidate />}
                          />
                        </Routes>
                      </div>
                    </div>
                  </section>
                </>
              ) : (
                <>
                  <Routes>
                    <Route path="/preview/:url" element={<PDFViewer />} />
                  </Routes>
                </>
              )}
              {/* </Router> */}
            </>
          ) : (
            <>
              <div>
                {/* <Router> */}
                <Routes>
                  <Route exact path="/" element={<Auth />} />
                  <Route path="/form-lamaran-kerja" element={<FormLamaran />} />
                  <Route path="/send-notif" element={<EndedContract />} />

                  {isLamaran && (
                    <>
                      <Route path="/sended-form" element={<SendedForm />} />
                    </>
                  )}
                  {/* <Route path="*" element={<Navigate to="/" />} /> */}
                </Routes>
                {/* </Router> */}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default App;
