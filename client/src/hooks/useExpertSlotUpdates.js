import { useEffect } from "react";

import { joinExpertRoom, leaveExpertRoom } from "../socket/socketClient";
import useSocketEvent from "./useSocketEvent";

function useExpertSlotUpdates(expertId, handler) {
  useEffect(() => {
    if (!expertId) {
      return undefined;
    }

    joinExpertRoom(expertId);

    return () => {
      leaveExpertRoom(expertId);
    };
  }, [expertId]);

  useSocketEvent("slotBooked", (payload) => handler?.({ ...payload, type: "slotBooked" }));
  useSocketEvent("bookingCancelled", (payload) => handler?.({ ...payload, type: "bookingCancelled" }));
}

export default useExpertSlotUpdates;
