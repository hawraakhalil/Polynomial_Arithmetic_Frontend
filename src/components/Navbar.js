import React from "react";
import "./Navbar.css"; 

const Navbar = () => {
  return (
    <div className="navbar">
      <h1 className="navbar-title">Polynomial Operations</h1>
      <div className="navbar-icon">
        {/* You can use an icon from FontAwesome or any SVG */}
        <i className="fas fa-lock-open"></i>
      </div>
    </div>
  );
};

export default Navbar;
