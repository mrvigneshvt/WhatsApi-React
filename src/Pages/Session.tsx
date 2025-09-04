// src/pages/CreateSession.tsx
import { useState, useEffect } from "react";
import { wsc } from "../Service/Socket";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { XCircle } from "lucide-react";
import TopBar from "../components/TopBar";

type Update = {
  sessionId: string;
  qr?: string;
  connection?: string;
  lastDisconnect?: any;
};

export default function CreateSession() {
  const [sessionId, setSessionId] = useState("");
  const [updates, setUpdates] = useState<Update[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);

  useEffect(() => {
    // connection updates
    const handler = (update: Update) => {
      console.log("📡 Update in component:", update);
      setUpdates((prev) => [...prev, update]);
    };
    wsc["conn"].on("connection-update", handler);

    // sessions list updates
    const sessionHandler = (data: string) => {
      try {
        const parsed = JSON.parse(data);
        console.log("📡 Sessions received:", parsed);
        setSessions(Object.keys(parsed)); // assuming clients is a Map<id, sock>
      } catch (e) {
        console.error("Failed to parse sessions", e);
      }
    };
    wsc["conn"].on("session-send", sessionHandler);

    return () => {
      wsc["conn"].off("connection-update", handler);
      wsc["conn"].off("session-send", sessionHandler);
    };
  }, []);

  const handleCreate = () => {
    if (!sessionId.trim()) {
      alert("Enter a session ID");
      return;
    }
    setUpdates([]); // clear previous updates
    wsc.createSession(sessionId);
  };

  const handleShowSessions = () => {
    wsc["conn"].emit("sessions"); // ask server to send sessions
  };

  const qrUpdates = updates.filter((u) => u.qr);
  const connectionClosed = updates.some(
    (u) => u.connection === "close" || u.lastDisconnect
  );

  return (
    <>
      <TopBar />

      <div
        className="max-w-3xl mx-auto p-6 bg-white min-h-screen"
        style={{ backgroundColor: "white" }}
      >
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          Create WhatsApp Session
        </h1>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="Enter session ID"
            className="border border-purple-300 p- rounded-lg3 flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleCreate}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold transition"
          >
            Create Session
          </button>
          <button
            onClick={handleShowSessions}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold transition"
          >
            Show Sessions
          </button>
        </div>

        {/* Show sessions */}
        {sessions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-purple-600 mb-3">
              Active Sessions
            </h2>
            <ul className="list-disc pl-6 text-gray-700">
              {sessions.map((s) => (
                <li key={s} className="mb-1">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-8">
          {/* QR Updates */}
          {qrUpdates.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-purple-600 mb-3">
                QR Codes
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {qrUpdates.map((u, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center border border-purple-200 rounded-xl p-5 bg-white shadow-md"
                  >
                    {connectionClosed ? (
                      <div className="flex flex-col items-center">
                        <XCircle className="text-orange-500 w-12 h-12 mb-2" />
                        <p className="text-sm text-red-600 font-semibold">
                          QR Expired
                        </p>
                      </div>
                    ) : (
                      <QRCode value={u.qr!} size={128} />
                    )}
                    <p className="text-xs text-gray-500 mt-2">QR #{idx + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connection Status */}
          <div>
            <h2 className="text-xl font-semibold text-purple-600 mb-3">
              Connection Status
            </h2>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto border border-gray-200">
              {JSON.stringify(updates, null, 2)}
            </pre>
          </div>

          {/* Retry button if closed */}
          {connectionClosed && (
            <div className="mt-6 text-center">
              <button
                onClick={handleCreate}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                🔄 Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
