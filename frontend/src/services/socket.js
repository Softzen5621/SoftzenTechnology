import {

  io

} from "socket.io-client";

// ======================================================
// SOCKET
// ======================================================

const socket =
  io(

    import.meta.env.VITE_API_URL.replace("/api", ""),

    {

      transports: [

        "websocket"
      ]
    }
  );

// ======================================================
// EXPORT
// ======================================================

export default socket;