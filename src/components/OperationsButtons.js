import React from "react";
import "./OperationsButtons.css";

function OperationsButtons({ onHover, onClick }) {
  const operations = [
    "Add",
    "Subtract",
    "Divide",
    "Invert",
    "Multiply",
    "Modulo",
  ];

  return (
    <div className="operations-buttons">
      {operations.map((operation) => (
        <button
          key={operation}
          className="operation-button"
          onMouseEnter={() => onHover(operation)} // Trigger hover handler
          onMouseLeave={() => onHover("")} // Clear hover on leave
          onClick={() => onClick(operation)}
        >
          {operation}
        </button>
      ))}
    </div>
  );
}

export default OperationsButtons;
