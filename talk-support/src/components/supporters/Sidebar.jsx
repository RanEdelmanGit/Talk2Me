import React, { useState, useEffect } from "react";

const Sidebar = ({ onFilter }) => {
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
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full md:w-64 bg-gray-100 p-4 shadow-md h-full rounded-md">
      <button
        onClick={toggleDropdown}
        className="md:hidden flex items-center justify-between w-full p-2 bg-blue-500 text-white rounded mb-4"
      >
        סינון
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      <div className={`md:block ${isOpen ? "block" : "hidden"}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">סינון</h2>
          <button
            onClick={handleClearFilters}
            className="border border-gray-300 hover:bg-gray-400 px-3 py-1 rounded-md"
          >
            נקה בחירה
          </button>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">שם</label>
          <input
            name="name"
            value={filters.name}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="mb-4">
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
        <div className="mb-4">
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
        <div className="mb-4">
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
        <div className="mb-4">
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
        <div className="mb-4">
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
        <div className="mb-4">
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
