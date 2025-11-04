import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CovidData from "./components/CovidData";
import UpdateData from "./components/UpdateData";
import Report from "./components/Report";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="navbar">
        <h2>COVID Tracker</h2>
        <nav>
          <Link to="/">Covid Data</Link>
          <Link to="/update">Update Data</Link>
          <Link to="/report">Report</Link>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<CovidData />} />
        <Route path="/update" element={<UpdateData />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;