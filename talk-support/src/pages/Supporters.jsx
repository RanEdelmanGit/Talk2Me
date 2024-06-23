import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SupporterList from "../components/supporters/SupporterList";
import Sidebar from "../components/supporters/Sidebar";
import { fetchSupporters } from '../redux/features/supportersSlice';

const SupportersPage = () => {
  const dispatch = useDispatch();
  const supporters = useSelector((state) => state.supporters.supporters);
  const status = useSelector((state) => state.supporters.status);
  const error = useSelector((state) => state.supporters.error);

  const [filteredSupporters, setFilteredSupporters] = useState([]);

  useEffect(() => {
    dispatch(fetchSupporters());
  }, [dispatch]);

  useEffect(() => {
    setFilteredSupporters(supporters);
  }, [supporters]);

  const handleFilter = (filters) => {
    const filtered = supporters.filter((supporter) => {
      return (
        (!filters.name || supporter.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.meeting || supporter.meeting.toLowerCase().includes(filters.meeting.toLowerCase())) &&
        (!filters.gender || supporter.gender.toLowerCase().includes(filters.gender.toLowerCase())) &&
        (!filters.age || supporter.age.toString().includes(filters.age)) &&
        (!filters.location || supporter.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.religious || supporter.religious.toLowerCase().includes(filters.religious.toLowerCase())) &&
        (!filters.preferredLanguage || supporter.preferredLanguage.toLowerCase().includes(filters.preferredLanguage.toLowerCase()))
      );
    });
    setFilteredSupporters(filtered);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen max-md:flex-col flex pt-4" dir="rtl">
      <div> <Link to="/chat">
        <p className="text-blue-500">chat</p>
      </Link>
      </div>
  
      <Sidebar onFilter={handleFilter} />
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full">
          <SupporterList supporters={filteredSupporters} />
        </div>
      </div>
    </div>
  );
};

export default SupportersPage;
