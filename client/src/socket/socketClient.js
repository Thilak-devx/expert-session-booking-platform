import { io } from "socket.io-client";

let socketInstance;
const subscribedExpertRooms = new Map();
let connectionStatus = "disconnected";
const statusListeners = new Set();
let connectionConsumers = 0;

function resolveSocketUrl() {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (apiBaseUrl) {
    try {
      const resolvedUrl = new URL(apiBaseUrl, window.location.origin);
      return resolvedUrl.origin;
    } catch {
      return window.location.origin;
    }
  }

  return window.location.origin;
}

function notifyStatus() {
  statusListeners.forEach((listener) => listener(connectionStatus));
}

function createSocket() {
  const socket = io(resolveSocketUrl(), {
    autoConnect: false,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  socket.on("connect", () => {
    connectionStatus = "connected";
    notifyStatus();
    subscribedExpertRooms.forEach((_, expertId) => {
      socket.emit("subscribeExpert", { expertId });
    });
  });

  socket.on("reconnect_attempt", () => {
    connectionStatus = "reconnecting";
    notifyStatus();
  });

  socket.on("disconnect", () => {
    connectionStatus = "disconnected";
    notifyStatus();
  });

  socket.on("connect_error", () => {
    connectionStatus = "reconnecting";
    notifyStatus();
  });

  return socket;
}

function ensureSocketConnected() {
  const socket = getSocket();

  if (!socket.connected) {
    connectionStatus = "reconnecting";
    notifyStatus();
    socket.connect();
  }

  return socket;
}

export function getSocket() {
  if (!socketInstance) {
    socketInstance = createSocket();
  }

  return socketInstance;
}

export function connectSocket() {
  connectionConsumers += 1;
  return ensureSocketConnected();
}

export function disconnectSocket() {
  connectionConsumers = Math.max(0, connectionConsumers - 1);

  if (connectionConsumers === 0 && socketInstance?.connected) {
    socketInstance.disconnect();
  }
}

export function subscribeToSocketEvent(eventName, handler) {
  const socket = ensureSocketConnected();
  socket.on(eventName, handler);

  return () => {
    socket.off(eventName, handler);
  };
}

export function joinExpertRoom(expertId) {
  if (!expertId) {
    return;
  }

  const nextCount = (subscribedExpertRooms.get(expertId) || 0) + 1;
  subscribedExpertRooms.set(expertId, nextCount);

  if (nextCount === 1) {
    ensureSocketConnected().emit("subscribeExpert", { expertId });
  }
}

export function leaveExpertRoom(expertId) {
  if (!expertId) {
    return;
  }

  const currentCount = subscribedExpertRooms.get(expertId) || 0;

  if (currentCount <= 1) {
    subscribedExpertRooms.delete(expertId);
    getSocket().emit("unsubscribeExpert", { expertId });
    return;
  }

  subscribedExpertRooms.set(expertId, currentCount - 1);
}

export function subscribeToConnectionStatus(listener) {
  statusListeners.add(listener);
  listener(connectionStatus);

  return () => {
    statusListeners.delete(listener);
  };
}
