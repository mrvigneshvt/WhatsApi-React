import { useNavigate, type NavigateFunction } from "react-router-dom";

export const secureFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("authToken");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 403) {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
    return;
  }

  return response.json(); // returns parsed JSON directly
};

export const logout = async (navigate: NavigateFunction) => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authInfo");
  navigate("/login");
};

export const fetchAuthInfo = (): string | undefined => {
  const data = localStorage.getItem("authInfo");
  return data ? JSON.parse(data) : undefined;
};

export const fetchToken = (): string | undefined => {
  const data = localStorage.getItem("authToken");
  return data ? data : undefined;
};

export const saveToken = (data: string) => {
  localStorage.setItem("authToken", data);
};

export const saveAuthInfo = (data: any) => {
  localStorage.setItem("authInfo", JSON.stringify(data));
};

export const saveAuth = async (token: string, data: Record<string, any>) => {
  await saveToken(token);
  await saveAuthInfo(data);
};
