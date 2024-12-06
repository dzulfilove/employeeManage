// DropdownSearch.js

import React, { useEffect, useState } from "react";

const DropdownSearch = ({ options, change, value, name }) => {
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
    console.log(value, "nilai");
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

  console.log(selectedOption, "option haha");
  return (
    <div className="relative w-full">
      <div
        className=" text-white rounded p-2 font-normal cursor-pointer text-sm"
        onClick={() => setShowOptions(!showOptions)}
      >
        {selectedOption ? selectedOption.text : `Pilih ${name}..`}
      </div>
      {showOptions && (
        <div className="absolute w-full glass-effect border border-gray-300 rounded mt-1 z-[99999] p-2">
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
                  className="p-2 hover:bg-slate-100 cursor-pointer text-slate-100 text-sm font-medium hover:text-slate-900"
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

export default DropdownSearch;
