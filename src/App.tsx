// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateSession from "./Pages/Session";
function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4">
          <Link to="/createSession" className="text-blue-500 underline">
            Create Session
          </Link>
        </nav>

        <Routes>
          <Route path="/createSession" element={<CreateSession />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
