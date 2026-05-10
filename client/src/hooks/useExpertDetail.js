import { useEffect, useState } from "react";

import { getExpertById } from "../services/expertService";
import getErrorMessage from "../utils/getErrorMessage";

function useExpertDetail(expertId) {
  const [expert, setExpert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExpert = async (ignore = false) => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getExpertById(expertId);

      if (!ignore) {
        setExpert(data);
      }
    } catch (error) {
      if (!ignore) {
        setError(getErrorMessage(error, "Failed to load expert details"));
      }
    } finally {
      if (!ignore) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!expertId) {
      return undefined;
    }

    let ignore = false;

    fetchExpert(ignore);

    return () => {
      ignore = true;
    };
  }, [expertId]);

  return { expert, isLoading, error, setExpert, refetchExpert: () => fetchExpert(false) };
}

export default useExpertDetail;
