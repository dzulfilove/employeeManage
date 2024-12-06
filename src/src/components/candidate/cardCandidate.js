import React from "react";
import "../../styles/card.css";
export default function CardCandidate(props) {
  const {
    candidateList,
    tahapSeleksiAwal,
    tahapAdministrasi,
    tahapTes,
    tahapInterview,
  } = props;

  return (
    <div>
      {" "}
      <div className="w-[100%] flex justify-between items-center  text-2xl font-semibold  p-2 py-6 rounded-xl">
        <div
          data-aos="fade-down"
          data-aos-delay="50"
          className="flex  card flex-col relative justify-center items-start gap-1 w-[25rem] h-[15rem]  bg-transparent overflow-hidden border-l-8 border-l-red-500 rounded-md  hover:bg-slate-800 shadow-xl"
        >
          <div className="content flex flex-col absolute justify-center items-start gap-1 w-[25rem] h-[15rem] opacity-75 bg-slate-800 overflow-hidden rounded-md shadow-lg "></div>
          <div className="w-[8rem] h-[8rem] opacity-35 rounded-full blur-2xl bg-red-400 absolute right-[5%] top-[5%]"></div>

          <div className="flex justify-between items-start w-full p-4 z-[99] ">
            <div className="flex justify-start flex-col ">
              <h5 className="text-white text-base font-normal ">
                Tahap Administrasi
              </h5>{" "}
              <h5 className="text-slate-300 text-sm font-normal mt-1">
                Lolos Tahap Administrasi
              </h5>
            </div>

            <div className="w-[2rem] h-[2rem] relative rounded-full flex justify-center items-center bg-transparent ">
              <div className="w-[2rem] h-[2rem] absolute  rounded-full opacity-25  flex justify-center items-center bg-white "></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M21.92 6.62a1 1 0 0 0-.54-.54A1 1 0 0 0 21 6h-5a1 1 0 0 0 0 2h2.59L13 13.59l-3.29-3.3a1 1 0 0 0-1.42 0l-6 6a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0L9 12.41l3.29 3.3a1 1 0 0 0 1.42 0L20 9.41V12a1 1 0 0 0 2 0V7a1 1 0 0 0-.08-.38"
                />
              </svg>
            </div>
          </div>

          <div className="flex gap-5 justify-center  mt-6 w-full border-t border-t-red-500 pt-4 p-4 z-[99]">
            <div className="flex gap-2 whitespace-nowrap">
              <div className="grow text-3xl font-bold text-white">
                {tahapAdministrasi.length}
              </div>
              <div className="ml-6 flex items-end text-sm text-slate-300">
                Kandidat
              </div>
            </div>
          </div>
        </div>

        <div
          data-aos="fade-down"
          data-aos-delay="150"
          className="xl:flex hidden card flex-col relative justify-center items-start gap-1 w-[25rem] h-[15rem]  bg-transparent overflow-hidden border-l-8 border-l-blue-500 rounded-md shadow-lg "
        >
          <div className="content flex flex-col absolute justify-center items-start gap-1 w-[25rem] h-[15rem] opacity-75 bg-slate-800 overflow-hidden rounded-md shadow-lg "></div>
          <div className="w-[8rem] h-[8rem] opacity-35 rounded-full blur-2xl bg-blue-400 absolute right-[5%] top-[5%]"></div>

          <div className="flex justify-between items-start w-full p-4 z-[99]">
            <div className="flex justify-start flex-col ">
              <h5 className="text-white text-base font-normal ">Tahap Tes</h5>{" "}
              <h5 className="text-slate-300 text-sm font-normal mt-1">
                Lolos Tahap Tes
              </h5>
            </div>

            <div className="w-[2rem] h-[2rem] relative rounded-full flex justify-center items-center bg-transparent ">
              <div className="w-[2rem] h-[2rem] absolute  rounded-full opacity-25  flex justify-center items-center bg-white "></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M21.92 6.62a1 1 0 0 0-.54-.54A1 1 0 0 0 21 6h-5a1 1 0 0 0 0 2h2.59L13 13.59l-3.29-3.3a1 1 0 0 0-1.42 0l-6 6a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0L9 12.41l3.29 3.3a1 1 0 0 0 1.42 0L20 9.41V12a1 1 0 0 0 2 0V7a1 1 0 0 0-.08-.38"
                />
              </svg>
            </div>
          </div>

          <div className="flex gap-5 justify-center  mt-6 w-full border-t border-t-blue-500 pt-4 p-4 z-[99]">
            <div className="flex gap-2 whitespace-nowrap">
              <div className="grow text-3xl font-bold text-white">
                {tahapTes.length}
              </div>
              <div className="ml-6 flex items-end text-sm text-slate-300">
                Kandidat
              </div>
            </div>
          </div>
        </div>

        <div
          data-aos="fade-down"
          data-aos-delay="250 "
          className="flex card  flex-col relative justify-center items-start gap-1 w-[25rem] h-[15rem]  bg-transparent overflow-hidden border-l-8 border-l-yellow-500 rounded-md shadow-lg "
        >
          <div className=" content flex flex-col absolute justify-center items-start gap-1 w-[25rem] h-[15rem] opacity-75 bg-slate-800 overflow-hidden rounded-md shadow-lg "></div>
          <div className="w-[8rem] h-[8rem] opacity-35 rounded-full blur-2xl bg-yellow-400 absolute right-[5%] top-[5%]"></div>

          <div className="flex justify-between items-start w-full p-4 z-[99]">
            <div className="flex justify-start flex-col ">
              <h5 className="text-white text-base font-normal ">
                Tahap Interview
              </h5>{" "}
              <h5 className="text-slate-300 text-sm font-normal mt-1">
                Lolos Tahap Interview
              </h5>
            </div>

            <div className="w-[2rem] h-[2rem] relative rounded-full flex justify-center items-center bg-transparent ">
              <div className="w-[2rem] h-[2rem] absolute  rounded-full opacity-25  flex justify-center items-center bg-white "></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M21.92 6.62a1 1 0 0 0-.54-.54A1 1 0 0 0 21 6h-5a1 1 0 0 0 0 2h2.59L13 13.59l-3.29-3.3a1 1 0 0 0-1.42 0l-6 6a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0L9 12.41l3.29 3.3a1 1 0 0 0 1.42 0L20 9.41V12a1 1 0 0 0 2 0V7a1 1 0 0 0-.08-.38"
                />
              </svg>
            </div>
          </div>

          <div className="flex gap-5 justify-center  mt-6 w-full border-t border-t-yellow-500 pt-4 p-4 z-[99]">
            <div className="flex gap-2 whitespace-nowrap">
              <div className="grow text-3xl font-bold text-white">
                {tahapInterview.length}
              </div>
              <div className="ml-6 flex items-end text-sm text-slate-300">
                Kandidat
              </div>
            </div>
          </div>
        </div>
        <div
          data-aos="fade-down"
          data-aos-delay="350"
          className=" card flex  flex-col relative justify-center items-start gap-1 w-[25rem] h-[15rem]  bg-transparent overflow-hidden border-l-8 border-l-emerald-500 rounded-md shadow-lg "
        >
          <div className="content flex flex-col absolute justify-center items-start gap-1 w-[25rem] h-[15rem] opacity-75 bg-slate-800 overflow-hidden rounded-md shadow-lg "></div>

          <div className="w-[8rem] h-[8rem] opacity-35 rounded-full blur-2xl bg-emerald-400 absolute right-[5%] top-[5%]"></div>

          <div className="flex p-4 justify-between items-center w-full z-[99] ">
            <div className="flex justify-start flex-col ">
              <h5 className="text-white text-base font-normal ">
                Total Kandidat
              </h5>{" "}
              <h5 className="text-slate-300 text-sm font-normal mt-1">
                Total Semua Kandidat
              </h5>
            </div>

            <div className="w-[2rem] h-[2rem] relative rounded-full flex justify-center items-center bg-transparent ">
              <div className="w-[2rem] h-[2rem] absolute  rounded-full opacity-25  flex justify-center items-center bg-white "></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M21.92 6.62a1 1 0 0 0-.54-.54A1 1 0 0 0 21 6h-5a1 1 0 0 0 0 2h2.59L13 13.59l-3.29-3.3a1 1 0 0 0-1.42 0l-6 6a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0L9 12.41l3.29 3.3a1 1 0 0 0 1.42 0L20 9.41V12a1 1 0 0 0 2 0V7a1 1 0 0 0-.08-.38"
                />
              </svg>
            </div>
          </div>

          <div className="flex  p-4 gap-5 justify-center  mt-6 w-full border-t border-t-emerald-500 pt-4 z-[99]">
            <div className="flex gap-2 whitespace-nowrap">
              <div className="grow text-3xl font-bold text-white">
                {candidateList.length}
              </div>
              <div className="ml-6 flex items-end text-sm text-slate-300">
                Kandidat Terpilih
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
