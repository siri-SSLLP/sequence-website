import './CategorySection.css'
import {  CategoryIcon } from '../../assets/assets.js'
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductContext } from '../../Context/Context.jsx';

const CategorySection = ({ name }) => {
  const { products } = useContext(ProductContext);
  const product = products;
    const navigate = useNavigate();

    // ================= GROUP DATA =================
    const groupedCategories = {};

    product.forEach((item) => {
        const parent = item.parentCategory?.name?.trim();
        const child = item.childCategory?.name?.trim();

        if (!parent || !child) return;

        if (!groupedCategories[parent]) {
            groupedCategories[parent] = { name: parent, children: {} };
        }

        if (!groupedCategories[parent].children[child]) {
            groupedCategories[parent].children[child] = {
                name: child,
                products: [],
                // grab the first product image as the child thumbnail
                thumbnail: null
            };
        }

        const alreadyExists = groupedCategories[parent]
            .children[child]
            .products.some(p => p.productName === item.productName);

        if (!alreadyExists) {
            groupedCategories[parent].children[child].products.push({
                productName: item.productName,
                image: item.imageUrl
            });
            // Set thumbnail from first product in this child
            if (!groupedCategories[parent].children[child].thumbnail) {
                groupedCategories[parent].children[child].thumbnail = item.imageUrl;
            }
        }
    });

    const categoriesArray = Object.values(groupedCategories);
    const firstParent = categoriesArray[0] || null;
    const firstChild = firstParent ? Object.values(firstParent.children)[0] : null;

    const [selectedParent, setSelectedParent] = useState(firstParent);
    const [selectedChild, setSelectedChild] = useState(firstChild);
    const [mobileView, setMobileView] = useState('categories'); // 'categories' | 'subcategories'

    const childrenArray = selectedParent ? Object.values(selectedParent.children) : [];

    const handleParentClickMobile = (category) => {
        setSelectedParent(category);
        const first = Object.values(category.children)[0];
        setSelectedChild(first);
        setMobileView('subcategories');
    };

    const handleParentClickDesktop = (category) => {
        setSelectedParent(category);
        const first = Object.values(category.children)[0];
        setSelectedChild(first);
    };

    return (
        <>
            {/* ===== TITLE ===== */}
            <div className='cat-title'>
                <h1>{name}</h1>
                <p className='cat-subtitle'>Explore by Category</p>
            </div>

            {/* ===== DESKTOP LAYOUT ===== */}
            <div className='cat-desktop-wrapper'>
                <div className='cat-container pt-3'>

                    {/* Parent list */}
                    <div className="cat-parent-list">
                        {categoriesArray.map((category, index) => {
                            console.log(category)
                            const imageSrc = CategoryIcon[0][category.name];
                            return (
                                <div
                                    key={index}
                                    className={`cat-parent-wrapper ${selectedParent?.name === category.name ? "active" : ""}`}
                                    onClick={() => handleParentClickDesktop(category)}
                                >
                                    <div className={`cat-parent-item ${selectedParent?.name === category.name ? "active" : ""}`}>
                                        <img
                                            src={imageSrc || "https://via.placeholder.com/150"}
                                            alt={category.name}
                                        />
                                    </div>
                                    <p className="cat-parent-label">{category.name}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Child list */}
                    <div className="cat-child-list">
                        {childrenArray.map((child, index) => (
                            <div key={index} className='cat-child-image'>
                                <div
                                    className={`cat-child-item ${selectedChild?.name === child.name ? "active" : ""}`}
                                    onClick={() => setSelectedChild(child)}
                                >
                                    <Link
                                        to={`/products`}
                                        state={{ category: selectedParent?.name, subcategory: child.name }}
                                    >
                                        <img
                                            className='cat-img-child'
                                            src={child.thumbnail || 'https://images.unsplash.com/photo-1681017628839-4d263afafc18?q=80&w=400&auto=format&fit=crop'}
                                            alt={child.name}
                                        />
                                    </Link>
                                    <p>{child.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* ===== MOBILE LAYOUT ===== */}
            <div className='cat-mobile-wrapper'>

                {/* ── SCREEN 1: Categories ── */}
                {mobileView === 'categories' && (
                    <div className='mob-categories-screen'>
                        <div className='mob-grid'>
                            {categoriesArray.map((category, index) => {
                                const imageSrc = CategoryIcon[0][category.name];
                                // Count products in this parent
                                const productCount = Object.values(category.children)
                                    .reduce((sum, c) => sum + c.products.length, 0);

                                return (
                                    <div
                                        key={index}
                                        className={`mob-cat-card ${selectedParent?.name === category.name ? "active" : ""}`}
                                        onClick={() => handleParentClickMobile(category)}
                                        style={{
                                            backgroundImage: `url(${imageSrc})`
                                        }}
                                    >
                                        <div className='mob-cat-overlay' />
                                        <div className='mob-cat-content'>
                                            <span className='mob-cat-count'>{productCount} designs</span>
                                            <h3 className='mob-cat-name'>{category.name}</h3>
                                            <span className='mob-cat-arrow'>→</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── SCREEN 2: Subcategories ── */}
                {mobileView === 'subcategories' && (
                    <div className='mob-sub-screen'>

                        {/* Header bar */}
                        <div className='mob-sub-header'>
                            <button
                                className='mob-back-btn'
                                onClick={() => setMobileView('categories')}
                            >
                                ← Back
                            </button>
                            <h2 className='mob-sub-title'>{selectedParent?.name}</h2>
                        </div>

                        {/* Subcategory cards — full-width image strips */}
                        <div className='mob-sub-list'>
                            {childrenArray.map((child, index) => (
                                <Link
                                    key={index}
                                    to={`/products`}
                                    state={{ category: selectedParent?.name, subcategory: child.name }}
                                    className='mob-sub-card'
                                >
                                    <div
                                        className='mob-sub-img'
                                        style={{
                                            backgroundImage: `url(${child.thumbnail || 'https://images.unsplash.com/photo-1681017628839-4d263afafc18?q=80&w=400'})`
                                        }}
                                    />
                                    <div className='mob-sub-info'>
                                        <span className='mob-sub-name'>{child.name}</span>
                                        <span className='mob-sub-meta'>{child.products.length} products</span>
                                    </div>
                                    <span className='mob-sub-chevron'>›</span>
                                </Link>
                            ))}
                        </div>

                    </div>
                )}

            </div>
        </>
    );
};

export default CategorySection;