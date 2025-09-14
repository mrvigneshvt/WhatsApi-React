import io, { Socket } from "socket.io-client";
import { Config } from "../../config";

export class WS {
  public conn: typeof Socket;

  constructor() {
    const token = localStorage.getItem("authToken");

    this.conn = io(Config.socketUrl, {
      auth: {
        token,
      },
      transports: ["websocket"], // optional but recommended
    });

    // this.conn.on("connect", () => console.log("connected"));
    // this.conn.on("disconnect", () => console.log("disconnected"));
    // this.conn.on("connection-update", (data) => console.log("Update:", data));
  }

  public createSession(id: string) {
    this.conn.emit("init-session", id);
  }
}

export const wsc = new WS();
