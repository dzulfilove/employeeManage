import "./App.css";
import "../src/styles/button.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import React, { useEffect, useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { BsPersonWorkspace } from "react-icons/bs";

import { FaRegUser } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "dayjs/locale/id";

import { IoMdExit } from "react-icons/io";
import Dashboard from "./pages/dashboard";
import { BsPersonLinesFill } from "react-icons/bs";
import Candidate from "./pages/candidate";
import Employee from "./pages/employee";
import ManageCandidate from "./pages/manageCandidate";
import EmployeeDetail from "./pages/employeeDetail";
const App = () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const menus = [
    { name: "Dashboard", link: "", icon: MdOutlineDashboard },
    { name: "Kandidat", link: "candidate", icon: BsPersonLinesFill },
    { name: "Karyawan", link: "employee", icon: BsPersonWorkspace },
  ];

  const [open, setOpen] = useState(true);
  const [menu, setMenu] = useState("dashboard");
  const [isSubMenu, setIsSubMenu] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userID");
    sessionStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  return (
    <section className={`flex w-full gap-6 bg-slate-900 h-full`}>
      <div
        className={`bg-slate-800 min-h-screen pl-8 z-[999] ${
          open ? "w-[17rem]" : "w-[6rem]"
        } duration-500 text-gray-100 px-4 text-xl border-r-2 border-r-slate-600`}
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
                    className={`text-xl font-semibold text-blue-100 text-center whitespace-pre duration-500 ${
                      !open && "opacity-0 translate-x-28 overflow-hidden"
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
              onClick={() => setOpen(!open)}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 relative text-blue-100">
          {!isLoggedIn ? (
            <>
              {menus.map((menu) => (
                <div
                  className={`flex flex-col justify-start  gap-3 items-center ${
                    open ? "overflow-y-hidden" : ""
                  }`}
                >
                  <button
                    onClick={
                      menu.name == "Kandidat"
                        ? () => setIsSubMenu(!isSubMenu)
                        : () => {
                            window.location.href = `/${menu.link}`;
                          }
                    }
                    className={` ${menu?.margin && "mt-5"} z-[9] group flex ${
                      open == true
                        ? "justify-start w-[10rem] px-4 gap-3.5"
                        : " p-2 justify-center w-[4rem]"
                    } items-center  text-lg button  font-medium rounded-md  transition duration-300 ease-in-out`}
                  >
                    <div className="button-content">
                      {React.createElement(menu.icon, { size: "20" })}
                    </div>
                    <h2
                      style={{
                        transitionDelay: `${1 + 3}00ms`,
                      }}
                      className={`whitespace-pre duration-500 button-content ${
                        !open && "opacity-0 hidden translate-x-28  "
                      }`}
                    >
                      {menu.name}
                    </h2>
                    <h2
                      className={`${
                        open && "hidden"
                      } absolute z-[99999] left-48 bg-slate-300 font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                    >
                      {menu.name}
                    </h2>
                  </button>
                  {isSubMenu && menu.name == "Kandidat" && open && (
                    <div
                      data-aos="slide-down"
                      className=" top-full left-0 w-48  shadow-md py-2  rounded text-base overlow-hidden"
                      onAnimationEnd={() => setIsSubMenu(false)}
                    >
                      <ul>
                        <li className="  py-2 button  text-slate-300 flex items-center justify-start pl-10 ">
                          <a
                            href="/all-candidate"
                            className=" button-content  text-slate-300 "
                          >
                            Semua Kandidat
                          </a>
                        </li>
                        <li className=" mt-4  py-2 button  text-slate-300 flex items-center justify-start pl-10">
                          <a
                            href="/manage-candidate"
                            className=" button-content text-slate-300 "
                          >
                            Kelola kandidat
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  window.location.href = `/`;
                }}
                className={` ${
                  menu?.margin && "mt-5"
                } group flex items-center text-base  gap-3.5 font-medium p-2 hover:bg-blue-600 rounded-md`}
              >
                <div>
                  {React.createElement(MdOutlineDashboard, { size: "20" })}
                </div>
                <h2
                  style={{
                    transitionDelay: `${1 + 3}00ms`,
                  }}
                  className={`whitespace-pre duration-500 ${
                    !open && "opacity-0 translate-x-28 overflow-hidden"
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
              <button
                onClick={handleLogout}
                className={` ${
                  menu?.margin && "mt-5"
                } group flex items-center text-base  gap-3.5 font-medium p-2 hover:bg-blue-600 rounded-md`}
              >
                <div>{React.createElement(IoMdExit, { size: "20" })}</div>
                <h2
                  style={{
                    transitionDelay: `${2 + 3}00ms`,
                  }}
                  className={`whitespace-pre duration-500 ${
                    !open && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
                >
                  Logout
                </h2>
                <h2
                  className={`${
                    open && "hidden"
                  } absolute left-48 bg-slate-900 font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                >
                  Logout
                </h2>
              </button>
            </>
          )}
        </div>
      </div>
      <div className=" mt-8 text-gray-900 font-semibold w-full flex flex-col justify-start items-center bg-slate-900 px-6 ">
        <Router>
          <div className="h-[100vh] w-[100%]  p-0 m-0">
            <Routes>
              {/* {isLoggedIn ? (
                <> */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/all-candidate" element={<Candidate />} />
              <Route path="/employee" element={<Employee />} />
              <Route path="/employee-detail" element={<EmployeeDetail />} />
              <Route path="/manage-candidate" element={<ManageCandidate />} />
              {/* </>
              ) : (
                <> */}
              {/* </>
              )} */}
            </Routes>
          </div>
        </Router>
        {/* <Loading /> */}
      </div>
    </section>
  );
};

export default App;
