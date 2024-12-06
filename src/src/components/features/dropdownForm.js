// DropdownSearch.js

import React, { useEffect, useState } from "react";

const DropdownForm = ({ options, change, name, value }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSet, setIsSet] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    typeof value === "object" ? value : null
  );

  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (typeof value === "object" && value !== null) {
      setSelectedOption(value);
      setIsSet(true);
    }
  }, [selectedOption]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    change(option);
    setShowOptions(false);
  };

  const filteredOptions = options.filter((option) =>
    option.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <div
        className="  rounded p-2 font-normal cursor-pointer"
        onClick={() => setShowOptions(!showOptions)}
      >
        {selectedOption ? selectedOption.text : `Pilih ${name}..`}
      </div>
      {showOptions && (
        <div className="absolute w-full glass-effect-form border border-gray-300 rounded z-[99999] p-2">
          <input
            type="text"
            className="w-full p-2 border bg-slate-200 border-slate-500 mb-4 rounded-lg text-slate-900 "
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={index}
                  className="p-2 text-black text-base hover:bg-slate-100 cursor-pointer "
                  onClick={() => handleOptionClick(option)}
                >
                  {option.text}
                </li>
              ))
            ) : (
              <li className="p-2 text-slate-200">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownForm;
