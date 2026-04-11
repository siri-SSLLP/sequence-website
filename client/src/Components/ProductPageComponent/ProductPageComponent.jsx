


import React, { useState, useMemo, useEffect, useContext } from "react";
import "./ProductPageComponent.css";
import { product } from "../../assets/assets";
import { FaFilter } from "react-icons/fa6";
import { Link } from "react-router-dom";

import { ProductContext } from '../../Context/Context'
const ProductPageComponent = () => {
    const [filters, setFilters] = useState({
        category: "",
        subcategory: "",
        color: "",
        finish: "",
        application: "",
        priceMin: 0,
        priceMax: 5000,
    });
    const [sort, setSort] = useState("popular");
    const [activeFilters, setActiveFilters] = useState([]);
    const [favourites, setFavourites] = useState({});
    const { changeQty, addToCart, cart } = useContext(ProductContext)
    const [modal, setModal] = useState(null);
    const [heartAnim, setHeartAnim] = useState({});

    useEffect(() => {
        console.log(cart)
        document.body.style.overflow = modal ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [modal]);

    // Get unique parent categories
    const categories = [...new Set(product.map(p => p.parentCategory.name))];

    // Get subcategories based on selected parent category
    const subcategories = useMemo(() => {
        if (!filters.category) return [];
        return [...new Set(
            product
                .filter(p => p.parentCategory.name === filters.category)
                .map(p => p.childCategory.name)
        )];
    }, [filters.category]);

    const colors = [...new Set(product.map(p => p.color))];
    const finishes = [...new Set(product.map(p => p.finishType))];
    const applications = [...new Set(product.flatMap(p => p.applications))];

    const handleFilterChange = (key, value) => {
        // If category changes, reset subcategory
        if (key === "category" && value !== filters.category) {
            setFilters(prev => ({ ...prev, [key]: value, subcategory: "" }));
            if (value) {
                setActiveFilters(prev => [
                    ...prev.filter(f => f.key !== key && f.key !== "subcategory"),
                    { key, value }
                ]);
            } else {
                setActiveFilters(prev => prev.filter(f => f.key !== key && f.key !== "subcategory"));
            }
        } else {
            setFilters(prev => ({ ...prev, [key]: value }));
            if (value && key !== "priceMin" && key !== "priceMax") {
                setActiveFilters(prev => [...prev.filter(f => f.key !== key), { key, value }]);
            } else if (!value) {
                setActiveFilters(prev => prev.filter(f => f.key !== key));
            }
        }
    };

    const removeFilter = (key) => {
        if (key === "category") {
            setFilters(prev => ({ ...prev, [key]: "", subcategory: "" }));
            setActiveFilters(prev => prev.filter(f => f.key !== key && f.key !== "subcategory"));
        } else {
            setFilters(prev => ({ ...prev, [key]: "" }));
            setActiveFilters(prev => prev.filter(f => f.key !== key));
        }
    };

    const clearAll = () => {
        setFilters({
            category: "",
            subcategory: "",
            color: "",
            finish: "",
            application: "",
            priceMin: 0,
            priceMax: 5000
        });
        setActiveFilters([]);
    };

    const filteredProducts = useMemo(() => {
        let data = [...product];
        if (filters.category) data = data.filter(p => p.parentCategory.name === filters.category);
        if (filters.subcategory) data = data.filter(p => p.childCategory.name === filters.subcategory);
        if (filters.color) data = data.filter(p => p.color === filters.color);
        if (filters.finish) data = data.filter(p => p.finishType === filters.finish);
        if (filters.application) data = data.filter(p => p.applications.includes(filters.application));
        data = data.filter(p => p.mrpPrice >= filters.priceMin && p.mrpPrice <= filters.priceMax);
        if (sort === "low") data.sort((a, b) => a.mrpPrice - b.mrpPrice);
        if (sort === "high") data.sort((a, b) => b.mrpPrice - a.mrpPrice);
        console.log(data)
        return data;
    }, [filters, sort]);

    const toggleFav = (e, id) => {
        e.stopPropagation();
        setFavourites(prev => ({ ...prev, [id]: !prev[id] }));
        setHeartAnim(prev => ({ ...prev, [id]: true }));
        setTimeout(() => setHeartAnim(prev => ({ ...prev, [id]: false })), 400);
    };



    const openModal = (e, item) => { e.stopPropagation(); setModal(item); };
    const closeModal = () => setModal(null);

    return (
        <div className="ppc-page">

            {/* ── Sidebar ── */}
            <aside className="ppc-sidebar">
                <div className="ppc-sidebar-header">
                    <span className="ppc-filter-icon"><FaFilter /></span>
                    <h3>Filters</h3>
                </div>

                {/* Category Filter */}
                <div className="ppc-filter-group">
                    <label className="ppc-label">Category</label>
                    <div className="ppc-select-wrap">
                        <select value={filters.category} onChange={(e) => handleFilterChange("category", e.target.value)}>
                            <option value="">All Categories</option>
                            {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                        </select>
                        <span className="ppc-select-arrow">›</span>
                    </div>
                </div>

                {/* Subcategory Filter - Shows only when category is selected */}
                {filters.category && subcategories.length > 0 && (
                    <div className="ppc-filter-group ppc-subcategory-filter">
                        <label className="ppc-label">Subcategory</label>
                        <div className="ppc-select-wrap">
                            <select value={filters.subcategory} onChange={(e) => handleFilterChange("subcategory", e.target.value)}>
                                <option value="">All Subcategories</option>
                                {subcategories.map((subcat, i) => (
                                    <option key={i} value={subcat}>{subcat}</option>
                                ))}
                            </select>
                            <span className="ppc-select-arrow">›</span>
                        </div>
                    </div>
                )}

                {/* Color Filter */}
                <div className="ppc-filter-group">
                    <label className="ppc-label">Color</label>
                    <div className="ppc-select-wrap">
                        <select value={filters.color} onChange={(e) => handleFilterChange("color", e.target.value)}>
                            <option value="">All Colors</option>
                            {colors.map((col, i) => <option key={i} value={col}>{col}</option>)}
                        </select>
                        <span className="ppc-select-arrow">›</span>
                    </div>
                </div>

                {/* Finish Filter */}
                <div className="ppc-filter-group">
                    <label className="ppc-label">Finish</label>
                    <div className="ppc-select-wrap">
                        <select value={filters.finish} onChange={(e) => handleFilterChange("finish", e.target.value)}>
                            <option value="">All Finishes</option>
                            {finishes.map((fin, i) => <option key={i} value={fin}>{fin}</option>)}
                        </select>
                        <span className="ppc-select-arrow">›</span>
                    </div>
                </div>

                {/* Application Filter */}
                <div className="ppc-filter-group">
                    <label className="ppc-label">Application</label>
                    <div className="ppc-select-wrap">
                        <select value={filters.application} onChange={(e) => handleFilterChange("application", e.target.value)}>
                            <option value="">All Applications</option>
                            {applications.map((app, i) => <option key={i} value={app}>{app}</option>)}
                        </select>
                        <span className="ppc-select-arrow">›</span>
                    </div>
                </div>

                {/* Price Range */}
                <div className="ppc-filter-group">
                    <label className="ppc-label">
                        Price Range
                        <span className="ppc-price-display">₹{filters.priceMin} – ₹{filters.priceMax}</span>
                    </label>
                    <div className="ppc-slider-container">
                        <div className="ppc-slider-track">
                            <div className="ppc-slider-fill" style={{
                                left: `${(filters.priceMin / 5000) * 100}%`,
                                width: `${((filters.priceMax - filters.priceMin) / 5000) * 100}%`
                            }} />
                        </div>
                        <input type="range" className="ppc-range ppc-range-min"
                            min="0" max="5000" step="100" value={filters.priceMin}
                            onChange={(e) => handleFilterChange("priceMin", Math.min(Number(e.target.value), filters.priceMax - 100))} />
                        <input type="range" className="ppc-range ppc-range-max"
                            min="0" max="5000" step="100" value={filters.priceMax}
                            onChange={(e) => handleFilterChange("priceMax", Math.max(Number(e.target.value), filters.priceMin + 100))} />
                    </div>
                    <div className="ppc-price-labels"><span>₹0</span><span>₹5000</span></div>
                </div>

                {activeFilters.length > 0 && (
                    <button className="ppc-clear-btn" onClick={clearAll}>Clear all filters ×</button>
                )}
            </aside>

            {/* ── Main Content ── */}
            <main className="ppc-content">
                <div className="ppc-topbar">
                    <div className="ppc-topbar-left">
                        <h2 className="ppc-count">
                            <span className="ppc-count-num">{filteredProducts.length}</span>
                            <span className="ppc-count-label"> Products</span>
                        </h2>
                        {activeFilters.length > 0 && (
                            <div className="ppc-active-filters">
                                {activeFilters.map((f) => (
                                    <span key={f.key} className="ppc-filter-chip">
                                        {f.value}
                                        <button onClick={() => removeFilter(f.key)}>×</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="ppc-sort-wrap">
                        <span className="ppc-sort-label">Sort</span>
                        <div className="ppc-select-wrap">
                            <select value={sort} onChange={(e) => setSort(e.target.value)}>
                                <option value="popular">Popular</option>
                                <option value="low">Price: Low → High</option>
                                <option value="high">Price: High → Low</option>
                            </select>
                            <span className="ppc-select-arrow">›</span>
                        </div>
                    </div>
                </div>

                <div className="ppc-grid">
                    {filteredProducts.map((item, index) => (
                        <>
                            <div className="ppc-card-link" key={item.productId} style={{ animationDelay: `${index * 0.06}s` }}>
                                {/* <h5 className="ppc-card-title">{item.productName}</h5> */}
                                <div className="ppc-card">
                                    <div className="ppc-card-img-wrap">
                                        <Link to={`/product/${item.productId}`}>
                                            <img src={item.imageUrl} alt={item.productName} />
                                        </Link>
                                        <button
                                            className={`ppc-heart ${favourites[item.productId] ? "active" : ""} ${heartAnim[item.productId] ? "pop" : ""}`}
                                            onClick={(e) => toggleFav(e, item.productId)}
                                            aria-label="Add to favourites"
                                        >
                                            {favourites[item.productId] ? "♥" : "♡"}
                                        </button>
                                        <div className="ppc-card-overlay">
                                            <button className="ppc-view-btn" onClick={(e) => openModal(e, item)}>
                                                View Details →
                                            </button>
                                        </div>
                                    </div>
                                    <div className="ppc-card-body">
                                        <span className="ppc-card-cat">{item.parentCategory.name}</span>
                                        <h5 className="ppc-card-title">{item.productName}</h5>
                                        <div className="ppc-card-footer">
                                            <span className="ppc-card-price">₹{item.mrpPrice}</span>
                                            {item.finishType && <span className="ppc-card-finish">{item.finishType}</span>}
                                        </div>


                                        {!cart[item.productId] ? (
                                            <button className="ppc-add-cart" onClick={(e) => addToCart(e, item.productId)}>
                                                + Add to Cart
                                            </button>
                                        ) : (
                                            <div className="ppc-qty-control">
                                                <button onClick={(e) => changeQty(e, item.productId, -1)}>−</button>
                                                <span>{cart[item.productId]}</span>
                                                <button onClick={(e) => changeQty(e, item.productId, +1)}>+</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            
                        </>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="ppc-empty">
                        <div className="ppc-empty-icon">◈</div>
                        <p>No products match your filters.</p>
                        <button className="ppc-clear-btn" onClick={clearAll}>Reset Filters</button>
                    </div>
                )}
            </main>

            {/* ── Product Detail Modal ── */}
            {modal && (
                <div className="ppc-modal-backdrop" onClick={closeModal}>
                    <div className="ppc-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="ppc-modal-close" onClick={closeModal}>×</button>

                        <div className="ppc-modal-inner">
                            {/* Left col */}
                            <div className="ppc-modal-img-col">
                                <div className="ppc-modal-img-wrap">
                                    <Link to={`/product/${modal.productId}`}>
                                        <img src={modal.imageUrl} alt={modal.productName} />
                                    </Link>
                                </div>

                                {/* 🔥 VIEW FULL PRODUCT BUTTON */}
                                <Link
                                    to={`/product/${modal.productId}`}
                                    className="ppc-full-product-btn"
                                >
                                    View Full Product →
                                </Link>

                                {modal.tags?.length > 0 && (
                                    <div className="ppc-modal-tags">
                                        {modal.tags.map((t) => (
                                            <span key={t} className="ppc-modal-tag">#{t}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right col */}
                            <div className="ppc-modal-info-col">
                                <span className="ppc-modal-breadcrumb">
                                    {modal.parentCategory.name} · {modal.childCategory.name}
                                </span>
                                <h2 className="ppc-modal-title">{modal.productName}</h2>
                                <p className="ppc-modal-code">{modal.productCode} · HSN {modal.hsnCode}</p>

                                <div className="ppc-modal-price-row">
                                    <span className="ppc-modal-price">₹{modal.mrpPrice}</span>
                                    {modal.mrpDiscount > 0 && (
                                        <span className="ppc-modal-discount">{modal.mrpDiscount}% off</span>
                                    )}
                                    <span className="ppc-modal-gst">+{modal.gst}% GST</span>
                                </div>

                                <p className="ppc-modal-desc">{modal.description}</p>

                                <div className="ppc-modal-specs">
                                    {[
                                        ["Brand", modal.brand],
                                        ["Color", modal.color],
                                        ["Finish", modal.finishType],
                                        ["Texture", modal.finishTexture],
                                        ["Size", modal.size],
                                        ["Weight", modal.netWeight],
                                        ["Material", modal.materialComposition],
                                        ["Style", modal.styleFit],
                                        ["Stock", `${modal.stock} units`],
                                    ].map(([k, v]) => v && (
                                        <div key={k} className="ppc-modal-spec-row">
                                            <span className="ppc-modal-spec-key">{k}</span>
                                            <span className="ppc-modal-spec-val">{v}</span>
                                        </div>
                                    ))}
                                </div>

                                {modal.whereToUse?.length > 0 && (
                                    <div className="ppc-modal-uses">
                                        <span className="ppc-modal-uses-label">Where to Use</span>
                                        <div className="ppc-modal-uses-list">
                                            {modal.whereToUse.map((u) => (
                                                <span key={u} className="ppc-modal-use-chip">{u}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="ppc-modal-actions">
                                    <button
                                        className={`ppc-modal-fav ${favourites[modal.productId] ? "active" : ""}`}
                                        onClick={(e) => toggleFav(e, modal.productId)}
                                    >
                                        {favourites[modal.productId] ? "♥ Saved" : "♡ Save"}
                                    </button>

                                    {!cart[modal.productId] ? (
                                        <button className="ppc-modal-cart" onClick={(e) => addToCart(e, modal.productId)}>
                                            + Add to Cart
                                        </button>
                                    ) : (
                                        <div className="ppc-qty-control ppc-qty-modal">
                                            <button onClick={(e) => changeQty(e, modal.productId, -1)}>−</button>
                                            <span>{cart[modal.productId]}</span>
                                            <button onClick={(e) => changeQty(e, modal.productId, +1)}>+</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductPageComponent;