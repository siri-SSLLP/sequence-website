import React from "react";
import "./AboutUsContent.css";

const sections = [
    {
        title: "Who We Are",
        text: "Sequence Surface is a premium laminate brand offering high-quality decorative surface solutions designed to enhance modern interiors. Based in Bangalore, we are known for our innovative designs, diverse collections, and commitment to excellence-making us one of the leading and most trusted laminate providers in the city.",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    },
    {
        title: "Our Vision",
        text: "Sequence Surface is a premium laminate brand dedicated to transforming interior spaces through innovative design, superior quality, and diverse surface solutions. Our vision is to redefine modern interiors by blending aesthetics with functionality, creating timeless and inspiring environments. Driven by a commitment to excellence, our mission is to deliver durable, high-quality laminates that cater to architects, designers, and customers alike, while continuously evolving with new textures, finishes, and trends. We value craftsmanship, innovation, customer trust, and sustainability, ensuring every surface we create reflects both style and reliability.",
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    },
    {
        title: "Why Choose Us",
        text: "At Sequence Surface, we combine innovation, quality, and design excellence to deliver laminates that stand out in both aesthetics and performance. Our wide range of textures, finishes, and collections ensures the perfect solution for every space, while our commitment to durability and precision guarantees long-lasting results. With a strong focus on customer satisfaction, trend-driven designs, and reliable service, we provide not just surfaces-but complete design experiences you can trust.",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    },
];

const AboutUsContent = () => {
    return (
        <div className="about-container">
            <h1 className="about-title">ABOUT US</h1>

            {sections.map((section, index) => (
                <div
                    key={index}
                    className={`about-section ${index % 2 !== 0 ? "reverse" : ""
                        }`}
                >
                    <div className="about-text">
                        <h2>{section.title}</h2>
                        <p>{section.text}</p>
                    </div>

                    <div className="about-image">
                        <img src={section.image} alt={section.title} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AboutUsContent;