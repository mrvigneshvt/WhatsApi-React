import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchToken, secureFetch } from "../utils/util";
import { Config } from "../../config";

export default function Init() {
  const navigate = useNavigate();

  useEffect(() => {
    const validate = async () => {
      const token = fetchToken();
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await secureFetch(Config.authentication.validation, {
          method: "GET",
        });

        // if backend sends { success: true, ... }
        if (response?.success) {
          console.log("✅ Token valid", response);
        } else {
          console.warn("❌ Invalid token", response);
          localStorage.removeItem("authToken");
          localStorage.removeItem("authInfo");
          navigate("/login");
        }
      } catch (err: any) {
        console.error("❌ Validation failed", err);
        // handle 403 or network error
        localStorage.removeItem("authToken");
        localStorage.removeItem("authInfo");
        navigate("/login");
      }
    };

    validate();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-xl font-bold text-gray-700">
        Checking authentication…
      </h1>
    </div>
  );
}
