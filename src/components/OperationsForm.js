import React, { useState } from "react";
import "./OperationsForm.css";

function OperationsForm() {
    // State to track input format (binary or hex)
    const [inputFormat, setInputFormat] = useState("binary");

    // State to hold form data
    const [formData, setFormData] = useState({
        poly1: "",
        poly2: "",
        m: "",
    });

    // State for results
    const [result, setResult] = useState({ binary: "101010", hex: "2A" });

    // Handle input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle copy to clipboard
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert(`Copied to clipboard: ${text}`);
        });
    };

    return (
        <div className="operations-form">
            <h1>Polynomial Operations</h1>

            {/* Dropdown to select input format */}
            <div className="form-group">
                <label>Select Input Format:</label>
                <select
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value)}
                >
                    <option value="binary">Binary</option>
                    <option value="hex">Hex</option>
                </select>
            </div>

            <form>
                {/* Polynomial 1 Input */}
                <div className="form-group">
                    <label>Enter Polynomial 1:</label>
                    <input
                        type="text"
                        name="poly1"
                        value={formData.poly1}
                        onChange={handleInputChange}
                        placeholder={
                            inputFormat === "binary"
                                ? "e.g., 110101"
                                : "e.g., 1F"
                        }
                    />
                </div>

                {/* Polynomial 2 Input */}
                <div className="form-group">
                    <label>Enter Polynomial 2:</label>
                    <input
                        type="text"
                        name="poly2"
                        value={formData.poly2}
                        onChange={handleInputChange}
                        placeholder={
                            inputFormat === "binary"
                                ? "e.g., 110101"
                                : "e.g., 1F"
                        }
                    />
                </div>

                {/* Modulo Input */}
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

                {/* Binary Result with Copy Button */}
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

                {/* Hex Result with Copy Button */}
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
            </form>
        </div>
    );
}

export default OperationsForm;

