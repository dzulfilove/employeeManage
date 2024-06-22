import React from "react";
import "../../styles/card.css";
function CardDetailEmployee() {
  return (
    <div className="flex w-full  justify-center items-center">
      <div className="w-[80%] flex justify-start items-center p-6 gap-12  rounded-lg relative playing border-2 border-slate-600 overflow-hidden">
        <div className="w-full flex justify-start items-center left-0 m-0 p-0  bg-white rounded-lg absolute opacity-5 h-full"></div>

        <div className="flex flex-col justify-center items-center p-4 w-[40%] gap-8 text-white">
          <div className="card-profile">
            <div className="content-profile">
              <div className="back">
                <div className="back-content">
                  <div className="flex justify-center items-center rounded-full bg-teal-500 w-[15rem] h-[15rem] z-[99]">
                    <img
                      className="object-cover h-full w-full rounded-full"
                      src="https://www.whiteboardjournal.com/wp-content/uploads/2022/01/unnamed-9-2-456x499.jpg"
                    />
                  </div>
                  <div className="flex w-full justify-center items-center flex-col gap-2 z-[99]">
                    <h2 className="text-white font-bold text-xl">
                      Mamank Garox
                    </h2>
                    <h4 className="text-white font-normal text-base">
                      Mamank Garox
                    </h4>
                  </div>
                  <div className="flex w-full justify-center items-center flex-col gap-2 z-[99]">
                    <div className="flex w-full justify-center items-center gap-2">
                      <h2 className="text-white font-bold text-base">
                        Mamank Garox :
                      </h2>

                      <h4 className="text-white font-normal text-base">
                        Mamank Garox
                      </h4>
                    </div>
                    <div className=" flex w-full justify-center items-center gap-2">
                      <h2 className="text-white font-bold text-base">
                        Mamank Garox :
                      </h2>

                      <h4 className="text-white font-normal text-base">
                        Mamank Garox
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center p-4 w-[60%] gap-2 text-white">
          <div className="w-full gap-2 flex flex-col justify-start items-start p-2">
            <h4 className="font-semibold text-base">Nama</h4>
            <div className="w-full flex p-2 bg-slate-700 border-slate-500 border rounded-lg justify-start items-center h-[3rem]"></div>
          </div>
          <div className="w-full gap-2 flex flex-col justify-start items-start p-2">
            <h4 className="font-semibold text-base">Nama</h4>
            <div className="w-full flex p-2 bg-slate-700 border-slate-500 border rounded-lg justify-start items-center h-[3rem]"></div>
          </div>
          <div className="w-full gap-2 flex flex-col justify-start items-start p-2">
            <h4 className="font-semibold text-base">Nama</h4>
            <div className="w-full flex p-2 bg-slate-700 border-slate-500 border rounded-lg justify-start items-center h-[3rem]"></div>
          </div>
          <div className="w-full gap-2 flex flex-col justify-start items-start p-2">
            <h4 className="font-semibold text-base">Nama</h4>
            <div className="w-full flex p-2 bg-slate-700 border-slate-500 border rounded-lg justify-start items-center h-[3rem]"></div>
          </div>
          <div className="w-full gap-2 flex flex-col justify-start items-start p-2">
            <h4 className="font-semibold text-base">Nama</h4>
            <div className="w-full flex p-2 bg-slate-700 border-slate-500 border rounded-lg justify-start items-center h-[3rem]"></div>
          </div>
          <div className="w-full gap-2 flex flex-col justify-start items-start p-2">
            <h4 className="font-semibold text-base">Nama</h4>
            <div className="w-full flex p-2 bg-slate-700 border-slate-500 border rounded-lg justify-start items-center h-[8rem]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetailEmployee;
