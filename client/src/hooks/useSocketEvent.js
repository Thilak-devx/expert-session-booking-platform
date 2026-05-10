import { useEffect, useRef } from "react";

import { subscribeToSocketEvent } from "../socket/socketClient";

function useSocketEvent(eventName, handler) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!eventName || typeof handlerRef.current !== "function") {
      return undefined;
    }

    const unsubscribe = subscribeToSocketEvent(eventName, (...args) => {
      handlerRef.current?.(...args);
    });

    return unsubscribe;
  }, [eventName]);
}

export default useSocketEvent;
