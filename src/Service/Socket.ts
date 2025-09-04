import io, { Socket } from "socket.io-client";
import { Config } from "../../config";
// const socket = io(Config.socketUrl);

// export class WS {
//   private conn: typeof Socket;
//   constructor() {
//     this.conn = io(Config.socketUrl);

//     this.conn.on("connect", (d) => {
//       console.log("connected: ", d);
//     });

//     this.conn.on("disconnect", () => {
//       console.log("Disconnect...");
//     });

//     this.conn.on("connection-pending", (data: any) => {
//       console.log("ConnectionPending: ", data);
//     });

//     this.conn.on("connection-success", () => {
//       console.log("Connection success");
//     });
//   }

//   public async createSession(id: string) {
//     this.conn.emit("init-session", id);
//   }
// }

// export const wsc = new WS();

export class WS {
  private conn: typeof Socket;

  constructor() {
    this.conn = io(Config.socketUrl);
    this.conn.on("connect", () => console.log("connected"));
    this.conn.on("disconnect", () => console.log("disconnected"));
    this.conn.on("connection-update", (data) => console.log("Update:", data));
  }

  public createSession(id: string) {
    this.conn.emit("init-session", id);
  }
}

export const wsc = new WS();
