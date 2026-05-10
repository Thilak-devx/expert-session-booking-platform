import { useEffect, useState } from "react";

import { getExperts } from "../services/expertService";
import getErrorMessage from "../utils/getErrorMessage";

function useExperts(filters) {
  const [state, setState] = useState({
    experts: [],
    categories: [],
    totalPages: 1,
    currentPage: 1,
    totalExperts: 0,
    totalAvailableSlots: 0,
    isLoading: true,
    error: "",
  });

  useEffect(() => {
    let ignore = false;

    const fetchExperts = async () => {
      setState((previous) => ({ ...previous, isLoading: true, error: "" }));

      try {
        const data = await getExperts(filters);

        if (!ignore) {
          setState({
            ...data,
            isLoading: false,
            error: "",
          });
        }
      } catch (error) {
        if (!ignore) {
          setState((previous) => ({
            ...previous,
            isLoading: false,
            error: getErrorMessage(error, "Failed to load experts"),
          }));
        }
      }
    };

    fetchExperts();

    return () => {
      ignore = true;
    };
  }, [filters.category, filters.limit, filters.page, filters.search]);

  return state;
}

export default useExperts;
