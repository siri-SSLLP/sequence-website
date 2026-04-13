import './ApplicationCategory.css'
import { CategoryIcon, product } from '../../assets/assets.js'
import { useState } from "react";

const ApplicationCategory = ({ title, name }) => {

    const groupedCategories = {};

    product.forEach((item) => {
        if (Array.isArray(item.applications)) {
            item.applications.forEach((app) => {
                if (!groupedCategories[app]) {
                    groupedCategories[app] = {
                        name: app,
                        children: []
                    };
                }
                groupedCategories[app].children.push({
                    productName: item.productName,
                    image: item.imageUrl
                });
            });
        }
    });

    function productsForApplication(appName) {
        return product.filter(p =>
            Array.isArray(p.applications) &&
            p.applications.includes(appName)
        );
    }

    const categoriesArray = Object.values(groupedCategories).slice(0, 5);

    const [selectedParent, setSelectedParent] = useState(categoriesArray[0]);

    return (
        <>
            <div className='appcat-title'>
                <h1>{name}</h1>
                <h1 className='appcat-title-name'><b>{title}</b></h1>
            </div>

            <div className='appcat-container'>

                {/* PARENT CATEGORIES */}
                <div className="appcat-parent-list">
                    {categoriesArray.map((category, index) => (
                        <div key={index} className='appcat-parent-wrapper'>
                            <div
                                className={`application-image-div ${selectedParent?.name === category.name ? "appcat-active" : ""}`}
                                onClick={() => setSelectedParent(category)}
                            >
                                <div className='application-image-test'>
                                    <img
                                        src={CategoryIcon[0][category.name]}
                                        className='application-image'
                                        alt={category.name}
                                    />
                                </div>
                            </div>
                            <div className='appcat-parent-label'>
                                {category.name}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CHILD PRODUCTS */}
                <div className="appcat-child-list pb-5 mt-4">
                    {selectedParent && productsForApplication(selectedParent.name).length > 0 ? (
                        productsForApplication(selectedParent.name).slice(0, 5).map((child, index) => (
                            <div key={index} className="appcat-child-item">
                                <img
                                    src={child.imageUrl}
                                    alt={child.productName}
                                />
                                <p>{child.productName}</p>
                            </div>
                        ))
                    ) : (
                        <p>No products found</p>
                    )}
                </div>

            </div>
        </>
    );
};

export default ApplicationCategory;