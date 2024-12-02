import React, { useState } from "react";
import "./OperationsForm.css";

function OperationsForm() {
    const [inputFormat, setInputFormat] = useState("binary");
    const [selectedOperation, setSelectedOperation] = useState("");
    const [formData, setFormData] = useState({
        poly1: "",
        poly2: "",
        m: "",
    });
    const [result, setResult] = useState({ binary: "", hex: "" });

    const operationsRequiringOnePoly = ["Inversion"]; // Operations needing only one polynomial

    // Handle input field changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle operation selection
    const handleOperationChange = (operation) => {
        setSelectedOperation(operation);
        if (operationsRequiringOnePoly.includes(operation)) {
            setFormData({ ...formData, poly2: "" }); // Reset Polynomial 2 for single-poly operations
        }
    };

    // Handle copy to clipboard
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert(`Copied to clipboard: ${text}`);
        });
    };

    return (
        <div className="operations-form">
            {/* Input format dropdown */}
            <div className="form-group">
                <label>Type:</label>
                <select
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value)}
                    className="dropdown"
                >
                    <option value="binary">Binary</option>
                    <option value="hex">Hex</option>
                </select>
            </div>

            {/* Input Fields */}
            <div className="form-group">
                <label>Poly 1:</label>
                <input
                    type="text"
                    name="poly1"
                    value={formData.poly1}
                    onChange={handleInputChange}
                    placeholder={inputFormat === "binary" ? "e.g., 110101" : "e.g., 1F"}
                />
            </div>

            <div className="form-group">
                <label>Poly 2:</label>
                <input
                    type="text"
                    name="poly2"
                    value={formData.poly2}
                    onChange={handleInputChange}
                    placeholder={inputFormat === "binary" ? "e.g., 110101" : "e.g., 1F"}
                    disabled={operationsRequiringOnePoly.includes(selectedOperation)}
                    className={
                        operationsRequiringOnePoly.includes(selectedOperation) ? "disabled" : ""
                    }
                />
            </div>

            <div className="form-group">
                <label>m:</label>
                <input
                    type="text"
                    name="m"
                    value={formData.m}
                    onChange={handleInputChange}
                    placeholder="Enter m"
                />
            </div>

            {/* Results with Copy Buttons */}
            <div className="form-group result-box">
                <label>Binary Result:</label>
                <div className="result-wrapper">
                    <input type="text" value={result.binary} readOnly />
                    <button
                        type="button"
                        onClick={() => handleCopy(result.binary)}
                        className="copy-button"
                    >
                        Copy
                    </button>
                </div>
            </div>

            <div className="form-group result-box">
                <label>HEX Result:</label>
                <div className="result-wrapper">
                    <input type="text" value={result.hex} readOnly />
                    <button
                        type="button"
                        onClick={() => handleCopy(result.hex)}
                        className="copy-button"
                    >
                        Copy
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OperationsForm;
