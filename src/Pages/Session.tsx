import { useEffect, useState } from "react";
import { QRCodeSVG as QRCode } from "qrcode.react";
import {
  XCircle,
  RefreshCw,
  Trash2,
  CheckCircle,
  PlusCircle,
} from "lucide-react";
import TopBar from "../components/TopBar";
import { wsc } from "../Service/Socket";

type Update = {
  sessionId: string;
  qr?: string;
  connection?: string;
  lastDisconnect?: any;
  status?: string;
};

type SessionInfo = {
  sessionId: string;
  status: string;
  connected?: boolean;
};

export default function SessionPage() {
  const [activeSession, setActiveSession] = useState<Update | null>(null);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [hasDisconnected, setHasDisconnected] = useState(false);

  useEffect(() => {
    const handleUpdate = (update: Update) => {
      console.log("🔄 Connection Update:", update);
      setActiveSession((prev) => ({
        ...prev,
        ...update,
      }));
      if (update.connection === "close" || update.lastDisconnect) {
        setHasDisconnected(true);
      }
    };

    const handleSessions = (data: string) => {
      try {
        const parsed = JSON.parse(data);
        console.log("📡 Sessions received:", parsed);

        // Ensure parsed is an array
        if (Array.isArray(parsed)) {
          setSessions((prev) => {
            // Avoid unnecessary state updates if same data
            if (JSON.stringify(prev) === JSON.stringify(parsed)) return prev;
            return parsed;
          });

          if (!activeSession && parsed.length > 0) {
            setActiveSession(parsed[0]);
          }
        } else if (parsed.sessionId) {
          // Single session update
          setSessions((prev) => {
            const filtered = prev.filter(
              (s) => s.sessionId !== parsed.sessionId
            );
            return [...filtered, parsed];
          });
        }
      } catch (err) {
        console.error("❌ Failed to parse sessions", err);
      }
    };

    const handleSessionDeleted = (data: string) => {
      const parsed = JSON.parse(data);
      console.log("🗑 Session Deleted:", parsed);
      setSessions((prev) =>
        prev.filter((s) => s.sessionId !== parsed.sessionId)
      );
      if (activeSession?.sessionId === parsed.sessionId) {
        setActiveSession(null);
      }
    };

    const handleSessionCheck = (data: string) => {
      const parsed = JSON.parse(data);
      console.log("✅ Session Check Result:", parsed);
      alert(`Session ${parsed.sessionId}: ${parsed.status || parsed.error}`);
    };

    // Attach listeners once
    wsc.conn.off("connection-update").on("connection-update", handleUpdate);
    wsc.conn.off("session-send").on("session-send", handleSessions);
    wsc.conn.off("session-deleted").on("session-deleted", handleSessionDeleted);
    wsc.conn.off("session-check").on("session-check", handleSessionCheck);

    // Request sessions only once when page loads
    wsc.conn.emit("sessions");

    return () => {
      wsc.conn.off("connection-update", handleUpdate);
      wsc.conn.off("session-send", handleSessions);
      wsc.conn.off("session-deleted", handleSessionDeleted);
      wsc.conn.off("session-check", handleSessionCheck);
    };
  }, [activeSession]);

  // === Actions ===
  const handleCreateSession = () => {
    const newSessionId = `session_${Date.now()}`;
    setActiveSession(null);
    setHasDisconnected(false);
    wsc.conn.emit("init-session", newSessionId);
  };

  const handleReconnect = (id: string) => {
    console.log("🔄 Reconnecting:", id);
    wsc.conn.emit("reconnect-session", id);
  };

  const handleDelete = (id: string) => {
    console.log("🗑 Deleting:", id);
    wsc.conn.emit("delete-session", id);
  };

  const handleCheckConnection = (id: string) => {
    console.log("✅ Checking connection:", id);
    wsc.conn.emit("check-session", id);
  };

  return (
    <>
      <TopBar />

      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-500 to-orange-400 p-6 text-white">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 text-gray-800">
          <h1 className="text-3xl font-bold text-purple-700 mb-6">
            WhatsApp Session Manager
          </h1>

          {/* Session Actions */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleCreateSession}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Create New Session
            </button>
          </div>

          {/* Active Sessions List */}
          {sessions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-purple-600 mb-2">
                Active Sessions
              </h2>
              <ul className="space-y-3">
                {sessions.map((s) => (
                  <li
                    key={s.sessionId}
                    className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg"
                  >
                    <span className="font-medium text-gray-800">
                      {s.sessionId} ({s.status})
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReconnect(s.sessionId)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Reconnect Session"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleCheckConnection(s.sessionId)}
                        className="text-green-600 hover:text-green-800"
                        title="Check Connection"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.sessionId)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Session"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* QR Code */}
          {activeSession?.qr && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-purple-600 mb-3">
                QR Code
              </h2>
              <div className="flex flex-col items-center border border-purple-200 rounded-xl p-5 bg-white shadow-md">
                {hasDisconnected ? (
                  <div className="flex flex-col items-center">
                    <XCircle className="text-orange-500 w-12 h-12 mb-2" />
                    <p className="text-sm text-red-600 font-semibold">
                      QR Expired
                    </p>
                  </div>
                ) : (
                  <QRCode value={activeSession.qr} size={160} />
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Session ID: {activeSession.sessionId}
                </p>
              </div>
            </div>
          )}

          {/* Connection Debug */}
          <div>
            <h2 className="text-lg font-semibold text-purple-600 mb-3">
              Connection Status
            </h2>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto border border-gray-200">
              {JSON.stringify(activeSession, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
