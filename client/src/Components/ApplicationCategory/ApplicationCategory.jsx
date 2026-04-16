import './ApplicationCategory.css';
import { CategoryIcon } from '../../assets/assets.js';
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ProductContext } from '../../Context/Context.jsx';

const ApplicationCategory = ({ title, name }) => {

    const {products,setLoading, setProducts,loading} = useContext(ProductContext)
    const [selectedParent, setSelectedParent] = useState(null);

    // 🔥 FETCH DATA FROM BACKEND
    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             const res = await axios.get("http://127.0.0.1:5001/api/products", {
    //                 // headers: {
    //                 //     Authorization: localStorage.getItem("token") // remove if not protected
    //                 // }
    //             });

    //             setProducts(res.data);
    //             console.log("Fetched products:", res.data);
    //         } catch (err) {
    //             console.log("Error fetching products:", err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchProducts();
    // }, []);

    // 🔥 GROUP CATEGORIES
    const groupedCategories = {};

    products.forEach((item) => {
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

    const categoriesArray = Object.values(groupedCategories).slice(0, 5);

    // 🔥 SET DEFAULT SELECTED CATEGORY
    useEffect(() => {
        if (categoriesArray.length > 0 && !selectedParent) {
            setSelectedParent(categoriesArray[0]);
        }
    }, [products]);

    // 🔥 FILTER PRODUCTS
    function productsForApplication(appName) {
        return products.filter(p =>
            Array.isArray(p.applications) &&
            p.applications.includes(appName)
        );
    }

    // 🔥 LOADING STATE
    if (loading) return <p>Loading...</p>;

    return (
        <>
            <div className='appcat-title'>
                <h1>{name}</h1>
                <h1 className='appcat-title-name'><b>{title}</b></h1>
            </div>

            <div className='appcat-container'>

                {/* PARENT CATEGORIES */}
                <div className="appcat-parent-list mt-4">
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
                        productsForApplication(selectedParent.name)
                            .slice(0, 5)
                            .map((child, index) => (
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