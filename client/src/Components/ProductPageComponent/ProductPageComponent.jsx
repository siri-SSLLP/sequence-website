import React, { useState, useMemo, useEffect, useContext } from "react";
import "./ProductPageComponent.css";
import { FaFilter } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ProductContext } from '../../Context/Context'
import { useGoBack } from '../../utils/useGoBack'
import { getPricing } from '../../utils/pricing'

const ProductPageComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        category: location.state?.category || "",
        subcategory: location.state?.subcategory || "",
        color: "",
        finish: "",
        application: "",
        priceMin: 0,
        priceMax: 5000,
    });
    const [sort, setSort] = useState("popular");
    const [activeFilters, setActiveFilters] = useState([]);
    const { changeQty, addToCart, cart, products, loading, favourites, toggleFavourite } = useContext(ProductContext); // ✅ loading added
    const goBack = useGoBack();
    const [heartAnim, setHeartAnim] = useState({});
    const product = products;

    useEffect(() => {
        if (location.state?.category) {
            setFilters(prev => ({
                ...prev,
                category: location.state.category,
                subcategory: location.state.subcategory || ""
            }));
            setActiveFilters([
                { key: "category", value: location.state.category },
                ...(location.state.subcategory
                    ? [{ key: "subcategory", value: location.state.subcategory }]
                    : [])
            ]);
        }
    }, [location.state]);

    const categories = [...new Set(product.map(p => p.parentCategory.name))];

    const subcategories = useMemo(() => {
        if (!filters.category) return [];
        return [...new Set(
            product
                .filter(p => p.parentCategory.name === filters.category)
                .map(p => p.childCategory.name)
        )];
    }, [filters.category, product]); // ✅ product added

    const colors = [...new Set(product.map(p => p.color))];
    const finishes = [...new Set(product.map(p => p.finishType))];
    const applications = [...new Set(product.flatMap(p => p.applications))];

    const handleFilterChange = (key, value) => {
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
        data = data.filter(p => getPricing(p).salePrice >= filters.priceMin && getPricing(p).salePrice <= filters.priceMax);
        if (sort === "low") data.sort((a, b) => getPricing(a).salePrice - getPricing(b).salePrice);
        if (sort === "high") data.sort((a, b) => getPricing(b).salePrice - getPricing(a).salePrice);
        return data;
    }, [filters, sort, product]); // ✅ product added

    const toggleFav = (e, id) => {
        toggleFavourite(e, id);
        setHeartAnim(prev => ({ ...prev, [id]: true }));
        setTimeout(() => setHeartAnim(prev => ({ ...prev, [id]: false })), 400);
    };

    // ✅ LOADER
    if (loading) {
    return (
        <div className="ppc-page">
            <aside className="ppc-sidebar">
                <div className="ppc-sidebar-header">
                    <span className="ppc-filter-icon"><FaFilter /></span>
                    <h3>Filters</h3>
                    <button type="button" className="ppc-back" onClick={goBack} aria-label="Go back to the previous page">
                        <FaArrowLeft aria-hidden="true" /> Back
                    </button>
                </div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="ppc-filter-group">
                        <div className="skel skel-label" />
                        <div className="skel skel-select" />
                    </div>
                ))}
            </aside>

            <main className="ppc-content">
                <div className="ppc-topbar">
                    <div className="skel skel-title" />
                </div>
                <div className="ppc-grid">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="ppc-card-link">
                            <div className="ppc-card">
                                <div className="skel skel-img" />
                                <div className="ppc-card-body">
                                    <div className="skel skel-tag" />
                                    <div className="skel skel-text" />
                                    <div className="skel skel-text-short" />
                                    <div className="skel skel-btn" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

    return (
        <div className="ppc-page">
            {/* ── Sidebar ── */}
            <aside className="ppc-sidebar">
                <div className="ppc-sidebar-header">
                    <span className="ppc-filter-icon"><FaFilter /></span>
                    <h3>Filters</h3>
                    <button type="button" className="ppc-back" onClick={goBack} aria-label="Go back to the previous page">
                        <FaArrowLeft aria-hidden="true" /> Back
                    </button>
                </div>

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
                        <div className="ppc-card-link" key={item.productId} style={{ animationDelay: `${index * 0.06}s` }}>
                            <div className="ppc-card" onClick={() => navigate(`/product/${item.productId}`)}>
                                <div className="ppc-card-img-wrap">
                                    <Link to={`/product/${item.productId}`} onClick={(e) => e.stopPropagation()} tabIndex={-1}>
                                        <img src={item.imageUrl} alt={item.productName} />
                                    </Link>
                                    <button
                                        className={`ppc-heart ${favourites[item.productId] ? "active" : ""} ${heartAnim[item.productId] ? "pop" : ""}`}
                                        onClick={(e) => toggleFav(e, item.productId)}
                                        aria-label={favourites[item.productId] ? "Remove from favourites" : "Add to favourites"}
                                    >
                                        {favourites[item.productId] ? "♥" : "♡"}
                                    </button>
                                </div>
                                <div className="ppc-card-body">
                                    <span className="ppc-card-cat">{item.parentCategory.name}</span>
                                    <h5 className="ppc-card-title">
                                        <Link to={`/product/${item.productId}`} onClick={(e) => e.stopPropagation()}>{item.productName}</Link>
                                    </h5>
                                    <div className="ppc-card-footer">
                                        <span className="ppc-card-price">₹{getPricing(item).salePrice.toLocaleString("en-IN")}</span>
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

        </div>
    );
};

export default ProductPageComponent;