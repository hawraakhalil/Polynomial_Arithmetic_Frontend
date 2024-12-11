import React, { useState, useRef } from "react";
import OperationsForm from "../components/OperationsForm";
import OperationsButtons from "../components/OperationsButtons";

function Operations() {

  const [hoveredOperation, setHoveredOperation] = useState(""); // Track hovered operation
  const [selectedOperation, setSelectedOperation] = useState(""); // Track selected operation
  const formRef = useRef();

  const handleOperationClick = (operation) => {
    setSelectedOperation(operation); // Set the selected operation
    if (formRef.current) {
      formRef.current.handleSubmit(operation); // Trigger the form's handleSubmit method
    }
  };

  return (
    <div>
    <OperationsButtons
        onHover={(operation) => setHoveredOperation(operation)} // Pass hover handler
        onClick={handleOperationClick}  // Pass click handler
    />
    <OperationsForm
        ref={formRef}
        hoveredOperation={hoveredOperation} // Pass hovered operation state
        selectedOperation={selectedOperation} // Pass selected operation state
    />
    </div>
  );
}

export default Operations;
