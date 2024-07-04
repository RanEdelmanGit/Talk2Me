import React, { useState } from 'react';

const Search = ({ onFilter }) => {
  const [searchCriteria, setSearchCriteria] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCriteriaChange = (e) => {
    setSearchCriteria(e.target.value);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilter(searchCriteria, value);
  };

  return (
    <div className="flex items-center mb-4 w-full justify-end">
      <select
        value={searchCriteria}
        onChange={handleCriteriaChange}
        className="border border-gray-400 rounded-md p-2 mr-2"
      >
        <option value="name">Name</option>
        <option value="meeting">Meeting</option>
        <option value="gender">Gender</option>
        <option value="age">Age</option>
        <option value="location">Location</option>
        <option value="religious">Religious</option>
        <option value="preferredLanguage">Preferred Language</option>
      </select>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
        className="border border-gray-400 rounded-md p-2"
      />
    </div>
  );
};

export default Search;
