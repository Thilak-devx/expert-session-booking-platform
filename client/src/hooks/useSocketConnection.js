import { useEffect } from "react";

import { connectSocket, disconnectSocket } from "../socket/socketClient";

function useSocketConnection() {
  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);
}

export default useSocketConnection;
