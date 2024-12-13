import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./OperationsForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the FontAwesomeIcon component
import { faCopy } from "@fortawesome/free-solid-svg-icons"; // Import the specific icon you need

const OperationsForm = forwardRef(({ hoveredOperation, operation }, ref) => {
  // State for input format, errors, results, and form data
  const [inputFormat, setInputFormat] = useState("binary");
  const [errors, setErrors] = useState({ poly1: "", poly2: "" });
  const [result, setResult] = useState({ binary: "", hex: "" });
  const [formData, setFormData] = useState({
    poly1: "",
    poly2: "",
    m: "",
    bits: "16",
  });

  // Define the API URL
  const apiUrl = "https://rubah.pythonanywhere.com";

  // Placeholder generation based on input format
  const generatePlaceholder = (bits, format) => {
    if (format === "binary") {
      return "1".repeat(bits);
    } else if (format === "hex") {
      return "F".repeat(bits / 4);
    }
    return "";
  };

  // Expose the handleSubmit method to the parent component
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  // Handle copying text to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  };

  // Handle input change for polynomial fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const maxBits = parseInt(formData.bits);
    const maxLength = inputFormat === "binary" ? maxBits : maxBits / 4;

    // Validation based on input format
    const isValidInput = () => {
      if (name === 'm') {
        // Only allow non-negative integers
        return /^\d+$/.test(value);
        }
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

    // Clear errors for the field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    // Check if the input length exceeds the maximum bits
    if ((name === "poly1" || name === "poly2") && value.length > maxLength) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `Number of bits exceeded! Max length: ${maxLength} ${
          inputFormat === "binary" ? "bits" : "hex digits"
        }.`,
      }));
      return;
    }

    // Update the form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (operation) => {
    // Clear any previous errors
    setErrors({ poly1: "", poly2: "" });

    // Check if an operation is selected
    if (!operation) {
      alert("Please select an operation");
      return;
    }

    // Validation for Divide operation
    if (operation === "Divide") {
      const isZeroPoly = (poly) => {
        return poly
          .trim()
          .split("")
          .every((char) => char === "0");
      };

      if (isZeroPoly(formData.poly2)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          poly2: "Cannot divide by zero polynomial",
        }));
        return;
      }
    }

    // Validation for polynomial fields
    // Invert and Modulo operations take only 1 polynomial
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
      // Other operations take 2 polynomials
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

    // Prepare the payload based on the operation and input format
    const formatForPayload = inputFormat === "binary" ? "bin" : inputFormat;

    console.log(formatForPayload)

    // Payload object to be sent to the API
    const payload = {
      bits: parseInt(formData.bits),
      m: parseInt(formData.m),
      type: formatForPayload,
    };


    // Add the polynomial values to the payload based on the operation
    if (operation === "Invert" || operation === "Modulo") {
        payload[(operation === "Modulo" || operation == "Invert") && inputFormat === "binary" ? "bin" : inputFormat] = formData.poly1;
    } else {
      payload[`${formatForPayload}1`] = formData.poly1;
      payload[`${formatForPayload}2`] = formData.poly2;
    }

    console.log(payload)

    // Perform the operation using the API
    try {
      const response = await fetch(`${apiUrl}/${operation.toLowerCase()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Check if the operation was successful
      if (!response.ok) {
        throw new Error("Failed to perform the operation");
      }

      // Parse the response
      const data = await response.json();

      console.log(data)

      // Check for errors in the response
      if (!response.ok) {
        console.error("Error response:", data);
        throw new Error(data.message || "Failed to perform the operation");
      }

      // Handle different response formats
      let binaryResult = "";
      let hexResult = "";

      // Response format for Divide operation
      if (operation === "Divide" && data.bin && data.hex) {
        binaryResult = data.bin;
        hexResult = data.hex;
        // Response format for other operations
      } else if (data.result && (data.result.bin || data.result.hex)) {
        binaryResult = data.result.bin || "No binary result available";
        hexResult = data.result.hex || "No hex result available";
      } else {
        throw new Error("Unexpected response format or missing results");
      }
      console.log(data)
      // Update the result fields
      setResult({
        binary: binaryResult,
        hex: hexResult,
      });
    } catch (error) {
        console.error("Error:", error);
        
        // Different error handling based on error type
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          alert(error.response.data.message || error.message);
        } else if (error.request) {
          // The request was made but no response was received
          alert("No response received from the server");
        } else {
          // Something happened in setting up the request that triggered an Error
          alert(error.message || "An unexpected error occurred");
        }
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
          placeholder={generatePlaceholder(
            parseInt(formData.bits),
            inputFormat
          )}
          title={`Enter ${inputFormat === "binary" ? "0s and 1s" : "0-9 and A-F"}`}
          className={hoveredOperation ? "highlight-all" : ""}
        />
        {errors.poly1 && <p className="error">{errors.poly1}</p>}
      </div>
      <div className="form-group">
  <label>Polynomial 2</label>
  <input
    type="text"
    name="poly2"
    value={formData.poly2}
    onChange={handleInputChange}
    placeholder={generatePlaceholder(
      parseInt(formData.bits),
      inputFormat
    )}
    title={`Enter ${
      inputFormat === "binary" ? "0s and 1s" : "0-9 and A-F"
    }`}
    className={`${
      hoveredOperation === "Invert" || hoveredOperation === "Modulo"
        ? "disabled-input" // Apply disabled style
        : ""
    }`}
    disabled={
      hoveredOperation === "Invert" || hoveredOperation === "Modulo"
    } // Disable the field for specific operations
  />
  {errors.poly2 && <p className="error">{errors.poly2}</p>}
</div>

      <div className="form-group">
      <label>
        Parameter <i>m</i>
      </label>
      <input
        type="text"
        name="m"
        value={formData.m}
        onChange={handleInputChange}
        placeholder="Enter an integer"
      />
    </div>
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {/* Compute Button */}
      <button
        className="compute-button"
        type="button"
        onClick={() => handleSubmit(operation)}
      >
        Compute
      </button>
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
