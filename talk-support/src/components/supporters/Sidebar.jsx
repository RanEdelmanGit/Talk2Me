import React, { useState, useEffect } from "react";
import heartSolid from "./heart-solid.svg";
import HeartRegular from "./heart-regular.svg";

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
    city: "not-selected",
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
      city: "not-selected",
      preferredLanguage: "not-selected",
    };
    setFilters(initialFilters);
    onClearFilters(); // Reset show favorites
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const areFiltersActive = () => {
    return Object.values(filters).some(value => value !== "" && value !== "not-selected");
  };

  return (
    <div className="w-full md:w-72 bg-gray-100 p-4 shadow-md md:min-h-svh rounded-md md:pr-6">
      <div className="flex justify-between items-center md:hidden">
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
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            )}
          </svg>
        </button>

        {areFiltersActive() && (
          <button
            onClick={handleClearFilters}
            className="border border-gray-300 hover:ring-2 hover:ring-indigo-600 px-3 py-1 rounded-md my-2.5"
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
          isOpen ? "block space-y-6 pt-6 min-h-screen" : "hidden"
        }`}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-6 border-gray-400 max-md:hidden">
          <h2 className="text-xl font-bold ">סינון</h2>
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
            <option value="north">צפון</option>
            <option value="center">מרכז</option>
            <option value="south">דרום</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-2">עיר</label>
          <select
            name="city"
            value={filters.city}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="not-selected">בחר</option>
            <option value="Eilat">אילת</option>
            <option value="Ashdod">אשדוד</option>
            <option value="Ashkelon">אשקלון</option>
            <option value="Beer Sheva">באר שבע</option>
            <option value="Givatayim">גבעתיים</option>
            <option value="Dimona">דימונה</option>
            <option value="Herzliya">הרצליה</option>
            <option value="Haifa">חיפה</option>
            <option value="Tiberias">טבריה</option>
            <option value="Yeruham">ירוחם</option>
            <option value="Kfar Saba">כפר סבא</option>
            <option value="Kiryat Gat">קרית גת</option>
            <option value="Kiryat Shmona">קרית שמונה</option>
            <option value="Nahariya">נהריה</option>
            <option value="Nazareth">נצרת</option>
            <option value="Netanya">נתניה</option>
            <option value="Akko">עכו</option>
            <option value="Afula">עפולה</option>
            <option value="Petah Tikva">פתח תקווה</option>
            <option value="Ramat Gan">רמת גן</option>
            <option value="Tel Aviv-Jaffa">תל אביב-יפו</option>
          </select>
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
  );
};

export default Sidebar;
