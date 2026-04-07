import React from "react";
import "./AboutUsContent.css";

const sections = [
    {
        title: "Who We Are",
        text: "Sequence Surface is a premium laminate brand offering high-quality decorative surface solutions designed to enhance modern interiors. Based in Bangalore, we are known for our innovative designs, diverse collections, and commitment to excellence—making us one of the leading and most trusted laminate providers in the city.",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    },
    {
        title: "Our Vision",
        text: "Sequence Surface is a premium laminate brand dedicated to transforming interior spaces through innovative design, superior quality, and diverse surface solutions. Our vision is to redefine modern interiors by blending aesthetics with functionality, creating timeless and inspiring environments.",
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    },
    {
        title: "Why Choose Us",
        text: "At Sequence Surface, we combine innovation, quality, and design excellence to deliver laminates that stand out in both aesthetics and performance.",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    },

    // NEW SECTIONS 👇
    {
        title: "Meet Our Founder",
        text: "Our Founder is the visionary behind Sequence Surface, bringing years of expertise in design and materials. With a passion for innovation and excellence, they have built a brand that stands for premium quality and modern aesthetics.",
        image: "https://media.licdn.com/dms/image/v2/D5603AQFAubuti-xR1Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1667441465258?e=1776902400&v=beta&t=G8lBJ8sFgbDbNZlhW7SgWupOSdGybAleg4P-TfQYLKU",
        linkedin: "https://www.linkedin.com/in/piyushlunia/",
        name: "Piyush Lunia"
    },
    {
        title: "Meet Our Managing Director",
        text: "Our Managing Director leads operations with precision and strategic vision, ensuring that Sequence Surface consistently delivers excellence across all product lines and customer experiences.",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296",
        linkedin: "https://linkedin.com/in/md-profile",
        name: "MD Name"
    },
    {
        title: "Meet Our Core Team",
        text: "Our core team is a blend of creative designers, skilled engineers, and experienced professionals who work together to bring innovative laminate solutions to life.",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
        team: true
    }
];

const AboutUsContent = () => {
    return (
        <div className="about-container">
            <h1 className="about-title">ABOUT US</h1>

            {sections.map((section, index) => (
                <div
                    key={index}
                    className={`about-section ${index % 2 !== 0 ? "reverse" : ""}`}
                >
                    <div className="about-text">
                        <h2>{section.title}</h2>
                        <p>{section.text}</p>

                        {/* LinkedIn button for Founder & MD */}
                        {section.linkedin && (
                            <a
                                href={section.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="linkedin-btn"
                            >
                                View LinkedIn
                            </a>
                        )}
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