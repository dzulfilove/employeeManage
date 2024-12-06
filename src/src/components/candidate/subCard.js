import React from "react";
import { useDrag } from "react-dnd";
import "../../styles/card.css";
const SubCard = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "item",
    item: name,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="flex box w-full text-sm  font-normal container justify-center cursor-pointer items-center p-2 border border-slate-400 bg-slate-600 text-white rounded-lg"
    >
      {name.nama}
    </div>
  );
};

export default SubCard;
