// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateSession from "./Pages/Session";
import Register from "./Pages/Register";
import TopBar from "./components/TopBar";

function App() {
  // Example: Replace with your actual login state logic
  const isLoggedIn = false;

  return (
    <>
      <TopBar isLoggedIn={isLoggedIn} />
      <Router>
          <Routes>
            <Route path="/createSession" element={<CreateSession />} />
            <Route path="/register" element={<Register/>} />
          </Routes>
      </Router>
    </>
  );
}

export default App;
