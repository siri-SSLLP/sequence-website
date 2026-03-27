import './Inspiration.css'
import React, { useState, useRef } from "react";
import { inspirationCategory } from "../../assets/assets";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Inspiration = () => {

    const [activeCategory, setActiveCategory] = useState("Living Room");
    const sliderRef = useRef(null);

    const selectedCategory = inspirationCategory.find(
        (cat) => cat.name === activeCategory
    );

    // 👉 Scroll Functions
    const scrollLeft = () => {
        sliderRef.current.scrollBy({
            left: -300,
            behavior: "smooth"
        });
    };

    const scrollRight = () => {
        sliderRef.current.scrollBy({
            left: 300,
            behavior: "smooth"
        });
    };

    return (
        <div className="insp-container">
            {/* TITLE */}
            <h2 className="insp-title">Inspirational and Stunning Designs</h2>
            {/* CATEGORY TABS */}
            <div className="insp-tabs">
                {inspirationCategory.map((cat) => (
                    <button
                        key={cat.name}
                        className={`insp-tab ${activeCategory === cat.name ? "active" : ""}`}
                        onClick={() => setActiveCategory(cat.name)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
            {/* SLIDER WRAPPER */}
            <div className="insp-slider-wrapper">
                {/* LEFT BUTTON */}
                <button className="insp-arrow left" onClick={scrollLeft}>
                    <FaChevronLeft />
                </button>
                {/* IMAGE SLIDER */}
                <div className="insp-slider" ref={sliderRef}>
                    {selectedCategory.images.map((img, index) => (
                        <div className="insp-card" key={index}>
                            <img src={`${img}?auto=format&fit=crop&w=800&q=80`} alt="" />
                            <div className="insp-overlay">
                                {/* <p>Modern Design {index + 1}</p> */}
                            </div>
                        </div>
                    ))}
                </div>
                {/* RIGHT BUTTON */}
                <button className="insp-arrow right" onClick={scrollRight}>
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
};

export default Inspiration;