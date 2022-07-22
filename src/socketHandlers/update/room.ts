import { io } from "../../socket";
import { activeRooms } from "../socket-store";

export const updateRooms = (toSpecifiedSocketId: string | null = null) => {
  if (toSpecifiedSocketId) {
    io.to(toSpecifiedSocketId).emit("active-rooms", {
      activeRooms,
    });
  } else {
    io.emit("active-rooms", {
      activeRooms,
    });
  }
};
