import './ApplicationCategory.css'
import { newLaunchProducts, CategoryIcon } from '../../assets/assets.js'
import { useState } from "react";
import { BsFillHouseHeartFill } from "react-icons/bs";
import { FaKitchenSet } from "react-icons/fa6";


const ApplicationCategory = ({ title, name }) => {

    // const getCategoryIcon = (name) => {
    //     if (name.includes("Kitchen")) return <TbToolsKitchen />;
    //     if (name.includes("Living")) return <TbArmchair />;
    //     if (name.includes("Light")) return <TbLamp />;
    //     return <BsFillHouseHeartFill />;
    // };

    // const getCategoryIcon = (input)=>{
    //     return CategoryIcon[input]
    // }
    CategoryIcon[0]['Kitchen']
    const groupedCategories = {};

    newLaunchProducts.forEach((item) => {

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
        return newLaunchProducts.filter(p =>
            Array.isArray(p.applications) &&
            p.applications.includes(appName)
        );
    }

    const categoriesArray = Object.values(groupedCategories);

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

                    {
                        categoriesArray.map((category, index) => (
                            <div key={index} className='appcat-parent-wrapper '>

                                <div
                                    className={`appcat-parent-item 
                `}
                                    
                                >
                                    {/* {getCategoryIcon(category.name)} */}
                                   <div className='p-2'>
                                     <div className={`application-image-div mt-5  ${selectedParent?.name === category.name ? "appcat-active" : ""}`} onClick={() => setSelectedParent(category)}>
                                        <div className='application-image-test'>
                                            {/* <div className='tempo'>gvjjhbkhn</div> */}
                                            <img src={CategoryIcon[0][category.name]} className='application-image' alt={category.name} />
                                        </div>
                                    </div>
                                   </div>
                                </div>

                                <div className='appcat-parent-label'>
                                    {category.name}
                                </div>

                            </div>
                        ))
                    }
                </div>

                {/* CHILD PRODUCTS */}
                <div className="appcat-child-list pb-5 mt-4">

                    {
                        selectedParent &&
                            productsForApplication(selectedParent.name).length > 0 ? (

                            productsForApplication(selectedParent.name).map((child, index) => (

                                <div key={index} className="appcat-child-item">

                                    <img
                                        src={child.imageUrl || "https://via.placeholder.com/150"}
                                        alt={child.productName}
                                    />

                                    <p>{child.productName}</p>

                                </div>

                            ))

                        ) : (
                            <p>No products found</p>
                        )
                    }

                </div>

            </div>
        </>
    )
}

export default ApplicationCategory; 