import React from "react";
import "./Theme.css";
import { exploreThemes } from "../../assets/assets";
import { Link } from "react-router-dom";

const ExploreTheme = () => {
    return (
        <div className="theme-container">

            {/* TITLE */}
            <h2 className="theme-title">Explore by Theme</h2>

            {/* GRID */}
            <div className="theme-grid">
                {exploreThemes.map((item, index) => (
                    <Link className="theme-name-link" to={`/theme ${item.name}`}>
                        <div className="theme-card" key={index}>
                            <img
                                src={`${item.image}?auto=format&fit=crop&w=700&q=80`}
                                alt={item.name}
                            />  
                            <p className="theme-name">{item.name}</p>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
};

export default ExploreTheme;