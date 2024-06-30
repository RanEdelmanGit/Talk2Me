import React, { useState } from 'react';

const Sidebar = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    name: '',
    meeting: '',
    gender: '',
    age: 18,
    location: '',
    religious: '',
    preferredLanguage: ''
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if(name == 'age')
      value = +value;
    console.log(value);
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [name]: value };
      onFilter(newFilters);
      return newFilters;
    });
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full md:w-64 bg-gray-100 p-4 shadow-md h-full rounded-md" dir=''>
      <button 
        onClick={toggleDropdown} 
        className="md:hidden flex items-center justify-between w-full p-2 bg-blue-500 text-white rounded mb-4"
      >
        סינון
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div className={`md:block ${isOpen ? 'block' : 'hidden'}`}>
        <h2 className={`text-xl font-bold mb-4 ${isOpen ? 'hidden' : ''}`}>סינון</h2>
        <div className="mb-4">
          <label className="block font-medium mb-2">שם</label>
          <input name="name" value={filters.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">אופן פגישה</label>
          <select name="meeting" value={filters.meeting} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded">
            <option value="">פיזי/וירטואלי</option>
            <option value="online">וירטואלי</option>
            <option value="offline">פיזי</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">מגדר</label>
          <select name="gender" value={filters.gender} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded">
            <option value="">נשים/גברים</option>
            <option value="man">Man</option>
            <option value="woman">Woman</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">גיל</label>
          <input name="age" min={18} value={filters.age} onChange={handleChange} type="number" className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">איזור</label>
          <select name="location" value={filters.location} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded">
            <option value="">כל מקום</option>
            <option value="צפון">צפון</option>
            <option value="מרכז">מרכז</option>
            <option value="דרום">דרום</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">דת</label>
          <select name="religious" value={filters.religious} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded">
            <option value="">לא משנה</option>
            <option value="yes">דתי/ה</option>
            <option value="no">לא דתי/ה</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">שפה</label>
          <select name="preferredLanguage" value={filters.preferredLanguage} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded">
            <option value="hebrew">עברית</option>
            <option value="english">English</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
