import React from "react";
import "./Card.css";

const Card = ({ name, image, quote, size, color }) => {
  const cardStyle = {
    backgroundColor: color,
  };

  return (
    <div className="card" style={cardStyle}>
      <div className="card-inner">
        {/* Front of the Card */}
        <div className="card-front">
          <div className="card-image">
            <img src={image} alt={name} />
          </div>
          <div className="card-name">
            <p className="name">{name}</p>
          </div>
        </div>
        {/* Back of the Card */}
        <div className="card-back">
          <p className="quote">{quote}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
