import React, { useState, useEffect } from "react";
import heartSolid from "./heart-solid.svg";
import HeartRegular from "./heart-regular.svg";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { cities } from "../../cities";

const Sidebar = ({
  onFilter,
  onToggleFavorites,
  showFavorites,
  onClearFilters,
}) => {
  const [filters, setFilters] = useState({
    name: "",
    meeting: "not-selected",
    gender: "not-selected",
    age: "not-selected",
    area: "not-selected",
    city: null,
    preferredLanguage: "not-selected",
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onFilter(filters);
  }, [filters]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleClearFilters = () => {
    const initialFilters = {
      name: "",
      meeting: "not-selected",
      gender: "not-selected",
      age: "not-selected",
      area: "not-selected",
      city: null,
      preferredLanguage: "not-selected",
    };
    setFilters(initialFilters);
    onClearFilters(); // Reset show favorites
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const areFiltersActive = () => {
    return Object.values(filters).some(
      (value) => value !== "" && value !== "not-selected" && value !== null
    );
  };

  return (
    <div className="w-full md:w-72 bg-gray-200 px-4 md:py-4 shadow-md md:min-h-svh  max-md:fixed max-md:top-16 rounded-md md:pr-6 z-10">
      <div className="flex justify-between items-center md:hidden p-4 ">
        <button
          onClick={toggleDropdown}
          className="md:hidden flex items-center justify-between text-black rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`size-8 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            ) : (
              <path
              strokeLinecap="round"
              strokeLinejoin="round"
                d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
              />
            )}
          </svg>
        </button>

        {areFiltersActive() && (
          <button
            onClick={handleClearFilters}
            className="border border-gray-300 hover:ring-2 hover:ring-indigo-600 px-3 py-1 rounded-md md:my-2.5"
          >
            נקה בחירה
          </button>
        )}

        <button onClick={onToggleFavorites} className="flex items-center">
          <img
            src={showFavorites ? heartSolid : HeartRegular}
            alt="Favorites"
            className="h-6 w-6 mr-2"
          />
        </button>
      </div>
      <div
        className={`md:block ${
          isOpen
            ? "block  pb-6 md:pt-4 px-4 md:px-2  min-h-screen"
            : "hidden"
        }`}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-6 border-gray-400 max-md:hidden">
          <h2 className="text-2xl font-bold ">סינון</h2>
          {areFiltersActive() && (
            <button
              onClick={handleClearFilters}
              className=" flex gap-2 border border-gray-400 hover:ring-2 hover:ring-indigo-600 px-3 py-1 rounded-md my-2.5"
            >
              נקה בחירה
            </button>
          )}
        </div>

        <div className="flex justify-end max-md:hidden">
          <button onClick={onToggleFavorites} className="flex items-center">
            <span>הצג מועדפים</span>
            <img
              src={showFavorites ? heartSolid : HeartRegular}
              alt="Favorites"
              className="h-6 w-6 mr-2"
            />
          </button>
        </div>

          <div className="">
        <div className="mb-2">
          <label className="block font-medium mb-2">שם</label>
          <input
            name="name"
            value={filters.name}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>

        <div className="mb-2">
          <label className="block font-medium mb-2">אופן פגישה</label>
          <select
            name="meeting"
            value={filters.meeting}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="not-selected">בחר אופן מפגש</option>
            <option value="offline">מפגש פנים אל פנים</option>
            <option value="online">מרחוק</option>
            <option value="both">שניהם</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-2">מגדר</label>
          <select
            name="gender"
            value={filters.gender}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="not-selected">בחר</option>
            <option value="man">גבר</option>
            <option value="woman">אישה</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-2">גיל</label>
          <select
            name="age"
            value={filters.age}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="not-selected">בחר</option>
            <option value="18-22">18-22</option>
            <option value="23-27">23-27</option>
            <option value="28-32">28-32</option>
            <option value="33-37">33-37</option>
            <option value="38-42">38-42</option>
            <option value="43-47">43-47</option>
            <option value="48-52">48-52</option>
            <option value="53-57">53-57</option>
            <option value="58-62">58-62</option>
            <option value="65+">65+</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-2">איזור</label>
          <select
            name="area"
            value={filters.area}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="not-selected">בחר</option>
            <option value="צפון">צפון</option>
            <option value="מרכז">מרכז</option>
            <option value="דרום">דרום</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="block font-medium mb-2">עיר</label>
          <Autocomplete
            id="city"
            options={cities}
            getOptionLabel={(option) => option}
            value={filters.city}
            onChange={(event, newValue) => {
              setFilters((prevFilters) => ({
                ...prevFilters,
                city: newValue || null,
              }));
            }}
            isOptionEqualToValue={(option, value) =>
              option === value || value === null
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                required
                sx={{
                  "& .MuiInputBase-root": {
                    width: "100%",
                    borderRadius: "0.375rem",
                    border: "0",
                    paddingY: "0.001rem", // Adjust paddingY to make the input height smaller
                    color: "#1f2937",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    backgroundColor: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#ffffff",
                      boxShadow: "0 0 0 2px rgba(67, 56, 202, 0.3)",
                      outline: "none", // Remove the default focus ring
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderWidth: "1px",
                    borderColor: "#d1d5db",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d1d5db", // Keep the border color the same on hover
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d1d5db", // Keep the border color the same when focused
                    borderWidth: "1px",
                  },
                  "& .MuiInputBase-input": {
                    outline: "none", // Ensure no outline on the input element itself
                  },
                  fontSize: "0.875rem",
                  lineHeight: "1.25rem", // Adjust lineHeight to make the input height smaller
                }}
              />
            )}
          />
        </div>

        <div className="mb-2">
          <label className="block font-medium mb-2">שפה</label>
          <select
            name="preferredLanguage"
            value={filters.preferredLanguage}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="not-selected">בחר</option>
            <option value="hebrew">עברית</option>
            <option value="english">אנגלית</option>
          </select>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
