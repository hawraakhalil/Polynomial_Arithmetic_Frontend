import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./OperationsForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the FontAwesomeIcon component
import { faCopy } from "@fortawesome/free-solid-svg-icons"; // Import the specific icon you need



const OperationsForm = forwardRef(({ hoveredOperation, operation }, ref) => {
    const [inputFormat, setInputFormat] = useState("binary");
  
    const apiUrl = "https://rubah.pythonanywhere.com";
  
    const [formData, setFormData] = useState({
      poly1: "",
      poly2: "",
      m: "",
      bits: "16",
    });
    const [errors, setErrors] = useState({ poly1: "", poly2: "" });
    const [result, setResult] = useState({ binary: "", hex: "" });
  
    const generatePlaceholder = (bits, format) => {
      if (format === "binary") {
        return "1".repeat(bits);
      } else if (format === "hex") {
        return "F".repeat(bits / 4);
      }
      return "";
    };
  
    // Use useImperativeHandle to expose handleSubmit to the parent component
    useImperativeHandle(ref, () => ({
      handleSubmit,
    }));
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      const maxBits = parseInt(formData.bits);
      const maxLength = inputFormat === "binary" ? maxBits : maxBits / 4;

        // Validation based on input format
        const isValidInput = () => {
            if (inputFormat === "binary") {
            // Only allow 0s and 1s for binary
            return /^[01]*$/.test(value);
            } else if (inputFormat === "hex") {
            // Only allow 0-9 and A-F (case insensitive)
            return /^[0-9A-Fa-f]*$/.test(value);
            }
            return true;
        };

        // If input is invalid, do nothing
        if (!isValidInput()) {
            return;
        }

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
  
      if ((name === "poly1" || name === "poly2") && value.length > maxLength) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `Number of bits exceeded! Max length: ${maxLength} ${
            inputFormat === "binary" ? "bits" : "hex digits"
          }.`,
        }));
        return;
      }
  
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).catch((err) => {
          console.error('Failed to copy text: ', err);
        });
      };
  
    const handleSubmit = async (operation) => {

    setErrors({ poly1: "", poly2: "" });

      if (!operation) {
        alert("Please select an operation");
        return;
      }

      if (operation === "Divide") {
        // Check if the second polynomial is all zeros
        const isZeroPoly = (poly) => {
          // Remove any whitespace and check if the polynomial is all zeros
          return poly.trim().split('').every(char => char === '0');
        };
    
        if (isZeroPoly(formData.poly2)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            poly2: "Cannot divide by zero polynomial",
          }));
          return;
        }
      }

       // Validation for polynomial inputs
    if (operation === "Modulo" || operation === "Invert") {
        if (!formData.poly1) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            poly1: "Enter a value for Polynomial 1",
          }));
          return;
        }
        if (formData.poly2) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            poly2: "This operation takes only 1 polynomial",
          }));
          return;
        }
      } else {
        if (!formData.poly1) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            poly1: "Enter a value for Polynomial 1",
          }));
          return;
        }
        if (!formData.poly2) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            poly2: "Enter a value for Polynomial 2",
          }));
          return;
        }
      }

      const formatForPayload = inputFormat === "binary" ? "bin" : inputFormat;
  
      const payload = {
        bits: parseInt(formData.bits),
        m: parseInt(formData.m),
        type: formatForPayload,
      };
  
      if (operation === "Invert" || operation === "Modulo") {
        // For Inversion, only send poly1 (as bin or hex)
        payload[inputFormat] = formData.poly1;
      } else {
        // For other operations, send both poly1 and poly2
        payload[`${formatForPayload}1`] = formData.poly1;
        payload[`${formatForPayload}2`] = formData.poly2;
      }

      console.log("Payload being sent:", payload);
  
      try {
        // Make the API call
        const response = await fetch(`${apiUrl}/${operation.toLowerCase()}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          throw new Error("Failed to perform the operation");
        }
  
        const data = await response.json();

        console.log("Backend response:", data); // Log the response from the backend

        if (!response.ok) {
          console.error("Error response:", data);
          throw new Error(data.message || "Failed to perform the operation");
        }
    // Handle different response formats
    let binaryResult = "";
    let hexResult = "";

    if (operation === "Divide" && data.bin && data.hex) {
      // Response format for Division operation
      binaryResult = data.bin;
      hexResult = data.hex;
    } else if (data.result && (data.result.bin || data.result.hex)) {
      // Response format for other operations
      binaryResult = data.result.bin || "No binary result available";
      hexResult = data.result.hex || "No hex result available";
    } else {
      throw new Error("Unexpected response format or missing results");
    }

        // Update the result fields
        setResult({
        binary: binaryResult,
        hex: hexResult,
        });
    } catch (error) {
        console.error("Error:", error);
        alert(error.message || "An error occurred while performing the operation");
    }
        };

  return (
    <div className="operations-form">
      <div className="form-group">
        <label>Input Type</label>
        <select
          value={inputFormat}
          onChange={(e) => setInputFormat(e.target.value)}
          className="dropdown"
        >
          <option value="binary">Binary</option>
          <option value="hex">Hex</option>
        </select>
      </div>

      <div className="form-group">
        <label>Number of Bits</label>
        <select
          name="bits"
          value={formData.bits}
          onChange={handleInputChange}
          className="dropdown"
        >
          <option value="16">16</option>
          <option value="32">32</option>
          <option value="64">64</option>
          <option value="128">128</option>
          <option value="256">256</option>
        </select>
      </div>

      <div className="form-group">
        <label>Polynomial 1</label>
        <input
          type="text"
          name="poly1"
          value={formData.poly1}
          onChange={handleInputChange}
          placeholder={generatePlaceholder(parseInt(formData.bits), inputFormat)}
          title={`Enter ${inputFormat === 'binary' ? '0s and 1s' : '0-9 and A-F'}`}
          className= {
           hoveredOperation ? "highlight-all" : ""
          }
        />
        {errors.poly1 && <p className="error">{errors.poly1}</p>}
      </div>
      <div
        className="form-group"
      >
        <label>Polynomial 2</label>
        <input
          type="text"
          name="poly2"
          value={formData.poly2}
          onChange={handleInputChange}
          placeholder={generatePlaceholder(parseInt(formData.bits), inputFormat)}
          title={`Enter ${inputFormat === 'binary' ? '0s and 1s' : '0-9 and A-F'}`}
          className={
            hoveredOperation === "Invert" || hoveredOperation === "Modulo" ? "gray-out" : hoveredOperation ? "highlight-all" : ""
          }
        />
        {errors.poly2 && <p className="error">{errors.poly2}</p>}
      </div>

      <div className="form-group">
        <label>Parameter <i>m</i></label>
        <input
          type="text"
          name="m"
          value={formData.m}
          onChange={handleInputChange}
          placeholder="Enter an integer"
        />
      </div>
        {/* Results with Copy Buttons */}
        <div className="form-group result-box">
        <label>Binary Result</label>
        <div className="result-wrapper copy-wrapper">
            <input
            type="text"
            value={result.binary}
            readOnly
            className="copy-input"
            />
        <div
            className="copy-icon-wrapper"
            onClick={() => handleCopy(result.binary)}
            title="Copy to clipboard"
            >
            <FontAwesomeIcon icon={faCopy} className="copy-icon" />
            <span className="copy-tooltip">Copy</span>
            </div>
        </div>
        </div>

<div className="form-group result-box">
  <label>HEX Result</label>
  <div className="result-wrapper copy-wrapper">
    <input
      type="text"
      value={result.hex}
      readOnly
      className="copy-input"
    />
   <div
      className="copy-icon-wrapper"
      onClick={() => handleCopy(result.hex)}
      title="Copy to clipboard"
    >
      <FontAwesomeIcon icon={faCopy} className="copy-icon" />
      <span className="copy-tooltip">Copy</span>
    </div>
  </div>
</div>
        </div>
    );
});

export default OperationsForm;
