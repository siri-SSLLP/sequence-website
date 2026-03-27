import "./MaintenanceGuide.css";
import React from "react";



import {
  FaSun,
  FaWater,
  FaShieldAlt,
  FaTools,
  FaExclamationTriangle,
  FaDownload,
} from "react-icons/fa";

// 👉 import your PDF (put it inside /assets folder)
import carePDF from "../../assets/Sequence_Surfaces_Care.pdf";

const sections = [
  {
    title: "Routine Care",
    icon: <FaWater />,
    content: [
      "Regular dusting with microfiber cloth",
      "Use damp cloth weekly (avoid excess water)",
      "Clean corners using soft brush",
    ],
  },
  {
    title: "Prevent Spills",
    icon: <FaShieldAlt />,
    content: [
      "Use coasters & table covers",
      "Avoid heat appliances near laminates",
      "Protect from moisture exposure",
    ],
  },
  {
    title: "Avoid Chemicals",
    icon: <FaExclamationTriangle />,
    content: [
      "No bleach or harsh cleaners",
      "Avoid hydrogen peroxide",
      "No acid-based cleaners",
    ],
  },
  {
    title: "Sunlight Protection",
    icon: <FaSun />,
    content: [
      "Avoid direct sunlight exposure",
      "Prevents fading & distortion",
    ],
  },
  {
    title: "Handling & Storage",
    icon: <FaTools />,
    content: [
      "Always lift laminates (don’t slide)",
      "Store flat on level surface",
      "Maintain proper temperature & humidity",
    ],
  },
];

const MaintenanceGuide = () => {
  return (
    <div className="care-page">

      {/* HERO */}
      <div className="care-hero">
        <h1>Care & Maintenance</h1>
        <p>Keep your laminates looking new for years</p>

        {/* DOWNLOAD BUTTON */}
        <a href={carePDF} download className="download-btn">
          <FaDownload /> Download Full Guide
        </a>
      </div>

      {/* GRID */}
      <div className="care-grid">
        {sections.map((item, index) => (
          <div className="care-card" key={index}>
            <div className="care-icon">{item.icon}</div>
            <h2>{item.title}</h2>
            <ul>
              {item.content.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* WARNING */}
      <div className="care-warning">
        <h2>⚠ Important Warning</h2>
        <p>
          Bleach and strong chemicals can permanently damage laminate surfaces.
          Always use mild cleaners.
        </p>
      </div>
    </div>
  );
};

export default MaintenanceGuide;