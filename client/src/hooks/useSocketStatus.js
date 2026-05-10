import { useEffect, useState } from "react";

import { subscribeToConnectionStatus } from "../socket/socketClient";

function useSocketStatus() {
  const [status, setStatus] = useState("disconnected");

  useEffect(() => subscribeToConnectionStatus(setStatus), []);

  return status;
}

export default useSocketStatus;
