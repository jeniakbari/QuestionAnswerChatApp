import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const authenticateUserSocket = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication token missing"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    socket.data.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication failed"));
  }
};
