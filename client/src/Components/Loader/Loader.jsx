import { useEffect, useState } from "react";
import "./Loader.css";

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [hiding, setHiding] = useState(false);

  const brand = "SEQUENCE";
  const sub = "SURFACE";

  useEffect(() => {
    // Simulate loading progress
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 14 + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setHiding(true);
          setTimeout(() => {
            onComplete?.();
          }, 700);
        }, 400);
      }
      setProgress(Math.min(current, 100));
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`loader-root${hiding ? " loader-hide" : ""}`}>
      {/* Grain overlay */}
      <div className="loader-grain" />

      {/* Center content */}
      <div className="loader-center">
        {/* Brand name — letters stagger in */}
        <div className="loader-brand">
          {brand.split("").map((char, i) => (
            <span
              key={i}
              className="loader-letter"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Sub word */}
        <div className="loader-sub">
          {sub.split("").map((char, i) => (
            <span
              key={i}
              className="loader-sub-letter"
              style={{ animationDelay: `${300 + i * 50}ms` }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <p className="loader-tagline">Premium Laminates · Bangalore</p>
      </div>

      {/* Progress bar at bottom */}
      <div className="loader-progress-track">
        <div
          className="loader-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress number */}
      <div className="loader-progress-num">{Math.round(progress)}</div>
    </div>
  );
}