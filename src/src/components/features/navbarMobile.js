import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

const NavbarMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-slate-900 shadow-md absolute z-[9999] w-full">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Judul */}
        <h1 className="text-xl font-semibold">Dashboard</h1>

        {/* Burger Menu */}
        <button
          className="lg:hidden p-2 duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <IoClose size={24} /> : <HiMenuAlt3 size={24} />}
        </button>

        {/* Menu Items (Hidden on Mobile) */}
        <ul className="hidden lg:flex space-x-6">
          <li className="hover:text-gray-200 cursor-pointer">Karyawan</li>
          <li className="hover:text-gray-200 cursor-pointer">Kandidat</li>
          <li className="hover:text-gray-200 cursor-pointer">Posisi</li>
          <li className="hover:text-gray-200 cursor-pointer">Divisi</li>
        </ul>
      </div>

      {/* Dropdown Menu (Mobile) */}
      {isOpen && (
        <div className="lg:hidden bg-slate-600">
          <ul className="flex flex-col space-y-2 py-4 px-6">
            <Link
              to={"/employee"}
              className="hover:bg-white hover:text-slate-900 text-white  rounded-md py-2 px-4 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Karyawan
            </Link>
            <Link
              to={""}
              className="hover:bg-white hover:text-slate-900 text-white rounded-md py-2 px-4 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Kandidat
            </Link>
            <Link
              to={""}
              className="hover:bg-white hover:text-slate-900 text-white rounded-md py-2 px-4 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Posisi
            </Link>
            <Link
              to={""}
              className="hover:bg-white hover:text-slate-900 text-white rounded-md py-2 px-4 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Divisi
            </Link>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavbarMobile;
