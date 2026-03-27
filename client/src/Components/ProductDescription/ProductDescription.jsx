import "./ProductDescription.css"
import { product } from "../../assets/assets";




const images = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1761839258513-099c3121d72d?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1761839258513-099c3121d72d?w=400&auto=format&fit=crop",
];




const ProductDescription = () => {



    const groupedCategories = {};

    product.forEach((item) => {
        const parentId = item.parentCategory.id;
        if (!groupedCategories[parentId]) {
            groupedCategories[parentId] = {
                name: item.parentCategory.name,
                children: []
            };
        }

        // avoid duplicate child categories
        const childExists = groupedCategories[parentId].children.find(
            (c) => c.id === item.childCategory.id
        );

        if (!childExists) {
            groupedCategories[parentId].children.push(item.childCategory);
        }
    });



    return (
        <>
            <div className="pd-parent-div">
                <div className="row">
                    <div className="col-1">
                        <div className="pd-image-div">
                            {images.map((img, index) => (
                                <div key={index} className="slider-item">
                                    <img src={img} alt={`img-${index}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="pd-image-main-div">
                            <img src={images}></img>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="pd-details-div">
                            <h4>Tropical Floral</h4>
                            <p>Terracotta Vein Wildflower Cluster | WP 04125 Canvas Texture Finish Tropical Style luxurious Customized size Wallpaper | 250 GSM WP01CNF Paper | (MOQ = 30 Sq. Ft.)</p>
                            <h4><strong> $5000 </strong>/Sq. Ft.</h4>
                            <div className="pd-discount-div">
                                <span className="pd-discount">$ 6000</span> <span className="pd-discount-per">30% OFF</span>
                            </div>
                            <div className="pd-line-break"></div>
                        </div>
                        <div className="pd-button-div">
                            <div >
                                <button className="pd-addtocart-btn"></button>
                            </div>
                            <div >
                                <button className="pd-visitstore_btn"></button>
                            </div>
                            <div className="pd-">
                                <button></button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};
export default ProductDescription