import { useState } from "react";
import { Config } from "../../config";
import { saveAuth, secureFetch } from "../utils/util";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigaate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!userId || !password) {
      alert("Please enter both User ID and Password");
      return;
    }

    try {
      const body = { userId, password };
      console.log("BODY: ", body);

      const data = await secureFetch(Config.authentication.login, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (data?.user?.token) {
        await saveAuth(data.user.token, data.user);
        alert("Login successful!");
        console.log("JWT Token:", data.user.token);
        // setTimeout(() => {
        //   navigaate("/dashboard");
        // }, 2000);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 via-purple-500 to-orange-400 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex-shrink-0 bg-yellow-400 flex align-center items-end">
          <img
            src="/src/assets/logoOnly.png"
            alt="logo"
            className="h-44 w-auto max-h-12 object-contain self-center"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-violet-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter your User ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-violet-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
