// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(
      "https://api.pastordanielakintola.com/chat",
      {
        autoConnect: true,
        reconnection: true,
      },
    );

    socketRef.current = socket;
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    return () => socket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
