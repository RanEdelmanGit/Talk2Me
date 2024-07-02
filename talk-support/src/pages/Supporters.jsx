import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SupporterList from "../components/supporters/SupporterList";
import Sidebar from "../components/supporters/Sidebar";
import { fetchSupporters } from "../redux/features/supportersSlice";
import Favorites from "../components/supporters/Favorites";
import {
  displayFavorites,
  displayAll,
} from "../redux/features/supportersSlice";

const SupportersPage = ({ userType }) => {
  const dispatch = useDispatch();
  const supporters = useSelector((state) => state.supporters.supporters);
  const status = useSelector((state) => state.supporters.status);
  const error = useSelector((state) => state.supporters.error);
  const showFavorites = useSelector((state) => state.supporters.showFavorites);
  const user = useSelector((state) => state.auth.user);

  const [filteredSupporters, setFilteredSupporters] = useState([]);

  useEffect(() => {
    dispatch(fetchSupporters());
  }, [dispatch]);

  useEffect(() => {
    setFilteredSupporters(supporters);
  }, [supporters]);

  const handleFilter = (filters) => {
    let filtered;
    if (showFavorites) {
      // user.favorites
      // filter = supporters.filter( supp => favorites.includes(supp.id))
      filtered = [];
      return filtered;
    } else {
      filtered = supporters.filter((supporter) => {
        return (
          (!filters.name ||
            supporter.name
              .toLowerCase()
              .includes(filters.name.toLowerCase())) &&
          (!filters.meeting ||
            supporter.meeting
              .toLowerCase()
              .includes(filters.meeting.toLowerCase())) &&
          (!filters.gender ||
            supporter.gender
              .toLowerCase()
              .includes(filters.gender.toLowerCase())) &&
          (!filters.age || +supporter.age >= filters.age) &&
          (!filters.location ||
            supporter.location
              .toLowerCase()
              .includes(filters.location.toLowerCase())) &&
          (!filters.religious ||
            supporter.religious
              .toLowerCase()
              .includes(filters.religious.toLowerCase())) &&
          (!filters.preferredLanguage ||
            supporter.preferredLanguage
              .toLowerCase()
              .includes(filters.preferredLanguage.toLowerCase()))
        );
      });
    }

    setFilteredSupporters(filtered);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row mt-16" dir="rtl">
      <div className="order-1 w-full md:w-64 md:fixed md:right-5">
        <Sidebar onFilter={handleFilter} />
      </div>
      <div className=" order-2 w-full md:mr-72 flex-1 flex flex-col items-center">
        <div className="w-full">
          <SupporterList supporters={filteredSupporters} />
        </div>
      </div>
    </div>
  );
};

export default SupportersPage;
