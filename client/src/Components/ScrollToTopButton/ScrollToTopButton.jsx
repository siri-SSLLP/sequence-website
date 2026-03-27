import React, { useEffect, useState } from "react";
import "./ScrollToTopButton.css";
import { GrLinkTop } from "react-icons/gr";
import { FaArrowUp } from "react-icons/fa";


const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);

    // 👇 Show button after scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 👇 Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {showButton && (
                <button className="scroll-top-btn" onClick={scrollToTop}>
                    {/* ↑ */}
                    {/* <GrLinkTop /> */}
                    <FaArrowUp />

                </button>
            )}
        </>
    );
};

export default ScrollToTopButton;