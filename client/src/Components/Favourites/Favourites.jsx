import { useContext } from "react";
import { Link } from "react-router-dom";
import "../ProductPageComponent/ProductPageComponent.css";
import "./Favourites.css";
import { ProductContext } from "../../Context/Context";

const Favourites = () => {
    const { products, loading, favourites, toggleFavourite, cart, addToCart, changeQty } = useContext(ProductContext);

    const savedProducts = products.filter((item) => favourites[item.productId]);

    return (
        <div className="ppc-page fav-page">
            <main className="ppc-content">
                <div className="fav-header">
                    <h1 className="fav-title">Your favourites</h1>
                    {savedProducts.length > 0 && (
                        <span className="ppc-count-label">
                            {savedProducts.length} {savedProducts.length === 1 ? "product" : "products"}
                        </span>
                    )}
                </div>

                <div className="ppc-grid">
                    {savedProducts.map((item) => (
                        <div className="ppc-card" key={item.productId}>
                            <div className="ppc-card-img-wrap">
                                <Link to={`/product/${item.productId}`}>
                                    <img src={item.imageUrl} alt={item.productName} />
                                </Link>
                                <button
                                    className="ppc-heart active"
                                    onClick={(e) => toggleFavourite(e, item.productId)}
                                    aria-label="Remove from favourites"
                                >
                                    ♥
                                </button>
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
                    ))}
                </div>

                {!loading && savedProducts.length === 0 && (
                    <div className="ppc-empty">
                        <div className="ppc-empty-icon">♡</div>
                        <p>Tap the heart on any product to save it here.</p>
                        <Link className="ppc-clear-btn fav-browse" to="/products">Browse products</Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Favourites;
