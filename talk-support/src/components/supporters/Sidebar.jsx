import React, { useState, useEffect } from "react";
import HeartSolidIcon from "../../assets/svgs/HeartSolidIcon";
import HeartRegularIcon from "../../assets/svgs/HeartRegularIcon";
import FilterIcon from "../../assets/svgs/FilterIcon";
import CityAutocomplete from "../common/CityAutocomplete"; // Adjust the path as necessary
import { texts } from "../../constants/texts";
import {
  filterMeetingOptions,
  genderOptions,
  ageOptions,
  areaOptions,
  preferredLanguageOptions,
} from "../../constants/selectOptions"; // Update the path as necessary

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
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [name]: value };
      return newFilters;
    });
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
    <div className="w-full lg:w-72 bg-gray-200 px-4 py-4 shadow-md rounded-md lg:min-h-screen" dir="rtl">
    <div className="flex justify-between items-center lg:hidden p-4">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between text-black rounded"
      >
        <FilterIcon isOpen={isOpen} />
      </button>

      {areFiltersActive() && (
        <button
          onClick={handleClearFilters}
          className="flex gap-2 border border-gray-700 hover:bg-indigo-300 font-semibold px-3 py-1 rounded-md"
        >
          {texts.SupportersSidebar.clearSelection}
        </button>
      )}

      <button onClick={onToggleFavorites} className="flex items-center">
        {showFavorites ? <HeartSolidIcon /> : <HeartRegularIcon />}
      </button>
    </div>
    <div className={`lg:block ${isOpen ? "block pb-6 px-4 lg:px-0" : "hidden"}`}>
      <div className="flex justify-between items-center mb-4 border-b pb-6 border-gray-400 max-lg:hidden">
        <h2 className="text-2xl font-bold">
          {texts.SupportersSidebar.filterTitle}
        </h2>

        {areFiltersActive() && (
          <button
            onClick={handleClearFilters}
            className="flex gap-2 border-2 border-gray-700 hover:bg-indigo-300 font-semibold px-3 py-1 rounded-md"
          >
            {texts.SupportersSidebar.clearSelection}
          </button>
        )}
      </div>

      <div className="flex justify-start pb-6 max-lg:hidden">
        <button
          onClick={onToggleFavorites}
          className="flex items-center gap-2"
        >
          <span>{texts.SupportersSidebar.showFavorites}</span>
          {showFavorites ? <HeartSolidIcon /> : <HeartRegularIcon />}
        </button>
      </div>

      <div className="space-y-6">
        <div className="mb-2">
          <input
            name="name"
            value={filters.name}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder={texts.SupportersSidebar.searchPlaceholder}
          />
        </div>

        <select
          name="meeting"
          value={filters.meeting}
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          {filterMeetingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="mb-2">
          <select
            name="gender"
            value={filters.gender}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <select
            name="age"
            value={filters.age}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            {ageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <select
            name="area"
            value={filters.area}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            {areaOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <CityAutocomplete
            value={filters.city}
            onChange={(newValue) => {
              setFilters((prevFilters) => ({
                ...prevFilters,
                city: newValue || null,
              }));
            }}
          />
        </div>

        <div className="mb-2">
          <select
            name="preferredLanguage"
            value={filters.preferredLanguage}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="not-selected">
              {texts.SupportersSidebar.selectLanguage}
            </option>
            {preferredLanguageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="self-center flex items-center justify-center my-5 lg:hidden">
          <button
            onClick={toggleDropdown}
            className="btn w-full flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            סנן
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Sidebar;
