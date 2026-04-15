// Blog.jsx  — Sequence Surface
// Requires: react-router-dom v6
// Install:  npm install react-router-dom

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./Blog.css";

// ─── Blog data ────────────────────────────────────────────────────────────────
export const BLOGS = [
    {
        id: 1,
        slug: "how-to-choose-the-right-laminate-for-your-home",
        title: "How to Choose the Right Laminate for Every Room in Your Home",
        excerpt:
            "Not all laminates are created equal. From moisture-resistant options for kitchens to high-traffic grades for living areas, here's how to match the right surface to every space.",
        thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
        date: "April 10, 2025",
        readTime: "6 min read",
        content: `
      <p>Choosing a laminate surface sounds simple — until you're standing in a showroom facing hundreds of finishes, textures, and grades. The good news is that the decision becomes much easier once you understand the key variables: wear rating, moisture resistance, and aesthetic compatibility.</p>
      <h2>Understanding Wear Ratings (AC Grade)</h2>
      <p>Laminates are rated on the AC (Abrasion Class) scale from AC1 to AC5. AC3 is suitable for most residential spaces; AC4 and AC5 are built for heavy foot traffic and commercial environments. For a busy family home, we recommend nothing below AC3.</p>
      <h2>Kitchens & Bathrooms: Moisture Is the Enemy</h2>
      <p>Standard laminates will warp and swell if exposed to standing water. In wet zones, opt for laminates with a swollen edge prevention (SEP) core or a fully waterproof HDF core. Look for products with an IP rating specifically designed for kitchens and bathrooms.</p>
      <h2>Living Areas & Bedrooms</h2>
      <p>These spaces reward aesthetics. Wider planks in woodgrain or stone-effect finishes add a sense of scale and luxury. Matte and brushed surfaces hide everyday dust better than high-gloss finishes.</p>
      <h2>The Sequence Surface Approach</h2>
      <p>Every product in the Sequence Surface range is designed with end-use in mind. Our in-store consultants can help you match the right grade, texture, and finish to your specific space — because the right surface isn't just beautiful, it performs for decades.</p>
    `,
    },
    {
        id: 2,
        slug: "laminate-vs-hardwood-vs-vinyl",
        title: "Laminate vs Hardwood vs Vinyl: Which Surface Is Right for You?",
        excerpt:
            "Three popular flooring materials, three very different trade-offs. We break down cost, durability, maintenance, and aesthetics so you can decide with confidence.",
        thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        date: "April 2, 2025",
        readTime: "8 min read",
        content: `
      <p>The flooring market has never had more options — which makes the decision harder, not easier. Laminate, hardwood, and luxury vinyl plank (LVP) each have genuine strengths. The right choice depends on your budget, lifestyle, and the specific room you're surfacing.</p>
      <h2>Hardwood: Timeless but Demanding</h2>
      <p>Real hardwood is a long-term investment. It can be sanded and refinished multiple times over its lifespan, and it adds genuine resale value to a home. The downside: it's expensive, susceptible to humidity changes, and requires regular maintenance.</p>
      <h2>Luxury Vinyl Plank: Waterproof and Wallet-Friendly</h2>
      <p>LVP has improved dramatically in the past decade. It's fully waterproof, softer underfoot than laminate, and available in convincing wood and stone looks. It's an excellent choice for bathrooms and basements. However, it cannot be refinished and may not feel as premium underfoot as the alternatives.</p>
      <h2>Laminate: The Balanced Choice</h2>
      <p>Modern high-pressure laminate (HPL) sits in a compelling middle ground. It replicates the look of wood, stone, or concrete with outstanding accuracy, is significantly more scratch- and stain-resistant than hardwood, and costs a fraction of the price. Today's laminate — particularly in the 8mm–12mm thickness range — also offers substantial acoustic benefits.</p>
      <h2>Our Recommendation</h2>
      <p>For most Indian homes — where dust, humidity, and heavy foot traffic are daily realities — premium laminate is the most practical and cost-effective long-term surface. Sequence Surface's range is engineered specifically for these conditions.</p>
    `,
    },
    {
        id: 3,
        slug: "interior-design-trends-2025-surfaces",
        title: "Surface Trends Dominating Indian Interiors in 2025",
        excerpt:
            "From fluted panels and terrazzo-effect laminates to warm neutrals and stone-like textures, here's what India's top interior designers are specifying this year.",
        thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
        date: "March 25, 2025",
        readTime: "7 min read",
        content: `
      <p>Interior design in India is in the middle of a quiet revolution. After years of cool greys and high-gloss whites, designers are moving towards warmth, texture, and materiality. Surfaces — walls, floors, cabinetry — are the canvas this shift is being painted on.</p>
      <h2>Warm Neutrals Are Taking Over</h2>
      <p>The grey decade is over. In 2025, warm taupes, soft terracottas, sandy beiges, and creamy off-whites are the dominant palette in high-end residential projects. Laminates in warm oak, walnut, and teak tones are flying off shelves.</p>
      <h2>Texture Is the New Colour</h2>
      <p>Fluted and ribbed surfaces — applied to walls, island panels, and wardrobe shutters — create depth and shadow play without adding colour complexity. Our woodgrain laminates with synchronized embossing (where the texture aligns with the printed grain) are particularly popular for this application.</p>
      <h2>Stone-Effect Surfaces in Unexpected Places</h2>
      <p>Marble and slate effects have moved beyond bathroom walls. Designers are using stone-look laminates on kitchen cabinets, TV unit panels, and even headboards — giving the visual weight of natural stone without the cost or fragility.</p>
      <h2>Sustainable Materials in the Conversation</h2>
      <p>Clients are increasingly asking about the environmental credentials of their surfaces. At Sequence Surface, all our laminates are produced in compliance with E1 formaldehyde emission standards and are manufactured under ISO-certified processes.</p>
    `,
    },
    {
        id: 4,
        slug: "laminate-maintenance-care-guide",
        title: "The Complete Guide to Caring for Your Laminate Surfaces",
        excerpt:
            "Laminate is low-maintenance — but not no-maintenance. Follow these simple practices to keep your surfaces looking showroom-fresh for years.",
        thumbnail: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
        date: "March 17, 2025",
        readTime: "5 min read",
        content: `
      <p>One of the biggest advantages of laminate surfaces is how little they ask of you. Unlike natural wood or stone, laminate doesn't need sealing, oiling, or polishing. But a few straightforward habits will significantly extend the life and appearance of your surfaces.</p>
      <h2>Daily Cleaning</h2>
      <p>A dry or slightly damp microfibre cloth is all you need for routine cleaning. Avoid soaking the surface — excess water can seep into seams and cause edge-swelling over time, particularly on older installations.</p>
      <h2>Dealing with Stains</h2>
      <p>Most common stains — tea, coffee, turmeric, oil — wipe off laminate surfaces effortlessly. For stubborn marks, a mild household cleaner on a damp cloth works well. Never use abrasive pads, bleach, or solvent-based cleaners, as these can damage the wear layer.</p>
      <h2>Protecting Against Scratches</h2>
      <p>While modern laminates are highly scratch-resistant, heavy dragging of furniture across the surface will eventually leave marks. Use felt pads under chair legs and furniture feet. In high-traffic areas, a thin rug or runner can extend the surface's life further.</p>
      <h2>What to Avoid</h2>
      <p>Direct heat is laminate's main enemy. Always use trivets or heat pads under hot pans and appliances. While laminate won't catch fire, prolonged high heat can discolour the surface permanently.</p>
    `,
    },
    {
        id: 5,
        slug: "kitchen-cabinet-laminate-guide",
        title: "Designing Kitchen Cabinets with Laminate: A Practical Guide",
        excerpt:
            "Kitchen laminates face grease, heat, moisture, and constant handling. We walk you through the specifications, finishes, and design strategies that work.",
        thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
        date: "March 10, 2025",
        readTime: "9 min read",
        content: `
      <p>The kitchen is the most demanding environment in any home — and the most visible. Getting the laminate selection right here means balancing aesthetics with serious functional requirements.</p>
      <h2>What Makes a Kitchen-Grade Laminate</h2>
      <p>Kitchen laminates need to withstand heat from appliances, grease splatter, constant wiping, and humidity from cooking steam. Look for laminates with a post-forming grade (PF), which can be bent around curved edges, and a minimum 0.8mm thickness for shutters and 1mm for horizontal surfaces like countertops.</p>
      <h2>Matte vs Gloss Finishes in Kitchens</h2>
      <p>High-gloss finishes look stunning in photographs but show every fingerprint and water mark in daily use. Matte and silk-finish laminates are far more practical for kitchen environments — they're fingerprint-resistant, easier to clean, and still look premium when installed well.</p>
      <h2>Colour Strategy for Small vs Large Kitchens</h2>
      <p>In smaller kitchens, light tones — warm whites, light greys, pale woods — visually open the space. Reserve darker, bolder tones (deep navy, charcoal, dark walnut) for large kitchens or as a contrasting island colour in an otherwise light scheme.</p>
      <h2>Combining Materials</h2>
      <p>The most interesting kitchen designs mix laminates with other materials. A stone-effect laminate on the island paired with a matte wood-tone on wall units creates visual depth without complexity. Sequence Surface's design team can help you build these combinations from our full range.</p>
    `,
    },
    {
        id: 6,
        slug: "wardrobe-laminate-finishes-guide",
        title: "How to Pick the Perfect Laminate Finish for Your Wardrobe",
        excerpt:
            "Wardrobes are the backdrop of your bedroom. Here's how to choose finishes that age gracefully, resist daily wear, and complement your overall interior.",
        thumbnail: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
        date: "March 3, 2025",
        readTime: "6 min read",
        content: `
      <p>A well-designed wardrobe does more than store clothes — it anchors the entire bedroom aesthetic. Laminate is the dominant surface material for wardrobes in India, and for good reason: it's durable, available in hundreds of finishes, and far more practical than paint or veneer for door shutters.</p>
      <h2>The Case for Matte Finishes</h2>
      <p>Matte laminates have become the interior designer's default for wardrobes. They're tactile, sophisticated, and forgiving of light scratches. In a bedroom environment where you're touching the surfaces multiple times a day, matte finishes simply look better over time than glossy alternatives.</p>
      <h2>Matching Your Wardrobe to the Room</h2>
      <p>The safest approach is to pull a tone from elsewhere in the bedroom — your wall colour, your bedframe, your flooring — and echo it in your wardrobe laminate. This creates visual continuity without the room feeling too matchy. The contrast comes from texture, not colour.</p>
      <h2>Handle-Free Designs and Profile Laminates</h2>
      <p>Handle-free wardrobes (using J-pull or groove profiles routed directly into the shutter) are increasingly popular. These designs require laminates that machine cleanly and hold an edge well. Our HPL range is specifically suited for CNC routing and edge-profiling work.</p>
      <h2>Durability Considerations</h2>
      <p>Wardrobe laminates see less abuse than floors or kitchen surfaces, but shutter edges are vulnerable. Always specify edge-banded shutters using a matching or complementary ABS edge tape for a clean, durable finish that won't delaminate.</p>
    `,
    },
];

// ─── Blog Card ────────────────────────────────────────────────────────────────
function BlogCard({ blog }) {
    const navigate = useNavigate();

    return (
        <article className="blog-card" onClick={() => navigate(`/blog/${blog.slug}`)}>
            <div className="blog-card__image-wrap">
                <img src={blog.thumbnail} alt={blog.title} className="blog-card__image" loading="lazy" />
            </div>
            <div className="blog-card__body">
                <div className="blog-card__meta">
                    <span>{blog.date}</span>
                    <span className="blog-card__dot">·</span>
                    <span>{blog.readTime}</span>
                </div>
                <h2 className="blog-card__title">{blog.title}</h2>
                <p className="blog-card__excerpt">{blog.excerpt}</p>
                <div className="blog-card__footer">
                    <span className="blog-card__read-link">
                        Read article <span className="blog-card__arrow">→</span>
                    </span>
                </div>
            </div>
        </article>
    );
}

// ─── /blog  — Listing page ────────────────────────────────────────────────────
export function BlogListing() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <div className="blog-listing">
            <header className="blog-listing__hero">
                <div className="blog-listing__hero-inner">
                    <p className="blog-listing__hero-label">Surfaces &amp; Spaces</p>
                    <h1 className="blog-listing__hero-title">Ideas, Guides &amp; Inspiration</h1>
                    <p className="blog-listing__hero-sub">
                        Expert advice on laminates, interiors, and making the most of every surface in your home.
                    </p>
                </div>
            </header>

            <div className="blog-listing__grid">
                {BLOGS.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>
        </div>
    );
}

// ─── /blog/:slug  — Single post page ─────────────────────────────────────────
export function BlogPost() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const blog = BLOGS.find((b) => b.slug === slug);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [slug]);

    if (!blog) {
        return (
            <div className="blog-not-found">
                <h2>Post not found</h2>
                <button className="blog-post__back" onClick={() => navigate("/blog")}>
                    ← Back to Blog
                </button>
            </div>
        );
    }

    const related = BLOGS.filter((b) => b.id !== blog.id).slice(0, 3);

    return (
        <div className="blog-post">
            {/* Breadcrumb */}
            <div className="blog-post__breadcrumb">
                <Link className="blog-post__back" to="/blog">← Back to Blog</Link>
                <span className="blog-post__breadcrumb-sep">/</span>
                <span className="blog-post__breadcrumb-title">{blog.title}</span>
            </div>

            {/* Hero image */}
            <div className="blog-post__hero">
                <img src={blog.thumbnail} alt={blog.title} className="blog-post__hero-img" />
            </div>

            {/* Article */}
            <article className="blog-post__article">
                <header className="blog-post__header">
                    <div className="blog-post__meta">
                        <span>{blog.date}</span>
                        <span className="blog-card__dot">·</span>
                        <span>{blog.readTime}</span>
                    </div>
                    <h1 className="blog-post__title">{blog.title}</h1>
                </header>

                <div
                    className="blog-post__content"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </article>

            {/* Related posts */}
            {related.length > 0 && (
                <section className="blog-related">
                    <h3 className="blog-related__title">You might also like</h3>
                    <div className="blog-related__grid">
                        {related.map((b) => (
                            <BlogCard key={b.id} blog={b} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}