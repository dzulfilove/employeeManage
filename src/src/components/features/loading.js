import React from "react";
import "../../styles/loading.css";
function LoadingData() {
  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="center-body flex justify-center items-center  flex-col gap-10">
        <div
          aria-label="Orange and tan hamster running in a metal wheel"
          role="img"
          class="wheel-and-hamster"
        >
          <div class="wheel"></div>
          <div class="hamster">
            <div class="hamster__body">
              <div class="hamster__head">
                <div class="hamster__ear"></div>
                <div class="hamster__eye"></div>
                <div class="hamster__nose"></div>
              </div>
              <div class="hamster__limb hamster__limb--fr"></div>
              <div class="hamster__limb hamster__limb--fl"></div>
              <div class="hamster__limb hamster__limb--br"></div>
              <div class="hamster__limb hamster__limb--bl"></div>
              <div class="hamster__tail"></div>
            </div>
          </div>
          <div class="spoke"></div>
        </div>
        <p className="text-base text-slate-100">Tunggu Sebentar Yaa...</p>
      </div>
    </div>
  );
}

export default LoadingData;
