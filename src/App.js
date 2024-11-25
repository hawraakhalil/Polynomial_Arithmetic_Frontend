import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Team from "./pages/Team";
import Operations from "./pages/Operations";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Team />} />
          <Route exact path="/operations" element={<Operations />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
