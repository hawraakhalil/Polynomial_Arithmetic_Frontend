import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {

    const [isLocked, setIsLocked] = useState(true);
    const navigate = useNavigate();
  
    const handleToggle = () => {
      if (isLocked) {
        navigate("/operations");
      } else {
        navigate("/");
      }
      setIsLocked(!isLocked);
    };

  return (
    <div className="navbar">
      <h1 className="navbar-title">Polynomial Operations</h1>
      <div className="navbar-icon" onClick={handleToggle} style={{ cursor: "pointer" }}>
        <FontAwesomeIcon icon={isLocked ? faLock : faUnlock} />
      </div>
    </div>
  );
};

export default Navbar;
