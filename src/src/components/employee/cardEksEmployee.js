import React from "react";
import { GoArrowUpRight } from "react-icons/go";
import "../../styles/card.css";
export default function CardEksEmployee(props) {
  return (
    <div>
      {" "}
      <div className="w-[100%] flex justify-between items-center  text-2xl font-semibold  p-2 py-6 rounded-xl">
        <div
          data-aos="fade-down"
          data-aos-delay="50"
          className="flex  card xl:card-eks flex-col relative justify-center items-start gap-1 w-[32rem] h-[15rem]  bg-transparent overflow-hidden border-l-8 border-l-red-500 rounded-md  hover:bg-slate-800 shadow-xl"
        >
          <div className="content xl:content-eks flex flex-col absolute justify-center items-start gap-1 w-[32rem] h-[15rem] opacity-75 bg-slate-800 overflow-hidden rounded-md shadow-lg "></div>
          <div className="w-[8rem] h-[8rem] opacity-35 rounded-full blur-2xl bg-red-400 absolute right-[5%] top-[5%]"></div>

          <div className="flex justify-start gap-6 items-start w-full h-[50%] p-4 z-[99] ">
            <div className="flex justify-start flex-col ">
              <h5 className="text-white text-base font-normal ">
                Total Karyawan
              </h5>{" "}
              <h5 className="text-slate-300 text-sm font-normal mt-1">
                Total Karyawan Tidak Aktif
              </h5>
            </div>
          </div>

          <div className="flex gap-5 justify-center  mt-6 w-full border-t border-t-red-500 pt-4 p-4 z-[99]">
            <div className="flex gap-2 whitespace-nowrap">
              <div className="grow text-4xl font-bold text-white">
                {props.totalKaryawan}
              </div>
              <div className="ml-6 flex items-center text-sm text-slate-300">
                Karyawan
              </div>
            </div>
          </div>
        </div>

        <div
          data-aos="fade-down"
          data-aos-delay="250 "
          className="flex card xl:card-eks  flex-col relative justify-center items-start gap-1 w-[32rem] h-[15rem]  bg-transparent overflow-hidden border-l-8 border-l-yellow-500 rounded-md shadow-lg "
        >
          <div className=" content xl:content-eks flex flex-col absolute justify-center items-start gap-1 w-[32rem] h-[15rem] opacity-75 bg-slate-800 overflow-hidden rounded-md shadow-lg "></div>
          <div className="w-[8rem] h-[8rem] opacity-35 rounded-full blur-2xl bg-yellow-400 absolute right-[5%] top-[5%]"></div>

          <div className="flex justify-start gap-6 items-start w-full p-4 z-[99] h-[50%]">
            <div className="flex justify-start flex-col ">
              <h5 className="text-white text-base font-normal ">
                Karyawan Baru
              </h5>{" "}
              <h5 className="text-slate-300 text-sm font-normal mt-1">
                Karyawan Dengan Masa Kerja Kurang Dari 5 Bulan
              </h5>
            </div>
          </div>

          <div className="flex gap-5 justify-center  mt-6 w-full border-t border-t-yellow-500 pt-4 p-4 z-[99]">
            <div className="flex gap-2 whitespace-nowrap">
              <div className="grow text-4xl font-bold text-white">
                {props.totalKaryawanBaru}
              </div>
              <div className="ml-6 flex items-center text-sm text-slate-300">
                Karyawan
              </div>
            </div>
          </div>
        </div>
        <div
          data-aos="fade-down"
          data-aos-delay="350"
          className=" card xl:card-eks flex  flex-col relative justify-center items-start gap-1 w-[32rem] h-[15rem]  bg-transparent overflow-hidden border-l-8 border-l-emerald-500 rounded-md shadow-lg "
        >
          <div className="content xl:content-eks flex flex-col absolute justify-center items-start gap-1 w-[32rem] h-[15rem] opacity-75 bg-slate-800 overflow-hidden rounded-md shadow-lg "></div>

          <div className="w-[8rem] h-[8rem] opacity-35 rounded-full blur-2xl bg-emerald-400 absolute right-[5%] top-[5%]"></div>

          <div className="flex p-4 justify-start gap-6 items-center w-full z-[99] h-[50%]">
            <div className="flex justify-start flex-col ">
              <h5 className="text-white text-base font-normal ">
                Karyawan Lama
              </h5>{" "}
              <h5 className="text-slate-300 text-sm font-normal mt-1">
                Karyawan Dengan Masa Kerja Lebih Dari 5 Bulan
              </h5>
            </div>
          </div>

          <div className="flex  p-4 gap-5 justify-center  mt-6 w-full border-t border-t-emerald-500 pt-4 z-[99]">
            <div className="flex gap-2 whitespace-nowrap">
              <div className="grow text-4xl font-bold text-white">
                {props.totalKaryawanLama}
              </div>
              <div className="ml-6 flex items-center text-sm text-slate-300">
                Karyawan
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
