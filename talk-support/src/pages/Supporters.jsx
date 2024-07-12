import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SupporterList from "../components/supporters/SupporterList";
import Sidebar from "../components/supporters/Sidebar";
import { fetchSupporters, displayFavorites, displayAll } from "../redux/features/supportersSlice";
import Header from "../components/layout/Header";
import Loading from "../components/common/Loading";

const SupportersPage = () => {
  const dispatch = useDispatch();
  const supporters = useSelector((state) => state.supporters.supporters);
  const status = useSelector((state) => state.supporters.status);
  const error = useSelector((state) => state.supporters.error);
  const showFavorites = useSelector((state) => state.supporters.showFavorites);
  const [filteredSupporters, setFilteredSupporters] = useState([]);
  const { userType, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchSupporters());
  }, [dispatch]);

  useEffect(() => {
    applyFilters(filters);
  }, [supporters, showFavorites]);

  const [filters, setFilters] = useState({
    name: "",
    meeting: "not-selected",
    gender: "not-selected",
    age: "not-selected",
    area: "not-selected",
    city: "not-selected",
    preferredLanguage: "not-selected",
  });

  const applyFilters = (filters) => {
    let filtered;
    const allFiltersSelected = Object.values(filters).every(
      (value) => value === "not-selected" || value === ""
    );

    if (allFiltersSelected) {
      filtered = showFavorites
        ? supporters.filter((supporter) => user.favorites.includes(supporter.id))
        : supporters;
      setFilteredSupporters(filtered);
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

    filtered = supporters.filter((supporter) => {
      const ageRange = ageRanges[filters.age];
      const [minAge, maxAge] = ageRange || [0, Infinity];
      const isFavorite = showFavorites ? user.favorites.includes(supporter.id) : true;
      return (
        (!filters.name ||
          `${supporter.firstName} ${supporter.lastName}`
            .toLowerCase()
            .includes(filters.name.toLowerCase())) &&
        (filters.meeting === "not-selected" || supporter.meeting === filters.meeting) &&
        (filters.gender === "not-selected" || supporter.gender === filters.gender) &&
        (filters.age === "not-selected" || (supporter.age >= minAge && supporter.age <= maxAge)) &&
        (filters.area === "not-selected" || supporter.area === filters.area) &&
        (!filters.city || supporter.city === filters.city) &&
        (filters.preferredLanguage === "not-selected" || supporter.preferredLanguage === filters.preferredLanguage) &&
        isFavorite
      );
    });

    setFilteredSupporters(filtered);
  };

  const handleFilter = (filters) => {
    setFilters(filters);
    applyFilters(filters);
  };

  const handleToggleFavorites = () => {
    if (showFavorites) {
      dispatch(displayAll());
    } else {
      dispatch(displayFavorites());
    }
  };

  const handleClearFilters = () => {
    dispatch(displayAll());
  };

  if (status === "loading") {
    return <div className="flex w-full min-h-screen justify-center items-center"> <Loading show={true} /></div>;
  }

  if (status === "failed") {
    return <div>Error:{error}</div>;
  }

  console.log(filteredSupporters);
  return (
    <>
      {user.uid && <Header/>}
      <div className="min-h-screen flex flex-col md:flex-row mt-16" dir="rtl">
        {userType === "client" && (
          <>
            <div className="order-1 w-full md:w-72 md:fixed">
              <Sidebar
                onFilter={handleFilter}
                onToggleFavorites={handleToggleFavorites}
                showFavorites={showFavorites}
                onClearFilters={handleClearFilters}
              />
            </div>
            <div className="order-2 w-full md:mr-72 flex-1 flex flex-col items-center max-md:fixed top-32">
              <div className="w-full">
                <SupporterList supporters={filteredSupporters} />
              </div>
            </div>
          </>
        )}
        {userType === "supporter" && (
          <div className="flex flex-col items-center justify-center w-full">
            {/* Your content for supporters */}
            <p>Welcome, Supporter! Here is your specific content.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default SupportersPage;
