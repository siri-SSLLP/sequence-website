import React, { useState, useRef } from "react";
import "./LovedSection.css";
import { product } from "../../assets/assets";
import { Link } from "react-router-dom";

const categories = [
    "All",
    "Decorative Laminates",
    "Textured Laminates",
    "Solid Color Laminates",
    "High Gloss Laminates",
];

const LovedSection = () => {
    const [activeTab, setActiveTab] = useState("All");
    const sliderRef = useRef(null);

    const scrollLeft = () => {
        sliderRef.current.scrollBy({
            left: -300,
            behavior: "smooth",
        });
    };

    const scrollRight = () => {
        sliderRef.current.scrollBy({
            left: 300,
            behavior: "smooth",
        });
    };

    const filteredProducts =
        activeTab === "All"
            ? product
            : product.filter(
                (item) => item.parentCategory?.name === activeTab
            );

    return (
        <div className="product-section">
            <h2 className="title">Our Most Loved Materials</h2>

            {/* Tabs */}
            <div className="tabs">
                {categories.map((cat, index) => (
                    <button
                        key={index}
                        className={`tab-btn ${activeTab === cat ? "active" : ""}`}
                        onClick={() => setActiveTab(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Slider Wrapper */}
            <div className="slider-wrapper">

                {/* Left Button */}
                <button className="slider-btn left" onClick={scrollLeft}>
                    ‹
                </button>

                {/* Slider */}
                <div className="slider" ref={sliderRef}>
                    {filteredProducts.map((item, index) => {
                        const discountPrice = item.mrpPrice
                            ? item.mrpPrice - (item.mrpPrice * (item.mrpDiscount || 0)) / 100
                            : 0;

                        return (
                            <Link className="loved-link" to={`/${item.productName}`} key={index}>
                                <div className="card">
                                    <div className="image-wrapper">
                                        <img
                                            src={
                                                item.imageUrl ||
                                                "https://imagesm.plexussquare.in/SEQUENCE/Images/23-06-2025/1750683878302.jpg"
                                            }
                                            alt={item.productName}
                                        />
                                    </div>

                                    <div className="card-body">
                                        <p className="name">{item.productName}</p>

                                        <div className="price">
                                            <span className="new">
                                                ₹{Math.round(discountPrice)}
                                            </span>

                                            {item.mrpDiscount && (
                                                <>
                                                    <span className="old">
                                                        ₹{item.mrpPrice}
                                                    </span>
                                                    <span className="off">
                                                        {item.mrpDiscount}% OFF
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Right Button */}
                <button className="slider-btn right" onClick={scrollRight}>
                    ›
                </button>
            </div>
        </div>
    );
};

export default LovedSection;