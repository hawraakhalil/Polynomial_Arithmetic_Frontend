import React from "react";
import "./OperationsButtons.css";

function OperationsButtons() {
  return (
    <div className="operations-buttons">
      <button className="operation-button">Addition</button>
      <button className="operation-button">Subtraction</button>
      <button className="operation-button">Division</button>
      <button className="operation-button">Inversion</button>
      <button className="operation-button">Multiplication</button>
      <button className="operation-button">Modulo</button>
    </div>
  );
}

export default OperationsButtons;
