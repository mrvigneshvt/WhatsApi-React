import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { wsc } from "../Service/Socket";
import TopBar from "../components/TopBar";

type SessionStatusTypes = "connected" | "disconnected" | "noSession";

export default function Dashboard() {
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [monthName, setMonthName] = useState("");
  const [szn, setSzn] = useState(false);
  const [authInfo, setAuthInfo] = useState<Record<string, any> | null>(null);
  const [session, setSession] = useState<SessionStatusTypes>("noSession");

  useEffect(() => {
    console.log("COMES UNDER HERE");
    const AuthInfo = localStorage.getItem("authInfo");
    // console.log(AuthInfo , '?/////
    if (AuthInfo) {
    }
    console.log("COMES AFTER HERE");

    wsc.conn.emit("session");

    const handleSessionData = (data: string) => {
      try {
        const parsed = JSON.parse(data);
        console.log("📡 Your Session:", parsed);
      } catch (err) {
        console.error("Failed to parse session data:", err);
      }
    };

    wsc.conn.on("session-send", handleSessionData);

    return () => {
      wsc.conn.off("session-send", handleSessionData);
    };
  }, []);

  return (
    <>
      <TopBar isLoggedIn={true} isActive={szn} />
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-500 to-orange-400 p-6 text-white">
        <div className="bg-red-500 flex justify-center">
          <h1>Hello</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Month */}
          <div className="bg-white text-violet-700 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Current Month</h2>
            <p className="text-2xl font-bold">{monthName}</p>
          </div>

          {/* Total Messages */}
          <div className="bg-white text-orange-600 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Total Messages</h2>
            <p className="text-2xl font-bold">{totalMessages}</p>
          </div>

          {/* Total Users */}
          <div className="bg-white text-purple-600 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Total Users</h2>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Billing */}
          <div className="bg-white text-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Billing Summary</h2>
            <p className="text-sm">
              View usage, invoices, and payment methods.
            </p>
            <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
              Go to Billing
            </button>
          </div>

          {/* Session Status */}

          <Link
            to={"/createSession"}
            className="bg-white text-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold mb-2">Session Status</h2>
            <p className="text-sm">
              Manage your WhatsApp sessions and QR codes.
            </p>
            <button className="mt-4 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded">
              Manage Sessions
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
