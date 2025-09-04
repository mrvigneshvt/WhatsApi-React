import React, { useState } from "react";
import { Config as serverUrl} from "../../config";
// Change to your actual server URL

const Register: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    userID: "",
    password: "",
    role: "",
    phoneNumber: "",
    alternativeNumber: "",
    email: "",
    companyName: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Basic validation
    const requiredFields = ["name", "userID", "password", "role", "phoneNumber", "email", "companyName"];
    for (const field of requiredFields) {
      if (!form[field as keyof typeof form]) {
        setMessage("Please fill all required fields.");
        return;
      }
    }

    setLoading(true);
    try {
      // Map userID to userId for backend compatibility
      const payload = {
        name: form.name,
        userId: form.userID,
        password: form.password,
        role: form.role,
        phoneNumber: form.phoneNumber,
        alternativeNumber: form.alternativeNumber,
        email: form.email,
        companyName: form.companyName,
      };

      const res = await fetch(`${serverUrl.serverUrl}/api/v1/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      // Handle backend responses
      if (res.status === 201 && data.success) {
        setMessage("User Created Successfully");
      } else if (res.status === 400 && data.message === "User ID already Exist") {
        setMessage("User ID already exists.");
      } else if (res.status === 400 && data.message === "Missing required fields") {
        setMessage("Missing required fields.");
      } else if (res.status === 500 && data.message === "Database error during creation") {
        setMessage("Database error during creation.");
      } else if (res.status === 500 && data.message === "Internal Server Error") {
        setMessage("Internal Server Error.");
      } else if (res.status === 500 && data.message === "Internal Register Error") {
        setMessage("Internal Register Error.");
      } else {
        setMessage(data.message || "Something Went Wrong");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {message && (
          <div className="mb-2 text-center text-sm text-red-500">{message}</div>
        )}
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          type="text"
          name="userID"
          placeholder="User ID"
          value={form.userID}
          onChange={handleChange}
        />
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <select
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
        />
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          type="text"
          name="alternativeNumber"
          placeholder="Alternative Number"
          value={form.alternativeNumber}
          onChange={handleChange}
        />
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          type="submit"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;