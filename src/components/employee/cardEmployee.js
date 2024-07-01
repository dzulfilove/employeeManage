import React from "react";
import { GoArrowUpRight } from "react-icons/go";
import "../../styles/card.css";
export default function CardEmployee(props) {
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

          <div className="flex justify-start gap-6 items-start w-full p-4 z-[99] ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
            >
              <path
                fill="#3B82F6"
                fill-rule="evenodd"
                d="M11.948 1.25h.104c.899 0 1.648 0 2.242.08c.628.084 1.195.27 1.65.725c.456.456.642 1.023.726 1.65c.06.44.075.964.079 1.57c.648.021 1.226.06 1.74.128c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433v.112c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.944c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-.112c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238a17.54 17.54 0 0 1 1.74-.128c.004-.606.02-1.13.079-1.57c.084-.627.27-1.194.725-1.65c.456-.455 1.023-.64 1.65-.725c.595-.08 1.345-.08 2.243-.08M8.752 5.252c.378-.002.775-.002 1.192-.002h4.112c.417 0 .814 0 1.192.002c-.004-.57-.018-1-.064-1.347c-.063-.461-.17-.659-.3-.789c-.13-.13-.328-.237-.79-.3c-.482-.064-1.13-.066-2.094-.066s-1.612.002-2.095.067c-.461.062-.659.169-.789.3c-.13.13-.237.327-.3.788c-.046.346-.06.776-.064 1.347M5.71 6.89c-1.006.135-1.586.389-2.01.812c-.422.423-.676 1.003-.811 2.009c-.138 1.027-.14 2.382-.14 4.289c0 1.907.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008c.423.423 1.003.677 2.009.812c1.028.138 2.382.14 4.289.14h4c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812c.423-.423.677-1.003.812-2.009c.138-1.027.14-2.382.14-4.289c0-1.907-.002-3.261-.14-4.29c-.135-1.005-.389-1.585-.812-2.008c-.423-.423-1.003-.677-2.009-.812c-1.027-.138-2.382-.14-4.289-.14h-4c-1.907 0-3.261.002-4.29.14M12 9.25a.75.75 0 0 1 .75.75v.01c1.089.274 2 1.133 2 2.323a.75.75 0 0 1-1.5 0c0-.384-.426-.916-1.25-.916c-.824 0-1.25.532-1.25.916s.426.917 1.25.917c1.385 0 2.75.96 2.75 2.417c0 1.19-.911 2.048-2 2.323V18a.75.75 0 0 1-1.5 0v-.01c-1.089-.274-2-1.133-2-2.323a.75.75 0 0 1 1.5 0c0 .384.426.916 1.25.916c.824 0 1.25-.532 1.25-.916s-.426-.917-1.25-.917c-1.385 0-2.75-.96-2.75-2.417c0-1.19.911-2.049 2-2.323V10a.75.75 0 0 1 .75-.75"
                clip-rule="evenodd"
              />
            </svg>
            <div className="flex justify-start flex-col ">
              <h5 className="text-white text-xl font-normal ">
                Total Karyawan
              </h5>{" "}
              <h5 className="text-slate-300 text-base font-normal mt-1">
                Total Karyawan Perusahaan
              </h5>
            </div>
          </div>

          <div className="flex gap-5 justify-between  mt-6 w-full border-t border-t-red-500 pt-4 p-4 z-[99]">
            <div className="flex gap-2 whitespace-nowrap">
              <div className="grow text-4xl font-bold text-white">
                {props.totalKaryawan}
              </div>
              <div className="ml-6 flex items-end text-base text-slate-300">
                Karyawan
              </div>
            </div>
          </div>
        </div>

        <div
          data-aos="fade-down"
          data-aos-delay="150"
          className="flex card flex-col relative justify-center items-start gap-1 w-[25rem] h-[15rem]  bg-transparent overflow-hidden border-l-8 border-l-blue-500 rounded-md shadow-lg "
        >
          <div className="content flex flex-col absolute justify-center items-start gap-1 w-[25rem] h-[15rem] opacity-75 bg-slate-800 overflow-hidden rounded-md shadow-lg "></div>
          <div className="w-[8rem] h-[8rem] opacity-35 rounded-full blur-2xl bg-blue-400 absolute right-[5%] top-[5%]"></div>

          <div className="flex justify-start gap-6 items-start w-full p-4 z-[99]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
            >
              <path
                fill="#3B82F6"
                fill-rule="evenodd"
                d="M11.948 1.25h.104c.899 0 1.648 0 2.242.08c.628.084 1.195.27 1.65.725c.456.456.642 1.023.726 1.65c.06.44.075.964.079 1.57c.648.021 1.226.06 1.74.128c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433v.112c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.944c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-.112c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238a17.54 17.54 0 0 1 1.74-.128c.004-.606.02-1.13.079-1.57c.084-.627.27-1.194.725-1.65c.456-.455 1.023-.64 1.65-.725c.595-.08 1.345-.08 2.243-.08M8.752 5.252c.378-.002.775-.002 1.192-.002h4.112c.417 0 .814 0 1.192.002c-.004-.57-.018-1-.064-1.347c-.063-.461-.17-.659-.3-.789c-.13-.13-.328-.237-.79-.3c-.482-.064-1.13-.066-2.094-.066s-1.612.002-2.095.067c-.461.062-.659.169-.789.3c-.13.13-.237.327-.3.788c-.046.346-.06.776-.064 1.347M5.71 6.89c-1.006.135-1.586.389-2.01.812c-.422.423-.676 1.003-.811 2.009c-.138 1.027-.14 2.382-.14 4.289c0 1.907.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008c.423.423 1.003.677 2.009.812c1.028.138 2.382.14 4.289.14h4c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812c.423-.423.677-1.003.812-2.009c.138-1.027.14-2.382.14-4.289c0-1.907-.002-3.261-.14-4.29c-.135-1.005-.389-1.585-.812-2.008c-.423-.423-1.003-.677-2.009-.812c-1.027-.138-2.382-.14-4.289-.14h-4c-1.907 0-3.261.002-4.29.14M12 9.25a.75.75 0 0 1 .75.75v.01c1.089.274 2 1.133 2 2.323a.75.75 0 0 1-1.5 0c0-.384-.426-.916-1.25-.916c-.824 0-1.25.532-1.25.916s.426.917 1.25.917c1.385 0 2.75.96 2.75 2.417c0 1.19-.911 2.048-2 2.323V18a.75.75 0 0 1-1.5 0v-.01c-1.089-.274-2-1.133-2-2.323a.75.75 0 0 1 1.5 0c0 .384.426.916 1.25.916c.824 0 1.25-.532 1.25-.916s-.426-.917-1.25-.917c-1.385 0-2.75-.96-2.75-2.417c0-1.19.911-2.049 2-2.323V10a.75.75 0 0 1 .75-.75"
                clip-rule="evenodd"
              />
            </svg>
            <div className="flex justify-start flex-col ">
              <h5 className="text-white text-xl font-normal ">Total Divisi</h5>{" "}
              <h5 className="text-slate-300 text-base font-normal mt-1">
                Total Divisi Karyawan
              </h5>
            </div>
          </div>

          <div className="flex gap-5 justify-between  mt-6 w-full border-t border-t-blue-500 pt-4 p-4 z-[99]">
            <div className="flex gap-2 whitespace-nowrap">
              <div className="grow text-4xl font-bold text-white">
                {props.totalDivisi}
              </div>
              <div className="ml-6 flex items-end text-base text-slate-300">
                Divisi
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

          <div className="flex justify-start gap-6 items-start w-full p-4 z-[99]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
            >
              <path
                fill="#3B82F6"
                fill-rule="evenodd"
                d="M11.948 1.25h.104c.899 0 1.648 0 2.242.08c.628.084 1.195.27 1.65.725c.456.456.642 1.023.726 1.65c.06.44.075.964.079 1.57c.648.021 1.226.06 1.74.128c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433v.112c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.944c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-.112c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238a17.54 17.54 0 0 1 1.74-.128c.004-.606.02-1.13.079-1.57c.084-.627.27-1.194.725-1.65c.456-.455 1.023-.64 1.65-.725c.595-.08 1.345-.08 2.243-.08M8.752 5.252c.378-.002.775-.002 1.192-.002h4.112c.417 0 .814 0 1.192.002c-.004-.57-.018-1-.064-1.347c-.063-.461-.17-.659-.3-.789c-.13-.13-.328-.237-.79-.3c-.482-.064-1.13-.066-2.094-.066s-1.612.002-2.095.067c-.461.062-.659.169-.789.3c-.13.13-.237.327-.3.788c-.046.346-.06.776-.064 1.347M5.71 6.89c-1.006.135-1.586.389-2.01.812c-.422.423-.676 1.003-.811 2.009c-.138 1.027-.14 2.382-.14 4.289c0 1.907.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008c.423.423 1.003.677 2.009.812c1.028.138 2.382.14 4.289.14h4c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812c.423-.423.677-1.003.812-2.009c.138-1.027.14-2.382.14-4.289c0-1.907-.002-3.261-.14-4.29c-.135-1.005-.389-1.585-.812-2.008c-.423-.423-1.003-.677-2.009-.812c-1.027-.138-2.382-.14-4.289-.14h-4c-1.907 0-3.261.002-4.29.14M12 9.25a.75.75 0 0 1 .75.75v.01c1.089.274 2 1.133 2 2.323a.75.75 0 0 1-1.5 0c0-.384-.426-.916-1.25-.916c-.824 0-1.25.532-1.25.916s.426.917 1.25.917c1.385 0 2.75.96 2.75 2.417c0 1.19-.911 2.048-2 2.323V18a.75.75 0 0 1-1.5 0v-.01c-1.089-.274-2-1.133-2-2.323a.75.75 0 0 1 1.5 0c0 .384.426.916 1.25.916c.824 0 1.25-.532 1.25-.916s-.426-.917-1.25-.917c-1.385 0-2.75-.96-2.75-2.417c0-1.19.911-2.049 2-2.323V10a.75.75 0 0 1 .75-.75"
                clip-rule="evenodd"
              />
            </svg>
            <div className="flex justify-start flex-col ">
              <h5 className="text-white text-xl font-normal ">
                Kontrak Akan Berakhir
              </h5>{" "}
              <h5 className="text-slate-300 text-base font-normal mt-1">
                Karyawan Kontrak Kurang Dari 3 Bulan
              </h5>
            </div>
          </div>

          <div className="flex gap-5 justify-between  mt-6 w-full border-t border-t-yellow-500 pt-4 p-4 z-[99]">
            <div className="flex gap-2 whitespace-nowrap">
              <div className="grow text-4xl font-bold text-white">
                {props.totalAkanBerakhir}
              </div>
              <div className="ml-6 flex items-end text-base text-slate-300">
                Karyawan
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

          <div className="flex p-4 justify-start gap-6 items-center w-full z-[99] ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 20 24"
            >
              <path
                fill="#10906B"
                d="M18.845 17.295a7.436 7.436 0 0 0-4.089-2.754l-.051-.011l-1.179 1.99a1.003 1.003 0 0 1-1 1c-.55 0-1-.45-1.525-1.774v-.032a1.25 1.25 0 1 0-2.5 0v.033v-.002c-.56 1.325-1.014 1.774-1.563 1.774a1.003 1.003 0 0 1-1-1l-1.142-1.994A7.47 7.47 0 0 0 .67 17.271l-.014.019a4.475 4.475 0 0 0-.655 2.197v.007c.005.15 0 .325 0 .5v2a2 2 0 0 0 2 2h15.5a2 2 0 0 0 2-2v-2c0-.174-.005-.35 0-.5a4.522 4.522 0 0 0-.666-2.221l.011.02zM4.5 5.29c0 2.92 1.82 7.21 5.25 7.21c3.37 0 5.25-4.29 5.25-7.21v-.065a5.25 5.25 0 1 0-10.5 0v.068z"
              />
            </svg>
            <div className="flex justify-start flex-col ">
              <h5 className="text-white text-xl font-normal ">Karyawan Baru</h5>{" "}
              <h5 className="text-slate-300 text-base font-normal mt-1">
                Total Karyawan Baru
              </h5>
            </div>
          </div>

          <div className="flex  p-4 gap-5 justify-between  mt-6 w-full border-t border-t-emerald-500 pt-4 z-[99]">
            <div className="flex gap-2 whitespace-nowrap">
              <div className="grow text-4xl font-bold text-white">
                {props.totalKaryawanBaru}
              </div>
              <div className="ml-6 flex items-end text-base text-slate-300">
                Kandidat Terpilih
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
