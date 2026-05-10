const { Server } = require("socket.io");

let ioInstance;
const expertRoom = (expertId) => `expert:${expertId}`;

const initializeSocket = (server, clientUrl) => {
  ioInstance = new Server(server, {
    cors: {
      origin: clientUrl,
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  ioInstance.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("subscribeExpert", ({ expertId } = {}) => {
      if (!expertId) {
        return;
      }

      socket.join(expertRoom(expertId));
    });

    socket.on("unsubscribeExpert", ({ expertId } = {}) => {
      if (!expertId) {
        return;
      }

      socket.leave(expertRoom(expertId));
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

const emitSlotBooked = ({ expertId, date, timeSlot }) => {
  const io = getIO();

  io.to(expertRoom(expertId)).emit("slotBooked", {
    expertId,
    date,
    timeSlot,
    updatedAt: new Date().toISOString(),
  });
};

const emitBookingCancelled = ({ expertId, date, timeSlot }) => {
  const io = getIO();

  io.to(expertRoom(expertId)).emit("bookingCancelled", {
    expertId,
    date,
    timeSlot,
    updatedAt: new Date().toISOString(),
  });
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io has not been initialized");
  }

  return ioInstance;
};

module.exports = {
  initializeSocket,
  getIO,
  emitSlotBooked,
  emitBookingCancelled,
};
