import "./ProductDescription.css";
// import { product as products } from "../../assets/assets";
import { Link, useParams } from "react-router-dom";
import { useState, useRef, useContext } from "react";
import { ProductContext } from "../../Context/Context.jsx";

const ProductDescription = () => {
    const { products } = useContext(ProductContext);
    const { id } = useParams();
    const { changeQty, addToCart, cart, setCart } = useContext(ProductContext);

    const singleProduct =
        products.find((item) => String(item.productId) === String(id) && item.images) ||
        products.find((item) => String(item.productId) === String(id));

    if (!singleProduct) {
        return <h2 className="not-found">Product not found</h2>;
    }

    // const imageList =
    //     singleProduct.images && singleProduct.images.length > 0
    //         ? singleProduct.images
    //         : [singleProduct.imageUrl];
    const imageList = [
    singleProduct.imageUrl, // ALWAYS first
    ...(singleProduct.images || []).filter(
        (img) => img !== singleProduct.imageUrl
    ),
];
    const relatedProducts = products
        .filter((p) => String(p.productId) !== String(id))
        .slice(0, 8);

    const [mainImage, setMainImage] = useState(imageList[0]);
    const [mainIndex, setMainIndex] = useState(0);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [wishlist, setWishlist] = useState(false);
    const [activeTab, setActiveTab] = useState("details");

    const imgRef = useRef();
    const carouselRef = useRef();
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);

    const goTo = (index) => {
        const clamped = Math.max(0, Math.min(imageList.length - 1, index));
        setMainIndex(clamped);
        setMainImage(imageList[clamped]);
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = imgRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        setZoomPosition({ x, y });
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const deltaY = e.changedTouches[0].clientY - touchStartY.current;
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
            if (deltaX < 0) {
                goTo(mainIndex + 1);
            } else {
                goTo(mainIndex - 1);
            }
        }
        touchStartX.current = null;
        touchStartY.current = null;
    };

    // Remove a product from cart completely
    const removeFromCart = (e, productId) => {
        e.stopPropagation();
        setCart(prev => {
            const { [productId]: _, ...rest } = prev;
            return rest;
        });
    };

    const discountPct = singleProduct.mrpDiscount || 0;
    const mrpPrice = singleProduct.mrpPrice;
    const displayMRP = singleProduct.displayMRP;

    const mainInCart = (cart[singleProduct.productId] || 0) > 0;

    return (
        <div className="pdp-page">

            {/* ── BREADCRUMB ── */}
            <div className="pdp-breadcrumb">
                <span>Home</span>
                <span className="pdp-bc-sep">›</span>
                <span>Products</span>
                <span className="pdp-bc-sep">›</span>
                <span className="pdp-bc-current">{singleProduct.productName}</span>
            </div>

            {/* ── MAIN TWO-COLUMN SECTION ── */}
            <div className="pdp-section container">

                {/* LEFT — sticky gallery */}
                <div className="pdp-left">
                    <div className="pdp-gallery">

                        {/* VERTICAL THUMBNAIL STRIP */}
                        {imageList.length > 1 && (
                            <div className="pdp-thumb-strip">
                                <div className="pdp-thumb-list" ref={carouselRef}>
                                    {imageList.map((img, index) => (
                                        <button
                                            key={index}
                                            className={`pdp-thumb ${mainIndex === index ? "active" : ""}`}
                                            onClick={() => goTo(index)}
                                            onMouseEnter={() => goTo(index)}
                                            aria-label={`View image ${index + 1}`}
                                        >
                                            <img src={img} alt={`view-${index + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* MAIN IMAGE */}
                        <div
                            className="pdp-main-img-wrap"
                            onMouseEnter={() => setShowZoom(true)}
                            onMouseLeave={() => setShowZoom(false)}
                            onMouseMove={handleMouseMove}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <img
                                ref={imgRef}
                                src={mainImage}
                                className="pdp-main-img"
                                alt={singleProduct.productName}
                            />

                            {discountPct > 0 && (
                                <div className="pdp-badge">{discountPct}% OFF</div>
                            )}
                            {wishlist && (
                                <div className="pdp-saved-badge">♥ Saved</div>
                            )}
                            {imageList.length > 1 && (
                                <div className="pdp-img-counter">
                                    {mainIndex + 1} / {imageList.length}
                                </div>
                            )}
                            {showZoom && (
                                <div
                                    className="zoom-lens"
                                    style={{
                                        left: `${zoomPosition.x * 100}%`,
                                        top: `${zoomPosition.y * 100}%`,
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* DOT INDICATORS */}
                    {imageList.length > 1 && (
                        <div className="pdp-dots">
                            {imageList.map((_, i) => (
                                <button
                                    key={i}
                                    className={`pdp-dot ${i === mainIndex ? "active" : ""}`}
                                    onClick={() => goTo(i)}
                                />
                            ))}
                        </div>
                    )}

                    {/* ZOOM OVERLAY */}
                    {showZoom && (
                        <div
                            className="zoom-overlay"
                            style={{
                                backgroundImage: `url(${mainImage})`,
                                backgroundPosition: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                            }}
                        />
                    )}
                </div>

                {/* RIGHT — scrolls naturally */}
                <div className="pdp-right">

                    <div className="pdp-brand">{singleProduct.brand}</div>
                    <h1 className="pdp-title">{singleProduct.productName}</h1>
                    <p className="pdp-desc">{singleProduct.description}</p>

                    <div className="pdp-divider" />

                    {/* PRICE */}
                    <div className="pdp-price-row">
                        <span className="pdp-price">₹{mrpPrice?.toLocaleString()}</span>
                        {displayMRP && (
                            <span className="pdp-old-price">₹{displayMRP?.toLocaleString()}</span>
                        )}
                        {discountPct > 0 && (
                            <span className="pdp-discount-tag">{discountPct}% OFF</span>
                        )}
                    </div>
                    <p className="pdp-tax-note">Inclusive of all taxes · Free shipping over ₹999</p>

                    <div className="pdp-divider" />

                    {/* TABS */}
                    <div className="pdp-tabs">
                        {["details", "dimensions"].map((tab) => (
                            <button
                                key={tab}
                                className={`pdp-tab ${activeTab === tab ? "active" : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {activeTab === "details" && (
                        <div className="pdp-details-grid">
                            {[
                                ["Brand", singleProduct.brand],
                                ["Color", singleProduct.color],
                                ["Finish", singleProduct.finishType],
                                ["Size", singleProduct.size],
                                ["Stock", singleProduct.stock],
                            ].map(([label, value]) => value && (
                                <div key={label} className="pdp-detail-row">
                                    <span className="pdp-detail-label">{label}</span>
                                    <span className="pdp-detail-value">{value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "dimensions" && (
                        <div className="pdp-dim-grid">
                            {[
                                ["Area", singleProduct.area],
                                ["Height", singleProduct.height],
                                ["Width", singleProduct.width],
                            ].map(([label, val]) => val && (
                                <div key={label} className="pdp-dim-card">
                                    <span className="pdp-dim-val">{val}</span>
                                    <span className="pdp-dim-label">{label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pdp-divider" />

                    {/* QUANTITY */}
                    <div className="pdp-qty-row">
                        <span className="pdp-qty-label">Quantity</span>
                        <div className="pdp-qty-control">
                            <button onClick={(e) => changeQty(e, singleProduct.productId, -1)}>−</button>
                            <span>{cart[singleProduct.productId] || 0}</span>
                            <button onClick={(e) => changeQty(e, singleProduct.productId, +1)}>+</button>
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="pdp-actions">
                        {mainInCart ? (
                            <button
                                className="pdp-btn-cart remove"
                                onClick={(e) => removeFromCart(e, singleProduct.productId)}
                            >
                                ✕ Remove from Cart
                            </button>
                        ) : (
                            <button
                                className="pdp-btn-cart"
                                onClick={(e) => addToCart(e, singleProduct.productId)}
                            >
                                Add to Cart
                            </button>
                        )}
                        <button className="pdp-btn-buy">Buy Now</button>
                    </div>

                    {/* WISHLIST */}
                    <button
                        className={`pdp-wishlist-btn ${wishlist ? "active" : ""}`}
                        onClick={() => setWishlist(w => !w)}
                    >
                        {wishlist ? "♥ Saved to Wishlist" : "♡ Add to Wishlist"}
                    </button>

                    {/* TRUST BADGES */}
                    <div className="pdp-trust">
                        <div className="pdp-trust-item">
                            <span className="pdp-trust-icon">🚚</span>
                            <span>Free Delivery</span>
                        </div>
                        <div className="pdp-trust-item">
                            <span className="pdp-trust-icon">↩</span>
                            <span>Easy Returns</span>
                        </div>
                        <div className="pdp-trust-item">
                            <span className="pdp-trust-icon">🔒</span>
                            <span>Secure Pay</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── RELATED PRODUCTS ── */}
            {relatedProducts.length > 0 && (
                <section className="pdp-related">
                    <div className="pdp-related-header">
                        <div>
                            <h2 className="pdp-related-title">You May Also Like</h2>
                            <p className="pdp-related-sub">Handpicked products just for you</p>
                        </div>
                        <Link to="/products" className="pdp-view-all">View All →</Link>
                    </div>

                    <div className="pdp-related-grid">
                        {relatedProducts.map((item) => {
                            const thumb = item.imageUrl;
                            const disc = item.mrpDiscount || 0;
                            const inCart = (cart[item.productId] || 0) > 0;

                            return (
                                <Link
                                    key={item.productId}
                                    to={`/product/${item.productId}`}
                                    className="pdp-rel-card"
                                >
                                    <div className="pdp-rel-img-wrap">
                                        <img src={thumb} alt={item.productName} />
                                        {disc > 0 && (
                                            <span className="pdp-rel-badge">{disc}% OFF</span>
                                        )}
                                        <div className="pdp-rel-hover-overlay">
                                            <span>Quick View</span>
                                        </div>
                                    </div>
                                    <div className="pdp-rel-info">
                                        <p className="pdp-rel-brand">{item.brand}</p>
                                        <p className="pdp-rel-name">{item.productName}</p>
                                        <div className="pdp-rel-price-row">
                                            <span className="pdp-rel-price">
                                                ₹{item.mrpPrice?.toLocaleString()}
                                            </span>
                                            {item.displayMRP && (
                                                <span className="pdp-rel-old">
                                                    ₹{item.displayMRP?.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        className={`pdp-rel-add ${inCart ? "in-cart" : ""}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (inCart) {
                                                removeFromCart(e, item.productId);
                                            } else {
                                                addToCart(e, item.productId);
                                            }
                                        }}
                                    >
                                        {inCart ? "✕ Remove" : "+ Add to Cart"}
                                    </button>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

        </div>
    );
};

export default ProductDescription;