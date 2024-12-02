import React from "react";
import Card from "../components/Card";
import "./HomePage.css";

const HomePage = () => {
  const teamMembers = [
    {
      name: "Pia Maria Chedid",
      image: "/images/pia.jpg",
      quote: "Encryption is the key to privacy.",
      size: { width: "300px", height: "200px" },
      color: "#ffcccc",
    },
    {
      name: "Hawraa Khalil",
      image: "/images/hawraa.jpg",
      quote: "Look for the lock 👀🔒",
      size: { width: "300px", height: "200px" },
      color: "#ccffcc",
    },
    {
      name: "Stefanie Samaha",
      image: "/images/stefanie.jpg",
      quote: "Secure your data, secure your world.",
      size: { width: "300px", height: "200px" },
      color: "#ccccff",
    },
    {
      name: "Ruba El Houssami",
      image: "/images/ruba.jpg",
      quote: "Encryption is trust in the digital age.",
      size: { width: "300px", height: "200px" },
      color: "#717fb5",
    },
    {
      name: "Lea Azar",
      image: "/images/lea.jpg",
      quote: "Unlock to find our work! 🔓",
      size: { width: "300px", height: "200px" },
      color: "#ffccff",
    },
    {
      name: "Rend Chamas",
      image: "/images/rend.jpg",
      quote: "Privacy is a right, encryption ensures it.",
      size: { width: "300px", height: "200px" },
      color: "#ccffff",
    },
  ];

  return (
    <div className="homepage">
      <h1 className="Decrypt-title">Decrypt Our Team</h1>
      <div className="cards-container">
        {teamMembers.map((member, index) => (
          <Card
            key={index}
            name={member.name}
            image={member.image}
            quote={member.quote}
            size={member.size}
            color={member.color}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
