import React from "react";
import "./AboutUsContent.css";

// ─── IMAGE HELPER ────────────────────────────────────────────────────────────
// Pass a relative path (e.g. "./assets/team.jpg") for local images,
// or a full URL (e.g. "https://...") for remote images.
// The component renders both the same way — no extra config needed.
// ─────────────────────────────────────────────────────────────────────────────

const sections = [
    // ── WHO WE ARE ──────────────────────────────────────────────────────────
    {
        title: "Who We Are",
        text: "Sequence Surface is a premium laminate brand offering high-quality decorative surface solutions designed to enhance modern interiors. Based in Bangalore, we are known for our innovative designs, diverse collections, and commitment to excellence — making us one of the leading and most trusted laminate providers in the city.",
        // Remote image (absolute URL)
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    },

    // ── OUR VISION ──────────────────────────────────────────────────────────
    {
        title: "Our Vision",
        text: "Our vision is to redefine modern interiors by blending aesthetics with functionality, creating timeless and inspiring environments. We aspire to be the most trusted surface brand across India — bridging world-class design with everyday living.",
        // Remote image (absolute URL)
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    },

    // ── OUR MOTTO ───────────────────────────────────────────────────────────
    {
        title: "Our Motto",
        motto: true,
        text: "\"Design the Surface. Define the Space.\"",
        subText:
            "Every surface tells a story. At Sequence Surface, we craft laminates that speak the language of elegance, strength, and innovation - turning ordinary walls and furniture into extraordinary statements.",
        // Local image (relative path — place the file in your /src/assets/ folder)
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    },

    // ── OUR VALUES ──────────────────────────────────────────────────────────
    {
        title: "Our Values",
        values: true,
        valuesList: [
            { icon: "◈", label: "Innovation", desc: "Pushing the boundaries of design every day." },
            { icon: "◉", label: "Quality", desc: "Zero compromise on materials and finish." },
            { icon: "◆", label: "Integrity", desc: "Honest relationships with every stakeholder." },
            { icon: "◎", label: "Sustainability", desc: "Eco-conscious processes from source to shelf." },
            { icon: "◐", label: "Customer First", desc: "Your vision is our blueprint." },
        ],
        // Local image (relative path)
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    },

    // ── WHY CHOOSE US ───────────────────────────────────────────────────────
    {
        title: "Why Choose Us",
        text: "At Sequence Surface we combine innovation, quality, and design excellence to deliver laminates that stand out in both aesthetics and performance. With 500+ design options, ISI-certified manufacturing, and a dedicated after-sales team, we are your complete surface solution partner.",
        // Remote image (absolute URL)
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    },

    // ── MEET THE FOUNDER ────────────────────────────────────────────────────
    {
        title: "Meet Our Founder and CEO",
        text: "The visionary behind Sequence Surface, bringing years of expertise in design and premium materials. With a relentless passion for innovation and excellence, our founder has built a brand that stands for quality you can see — and feel.",
        // Remote image (LinkedIn profile photo — absolute URL)
        image: "https://media.licdn.com/dms/image/v2/D5603AQFAubuti-xR1Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1667441465258?e=1776902400&v=beta&t=G8lBJ8sFgbDbNZlhW7SgWupOSdGybAleg4P-TfQYLKU",
        linkedin: "https://www.linkedin.com/in/piyushlunia/",
        name: "Piyush Lunia",
        role: "Founder and CEO",
    },

    // ── MEET THE CEO ────────────────────────────────────────────────────────
    // {
    //     title: "Meet Our CEO",
    //     text: "Our CEO brings strategic clarity and entrepreneurial energy to every decision. With a strong background in business development and brand building, they are driving Sequence Surface toward national and international growth.",
    //     // Local image (relative path — place file in /src/assets/)
    //     image: "./assets/ceo.jpg",
    //     linkedin: "https://linkedin.com/in/ceo-profile",
    //     name: "CEO Name",
    //     role: "Chief Executive Officer",
    // },

    // ── MEET THE MD ─────────────────────────────────────────────────────────
    {
        title: "Meet Our Managing Director",
        text: "Our Managing Director leads operations with precision and strategic vision, ensuring that Sequence Surface consistently delivers excellence across all product lines and customer experiences.",
        // Remote image (absolute URL)
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296",
        linkedin: "https://linkedin.com/in/md-profile",
        name: "MD Name",
        role: "Managing Director",
    },

    // ── MEET OUR INVESTOR ───────────────────────────────────────────────────
    {
        title: "Meet Our Investor",
        text: "Our lead investor brings not just capital but deep industry insight and a strong network that has accelerated Sequence Surface's growth trajectory. Their belief in our brand fuels our ambition to scale.",
        // Local image (relative path)
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
        linkedin: "https://linkedin.com/in/investor-profile",
        name: "Investor Name",
        role: "Lead Investor",
    },

    // ── MEET OUR CORE TEAM ──────────────────────────────────────────────────
    {
        title: "Meet Our Core Team",
        text: "Our core team is a blend of creative designers, skilled engineers, and experienced professionals who work together to bring innovative laminate solutions to life. United by passion, driven by purpose.",
        // Remote image (absolute URL)
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
        team: true,
        teamMembers: [
            {
                name: "Aarav Shah", role: "Head of Design",       // Local image
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
            },
            {
                name: "Meera Iyer", role: "Product Manager",       // Local image
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200"
            },
            {
                name: "Rohan Verma", role: "Sales Director",        // Remote image
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
            },
            {
                name: "Sana Kapoor", role: "Operations Lead",       // Remote image
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200"
            },
        ],
    },
];

// ─── LINKEDIN ICON SVG ───────────────────────────────────────────────────────
const LinkedInIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: "middle" }}>
        <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.98V9h3.102v1.561h.046c.434-.82 1.489-1.684 3.066-1.684 3.279 0 3.882 2.158 3.882 4.964l-.003 6.611zM5.337 7.433a1.802 1.802 0 1 1 0-3.604 1.802 1.802 0 0 1 0 3.604zm1.552 13.019H3.785V9h3.104v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

// ─── COMPONENT ──────────────────────────────────────────────────────────────
const AboutUsContent = () => {
    return (
        <div className="about-container">
            <h1 className="about-title">ABOUT US</h1>

            {sections.map((section, index) => {

                // ── VALUES SECTION (special layout) ─────────────────────────
                if (section.values) {
                    return (
                        <div key={index} className={`about-section ${index % 2 !== 0 ? "reverse" : ""}`}>
                            <div className="about-text">
                                <h2>{section.title}</h2>
                                <ul className="values-list">
                                    {section.valuesList.map((v, i) => (
                                        <li key={i} className="value-item">
                                            <span className="value-icon">{v.icon}</span>
                                            <div>
                                                <strong className="value-label">{v.label}</strong>
                                                <p className="value-desc">{v.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="about-image">
                                <img src={section.image} alt={section.title} />
                            </div>
                        </div>
                    );
                }

                // ── MOTTO SECTION (special callout) ─────────────────────────
                if (section.motto) {
                    return (
                        <div key={index} className="motto-section">
                            <div className="motto-text">
                                <h2>{section.title}</h2>
                                <blockquote className="motto-quote">{section.text}</blockquote>
                                <p className="motto-subtext">{section.subText}</p>
                            </div>
                            <div className="about-image motto-image">
                                <img src={section.image} alt={section.title} />
                            </div>
                        </div>
                    );
                }

                // ── TEAM SECTION (grid of members) ──────────────────────────
                if (section.team) {
                    return (
                        <div key={index} className={`about-section ${index % 2 !== 0 ? "reverse" : ""}`}>
                            <div className="about-text">
                                <h2>{section.title}</h2>
                                <p>{section.text}</p>
                                <div className="team-grid">
                                    {section.teamMembers.map((member, i) => (
                                        <div key={i} className="team-card">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="team-avatar"
                                            />
                                            <p className="team-name">{member.name}</p>
                                            <p className="team-role">{member.role}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="about-image">
                                <img src={section.image} alt={section.title} />
                            </div>
                        </div>
                    );
                }

                // ── DEFAULT SECTION ──────────────────────────────────────────
                return (
                    <div
                        key={index}
                        className={`about-section ${index % 2 !== 0 ? "reverse" : ""}`}
                    >
                        <div className="about-text">
                            <h2>{section.title}</h2>
                            {section.role && (
                                <p className="person-role">{section.role}</p>
                            )}
                            <p className="person-role">{section.name}</p>
                            <p>{section.text}</p>

                            {section.linkedin && (
                                <a
                                    href={section.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="linkedin-btn"
                                >
                                    <div className="aboutus-icon-linkedin">
                                    <LinkedInIcon /></div> &nbsp;View LinkedIn
                                    
                                </a>
                            )}
                        </div>

                        <div className="about-image">
                            {/* Works for both local (./assets/...) and remote (https://...) paths */}
                            <img src={section.image} alt={section.title} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AboutUsContent;