// DropZone.js

import React from "react";
import { useDrop } from "react-dnd";

const MainCard = ({ onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "item",
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className="bg-transparent border hover:bg-slate-700 border-slate-400 text-sm rounded-lg flex w-full gap-6 p-2 h-[5rem] mt-6 justify-center items-center text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="0.84em"
        height="1em"
        viewBox="0 0 20 24"
      >
        <path
          fill="white"
          d="M18.845 17.295a7.436 7.436 0 0 0-4.089-2.754l-.051-.011l-1.179 1.99a1.003 1.003 0 0 1-1 1c-.55 0-1-.45-1.525-1.774v-.032a1.25 1.25 0 1 0-2.5 0v.033v-.002c-.56 1.325-1.014 1.774-1.563 1.774a1.003 1.003 0 0 1-1-1l-1.142-1.994A7.47 7.47 0 0 0 .67 17.271l-.014.019a4.475 4.475 0 0 0-.655 2.197v.007c.005.15 0 .325 0 .5v2a2 2 0 0 0 2 2h15.5a2 2 0 0 0 2-2v-2c0-.174-.005-.35 0-.5a4.522 4.522 0 0 0-.666-2.221l.011.02zM4.5 5.29c0 2.92 1.82 7.21 5.25 7.21c3.37 0 5.25-4.29 5.25-7.21v-.065a5.25 5.25 0 1 0-10.5 0v.068z"
        />
      </svg>
      Drop here
    </div>
  );
};

export default MainCard;
