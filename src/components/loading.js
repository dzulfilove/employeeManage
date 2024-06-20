import React from "react";
import "../styles/loading.css";
function Loading() {
  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="center-body flex justify-center items-center  flex-col gap-10">
        <div className="loader"></div>
        <p className="text-lg text-teal-300">Tunggu Sebentar Yaa...</p>
      </div>
    </div>
  );
}

export default Loading;
