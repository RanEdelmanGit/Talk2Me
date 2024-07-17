import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SupporterList from "../components/supporters/SupporterList";
import Sidebar from "../components/supporters/Sidebar";
import { fetchSupporters } from "../redux/features/supportersSlice";
// import Loading from "../components/common/Loading";
import {
  displayFavorites,
  displayAll,
} from "../redux/features/supportersSlice";

const SupportersPage = () => {
  const dispatch = useDispatch();
  const showFavorites = useSelector((state) => state.supporters.showFavorites);
  const user = useSelector((state) => state.auth.user);
  const [filteredSupporters, setFilteredSupporters] = useState([]);
  const supporters = useSelector((state) => state.supporters.supporters);
  const status = useSelector((state) => state.supporters.status);
  const error = useSelector((state) => state.supporters.error);

  useEffect(() => {
    dispatch(fetchSupporters());
  }, []);

  const [filters, setFilters] = useState({
    name: "",
    meeting: "not-selected",
    gender: "not-selected",
    age: "not-selected",
    area: "not-selected",
    city: null,
    preferredLanguage: "not-selected",
  });

  useEffect(() => {
    applyFilters(filters);
  }, [supporters, showFavorites]);

  const applyFilters = (filters) => {
    let filtered;
    const allFiltersSelected = Object.values(filters).every(
      (value) => value === "not-selected" || value === ""
    );

    if (allFiltersSelected) {
      filtered = showFavorites
        ? supporters.filter((supporter) =>
            user.favorites.includes(supporter.id)
          )
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
      const isFavorite = showFavorites
        ? user.favorites.includes(supporter.id)
        : true;

      return (
        (!filters.name ||
          `${supporter.firstName} ${supporter.lastName}`
            .toLowerCase()
            .includes(filters.name.toLowerCase())) &&
        (filters.meeting === "not-selected" ||
          supporter.meeting.includes(filters.meeting)) &&
        (filters.gender === "not-selected" ||
          supporter.gender === filters.gender) &&
        (filters.age === "not-selected" ||
          (supporter.age >= minAge && supporter.age <= maxAge)) &&
        (filters.area === "not-selected" || supporter.area === filters.area) &&
        (!filters.city || supporter.city === filters.city) &&
        (filters.preferredLanguage === "not-selected" ||
          supporter.preferredLanguage === filters.preferredLanguage) &&
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

  // if (status === "loading") {
  //   return (
  //     <div className="flex w-full min-h-screen justify-center items-center">
  //       <Loading show={true} />
  //     </div>
  //   );
  // }

  if (status === "failed") {
    return <div>Error:{error}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <div className="w-full lg:flex-grow order-2 lg:order-1">
        <div className="flex-1 flex-col items-center safe-bottom">
          <SupporterList supporters={filteredSupporters} />
        </div>
      </div>
      <div className="order-1 lg:order-2">
        <Sidebar
          onFilter={handleFilter}
          onToggleFavorites={handleToggleFavorites}
          showFavorites={showFavorites}
          onClearFilters={handleClearFilters}
        />
      </div>
    </div>
  );
};

export default SupportersPage;
