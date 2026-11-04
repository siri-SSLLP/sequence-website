import React from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'

// Home page banner. Each slide has its own interior photo and leads to the
// matching collection; the category names match the products' parentCategory.
const photo = (id, width) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`

const slides = [
    {
        photoId: "1615529182904-14819c35db37",
        eyebrow: "Sequence Surfaces",
        title: "Surfaces crafted for the way you live",
        text: "Premium laminates for kitchens, wardrobes, walls and furniture, from Bangalore's trusted laminate house.",
        cta: "Explore Collections",
        alt: "Warm living room with a grey sofa and pendant lights",
        secondary: { label: "Visit Store", to: "/visit-store" },
    },
    {
        photoId: "1507089947368-19c1da9775ae",
        eyebrow: "High Gloss Laminates",
        title: "A mirror finish that lights up the room",
        text: "Glossy, easy-clean surfaces that bring depth and shine to modern kitchens.",
        cta: "Shop High Gloss",
        category: "High Gloss Laminates",
        alt: "Bright white kitchen with glossy cabinets and an island",
    },
    {
        photoId: "1617806118233-18e1de247200",
        eyebrow: "Decorative Laminates",
        title: "Designs that set the mood",
        text: "Patterns, stones and statement looks for spaces that deserve a second glance.",
        cta: "Shop Decorative",
        category: "Decorative Laminates",
        alt: "Dining room with green velvet chairs and a round mirror",
    },
    {
        photoId: "1600585152220-90363fe7e115",
        eyebrow: "Textured Laminates",
        title: "Feel the grain, not just see it",
        text: "Wood and stone textures with real depth for kitchens, wardrobes and doors.",
        cta: "Shop Textured",
        category: "Textured Laminates",
        alt: "Kitchen with wood-grain cabinets and a white island",
    },
    {
        photoId: "1600494603989-9650cf6ddd3d",
        eyebrow: "Solid Color Laminates",
        title: "Bold colour, clean lines",
        text: "Calm whites to deep greens in finishes that stay true for years.",
        cta: "Shop Solid Colours",
        category: "Solid Color Laminates",
        alt: "Study with a deep green wall, desk and plants",
    },
]

const Hero = () => {
    return (
        <>
            <div className="carousel container-fluid">
                <div
                    id="carouselExample"
                    className="carousel slide"
                    data-bs-ride="carousel"
                >

                    {/* Indicators (Dots) */}
                    <div className="carousel-indicators">
                        {slides.map((slide, i) => (
                            <button
                                key={slide.photoId}
                                type="button"
                                data-bs-target="#carouselExample"
                                data-bs-slide-to={i}
                                className={i === 0 ? "active" : ""}
                                aria-label={`Slide ${i + 1}: ${slide.eyebrow}`}
                            ></button>
                        ))}
                    </div>

                    <div className="carousel-inner">
                        {slides.map((slide, i) => (
                            <div key={slide.photoId} className={`carousel-item hero-slide${i === 0 ? " active" : ""}`}>
                                <img
                                    src={photo(slide.photoId, 1600)}
                                    srcSet={`${photo(slide.photoId, 800)} 800w, ${photo(slide.photoId, 1600)} 1600w, ${photo(slide.photoId, 2400)} 2400w`}
                                    sizes="100vw"
                                    className="d-block w-100 carousel-img"
                                    alt={slide.alt}
                                    fetchPriority={i === 0 ? "high" : "auto"}
                                />
                                <div className="hero-caption">
                                    <span className="hero-eyebrow">{slide.eyebrow}</span>
                                    <h2 className="hero-title">{slide.title}</h2>
                                    <p className="hero-text">{slide.text}</p>
                                    <div className="hero-actions">
                                        <Link
                                            to="/products"
                                            state={slide.category ? { category: slide.category } : undefined}
                                            className="hero-btn"
                                        >
                                            {slide.cta}
                                        </Link>
                                        {slide.secondary && (
                                            <Link to={slide.secondary.to} className="hero-btn hero-btn--ghost">
                                                {slide.secondary.label}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Previous Button */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide="prev"
                        aria-label="Previous slide"
                    >
                        <span className="carousel-control-prev-icon"></span>
                    </button>

                    {/* Next Button */}
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide="next"
                        aria-label="Next slide"
                    >
                        <span className="carousel-control-next-icon"></span>
                    </button>

                </div>
            </div>
        </>
    )
}

export default Hero
