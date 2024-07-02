import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SupporterList from "../components/supporters/SupporterList";
import Sidebar from "../components/supporters/Sidebar";
import { fetchSupporters } from "../redux/features/supportersSlice";
import { displayFavorites, displayAll } from "../redux/features/supportersSlice";

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
    const allFiltersSelected = Object.values(filters).every(
      (value) => value === "not-selected" || value === ""
    );

    if (allFiltersSelected) {
      setFilteredSupporters(supporters);
      return;
    }

    const ageRanges = {
      "18-22": [18, 22],
      "23-27": [23, 27],
      "28-32": [28, 32],
      "33-37": [33, 37],
      "38-42": [38, 42],
      "43-47": [43, 47],
      "48-52": [48, 52],
      "53-57": [53, 57],
      "58-62": [58, 62],
      "65+": [65, Infinity],
    };

    if (showFavorites) {
      filtered = supporters.filter((supporter) =>
        user.favorites.includes(supporter.id)
      );
    } else {
      filtered = supporters.filter((supporter) => {
        const ageRange = ageRanges[filters.age];
        const [minAge, maxAge] = ageRange || [0, Infinity];
        return (
          (!filters.name ||
            `${supporter.firstName} ${supporter.lastName}`
              .toLowerCase()
              .includes(filters.name.toLowerCase())) &&
          (filters.meeting === "not-selected" ||
            supporter.meeting === filters.meeting) &&
          (filters.gender === "not-selected" ||
            supporter.gender === filters.gender) &&
          (filters.age === "not-selected" ||
            (supporter.age >= minAge && supporter.age <= maxAge)) &&
          (filters.area === "not-selected" || supporter.area === filters.area) &&
          (filters.city === "not-selected" || supporter.city === filters.city) &&
          (filters.preferredLanguage === "not-selected" ||
            supporter.preferredLanguage === filters.preferredLanguage)
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
      <div className="order-2 w-full md:mr-72 flex-1 flex flex-col items-center">
        <div className="w-full">
          <SupporterList supporters={filteredSupporters} />
        </div>
      </div>
    </div>
  );
};

export default SupportersPage;
