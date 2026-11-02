import { useEffect, useState } from "react";
import "./Loader.css";

const MIN_MS = 1400; // long enough for every sheet to be laid
const MAX_MS = 6000; // don't hold the site back if the API is slow
const EXIT_MS = 1000; // matches the sheet lift in Loader.css

const SHEETS = ["walnut", "oak", "stone", "charcoal", "gold"];

export default function Loader({ ready, onComplete }) {
  const [minPassed, setMinPassed] = useState(false);
  const [maxPassed, setMaxPassed] = useState(false);

  const hiding = minPassed && (ready || maxPassed);

  useEffect(() => {
    const min = setTimeout(() => setMinPassed(true), MIN_MS);
    const max = setTimeout(() => setMaxPassed(true), MAX_MS);

    return () => {
      clearTimeout(min);
      clearTimeout(max);
    };
  }, []);

  useEffect(() => {
    if (!hiding) return;
    const exit = setTimeout(() => onComplete?.(), EXIT_MS);
    return () => clearTimeout(exit);
  }, [hiding, onComplete]);

  return (
    <div
      className={`loader-root${hiding ? " loader-hide" : ""}`}
      role="status"
      aria-label="Loading Sequence Surfaces"
    >
      {/* Laminate sheets — laid in sequence, then lifted in sequence */}
      <div className="loader-sheets" aria-hidden="true">
        {SHEETS.map((sheet, i) => (
          <div
            key={sheet}
            className={`loader-sheet loader-sheet-${sheet}`}
            style={{ "--i": i }}
          />
        ))}
      </div>

      <div className="loader-plaque">
        <img
          className="loader-logo"
          src="https://sequencesurface.com/images/logo.png"
          alt=""
        />
        <p className="loader-tagline">Exclusive Laminate Company, Bangalore</p>
      </div>
    </div>
  );
}
