// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateSession from "./Pages/Session";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import SessionPage from "./Pages/Session";
import Init from "./Pages/Init";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Init />} />
          <Route path="/createSession" element={<CreateSession />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sessions" element={<SessionPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
