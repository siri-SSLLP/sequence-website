
import React, { useRef, useState } from "react";
import "./NewLaunch.css";
import { product } from "../../assets/assets.js";
import { Link } from "react-router-dom";

const NewLaunch = () => {
  const scrollRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);

  const DOTS = 4;
  const CARD_WIDTH = 208; // 190px + 18px gap

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -CARD_WIDTH * 3, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: CARD_WIDTH * 3, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const progress = el.scrollLeft / maxScroll;
    setActiveDot(Math.round(progress * (DOTS - 1)));
  };

  const goToPage = (idx) => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: (idx / (DOTS - 1)) * maxScroll, behavior: "smooth" });
  };

  return (
    <section className="nl-section">

      {/* Top accent line rendered in CSS ::before */}

      {/* Background mandala watermark */}
      <svg className="nl-bg-motif" viewBox="0 0 300 300" fill="none" aria-hidden="true">
        <circle cx="150" cy="150" r="140" stroke="#BF7A38" strokeWidth="1.2" />
        <circle cx="150" cy="150" r="105" stroke="#BF7A38" strokeWidth=".7" />
        <circle cx="150" cy="150" r="70" stroke="#BF7A38" strokeWidth="1" />
        <path d="M150 10L153 55 150 100 147 55Z" fill="#BF7A38" opacity=".7" />
        <path d="M150 200L153 245 150 290 147 245Z" fill="#BF7A38" opacity=".7" />
        <path d="M10 150L55 153 100 150 55 147Z" fill="#BF7A38" opacity=".7" />
        <path d="M200 150L245 153 290 150 245 147Z" fill="#BF7A38" opacity=".7" />
        <path d="M150 30Q175 80 150 108Q125 80 150 30Z" fill="#BF7A38" opacity=".5" />
        <path d="M150 270Q175 220 150 192Q125 220 150 270Z" fill="#BF7A38" opacity=".5" />
        <path d="M30 150Q80 175 108 150Q80 125 30 150Z" fill="#BF7A38" opacity=".5" />
        <path d="M270 150Q220 175 192 150Q220 125 270 150Z" fill="#BF7A38" opacity=".5" />
        <circle cx="150" cy="150" r="22" fill="#BF7A38" opacity=".4" />
        <path
          d="M133 133L167 133L167 167L133 167Z"
          stroke="#BF7A38" strokeWidth=".8" fill="none"
          transform="rotate(45 150 150)"
        />
      </svg>

      <div className="nl-inner">

        {/* ── Header ── */}
        <div className="nl-head">
          <div className="nl-head-text">
            <div className="nl-eyebrow">
              <span className="nl-eyebrow-line" />
              Newly Launched
              <span className="nl-eyebrow-line" />
            </div>
            <h2 className="nl-title">
              Exclusive <em>Laminates</em> <span className="rotating-star" aria-hidden="true">✦</span>
            </h2>
            <p className="nl-subtitle">Inspired from Indian Folk Art &amp; Heritage Craft</p>
          </div>

          <div className="nl-meta">
            {/* <span className="nl-pill nl-pill--dark">New Collection</span> */}
            {/* <span className="nl-star" aria-hidden="true">✦</span> */}
            <span className="nl-pill nl-pill--outline">2026 Edition</span>
          </div>
        </div>

        {/* ── Carousel ── */}
        <div className="nl-wrap">
          <div className="nl-fade nl-fade--left" aria-hidden="true" />
          <div className="nl-fade nl-fade--right" aria-hidden="true" />

          <div
            className="nl-track"
            ref={scrollRef}
            onScroll={handleScroll}
          >
            {product.map((data, key) => (
              <div className="nl-card" key={key} style={{ animationDelay: `${key * 0.06}s` }}>
                <Link to={`/product/${data.productId}`} key={key}>
                  <div className="nl-card-img">
                    <img
                      src={data.imageUrl}
                      alt={data.productName}
                      className="nl-card-img-inner"
                    />
                    <span className="nl-card-badge">New</span>
                  </div>
                  <div className="nl-card-body">
                    {data.series && (
                      <div className="nl-card-series">{data.series}</div>
                    )}
                    <div className="nl-card-name">{data.productName}</div>
                    <span style={{ color: "gray", fontSize: "12px" }}>{data.descriptionShort}</span>
                    {data.code && (
                      <div className="nl-card-code">{data.code}</div>
                    )}

                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer controls ── */}
        <div className="nl-controls">
          <div className="nl-dots">
            {Array.from({ length: DOTS }).map((_, i) => (
              <button
                key={i}
                className={`nl-dot${activeDot === i ? " nl-dot--active" : ""}`}
                onClick={() => goToPage(i)}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
          <div className="nl-arrows">
            <button className="nl-arrow" onClick={scrollLeft} aria-label="Scroll left">&#8592;</button>
            <button className="nl-arrow" onClick={scrollRight} aria-label="Scroll right">&#8594;</button>
          </div>
        </div>

        <div className="nl-divider" />

        <div className="nl-cta">
          <button className="nl-cta-btn">View All Designs</button>
          <button className="nl-cta-link">Download Catalogue &#8594;</button>
        </div>

      </div>
    </section>
  );
};

export default NewLaunch;