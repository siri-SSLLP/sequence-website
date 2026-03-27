import './CategorySection.css'
import { product, CategoryIcon } from '../../assets/assets.js'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillHouseHeartFill } from "react-icons/bs";

const CategorySection = ({ name }) => {

    const navigate = useNavigate();

    // ================= GROUP DATA =================
    const groupedCategories = {};

    product.forEach((item) => {

        const parent = item.parentCategory?.name?.trim();
        const child = item.childCategory?.name?.trim();

        if (!parent || !child) return;

        if (!groupedCategories[parent]) {
            groupedCategories[parent] = {
                name: parent,
                children: {}
            };
        }

        if (!groupedCategories[parent].children[child]) {
            groupedCategories[parent].children[child] = {
                name: child,
                products: []
            };
        }

        const alreadyExists = groupedCategories[parent]
            .children[child]
            .products.some(p => p.productName === item.productName);

        if (!alreadyExists) {
            groupedCategories[parent].children[child].products.push({
                productName: item.productName,
                image: item.imageUrl || "https://via.placeholder.com/150"
            });
        }

    });

    const categoriesArray = Object.values(groupedCategories);

    const firstParent = categoriesArray[0] || null;
    const firstChild = firstParent
        ? Object.values(firstParent.children)[0]
        : null;

    const [selectedParent, setSelectedParent] = useState(firstParent);
    const [selectedChild, setSelectedChild] = useState(firstChild);

    const childrenArray = selectedParent
        ? Object.values(selectedParent.children)
        : [];

    return (
        <>
            {/* TITLE */}
            <div className='cat-title'>
                <h1>{name}</h1>
                <p className='cat-subtitle'>Explore by Category</p>
            </div>

            <div className='container-fluid'>
                <div className='cat-container'>

                    {/* ================= PARENT ================= */}
                    <div className="cat-parent-list">
                        {
                            categoriesArray.map((category, index) => (
                                <div
                                    key={index}
                                    className="cat-parent-wrapper"
                                    onClick={() => {

                                        // ✅ MOBILE → redirect only
                                        if (window.innerWidth <= 768) {
                                            navigate(`/category/${category.name}`);
                                            return;
                                        }

                                        // ✅ DESKTOP → normal flow
                                        setSelectedParent(category);
                                        const firstChild = Object.values(category.children)[0];
                                        setSelectedChild(firstChild);
                                    }}
                                >
                                    {/* ICON (only for desktop visual) */}
                                    <div className={`cat-parent-item 
                                    ${selectedParent?.name === category.name ? "active" : ""}`}>
                                        {/* <BsFillHouseHeartFill /> */}

                                        <img src={CategoryIcon[0][category.name]} alt={category.name} />

                                    </div>

                                    <p className="cat-parent-label">{category.name}</p>
                                    <div>
                                        <img className='mobile-image-category' src={CategoryIcon[0][category.name]} alt={category.name} />
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {/* ================= CHILD ================= */}
                    <div className="cat-child-list">
                        {
                            childrenArray.map((child, index) => (
                                <>
                                    <div className='cat-child-image'>

                                        <div
                                            key={index}
                                            className={`cat-child-item 
                                                ${selectedChild?.name === child.name ? "active" : ""}`}
                                            onClick={() => setSelectedChild(child)}
                                        >
                                            <Link to={'/somewhre'}>
                                                <img
                                                    className='cat-img-child'
                                                    src='https://images.unsplash.com/photo-1681017628839-4d263afafc18?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'>
                                                </img>
                                            </Link>
                                            <p>{child.name}</p>
                                        </div>
                                    </div>
                                </>
                            ))
                        }
                    </div>

                    {/* ================= PRODUCTS ================= */}
                    {/* <div className="cat-product-list">

                    {
                        selectedChild?.products?.length > 0 ? (
                            selectedChild.products.map((item, index) => (

                                <div key={index} className="cat-product-item">
                                    <img src={item.image} alt={item.productName} />
                                    <p>{item.productName}</p>
                                </div>

                            ))
                        ) : (
                            <p>No products found</p>
                        )
                    }

                </div> */}
                </div>
            </div>
        </>
    )
}

export default CategorySection;