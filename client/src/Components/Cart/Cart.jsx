import React, { useContext, useMemo, useState } from "react";
import { ProductContext } from "../../Context/Context";
import { product as products } from "../../assets/assets";
import {
  FaTrash,
  FaTag,
  FaLock,
  FaShoppingCart,
  FaTruck,
  FaCreditCard,
  FaWallet,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import "./Cart.css";

const Cart = () => {
  const { cart, setCart } = useContext(ProductContext);

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const coupons = {
    SAVE10: 0.1,
    SAVE20: 0.2,
    FIRST50: 0.5,
  };

  const cartItems = useMemo(() => {
    return Object.keys(cart)
      .map((id) => {
        const found = products.find((p) => p.productId === id);
        return found ? { ...found, quantity: cart[id] } : null;
      })
      .filter(Boolean);
  }, [cart]);

  const subtotal = cartItems.reduce((a, i) => a + i.mrpPrice * i.quantity, 0);
  const totalBeforeCoupon = cartItems.reduce(
    (a, i) => a + (i.salePrice ?? i.mrpPrice) * i.quantity,
    0
  );

  const discountFromCoupon = appliedCoupon
    ? totalBeforeCoupon * coupons[appliedCoupon]
    : 0;

  const finalTotal = totalBeforeCoupon - discountFromCoupon;

  const totalQty = cartItems.reduce((a, i) => a + i.quantity, 0);

  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  const applyCoupon = () => {
    const code = coupon.toUpperCase();
    if (coupons[code]) {
      setAppliedCoupon(code);
    } else {
      alert("Invalid Coupon Code");
    }
  };

  const increaseQty = (id) =>
    setCart((prev) => ({ ...prev, [id]: prev[id] + 1 }));

  const decreaseQty = (id) =>
    setCart((prev) => {
      if (prev[id] === 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: prev[id] - 1 };
    });

  const removeItem = (id) =>
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  return (
    <div className="container py-4 py-md-5">
      <div className="row g-4">

        {/* LEFT */}
        <div className="col-lg-8">
          <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
            <FaShoppingCart /> Your Cart ({totalQty})
          </h4>

          {cartItems.length === 0 ? (
            <div className="empty-box">
              <FaShoppingCart size={40} />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => {
              const hasSale = item.salePrice && item.salePrice < item.mrpPrice;

              return (
                <div key={item.productId} className="cart-card">
                  <div className="cart-grid">

                    {/* IMAGE */}
                    <div className="cart-img-box">
                      <img src={item.imageUrl} alt={item.productName} />
                    </div>

                    {/* INFO */}
                    <div className="cart-info">
                      <h6 className="product-name">{item.productName}</h6>

                      <div className="price">
                        {hasSale ? (
                          <>
                            <span className="sale">{fmt(item.salePrice)}</span>
                            <span className="mrp">{fmt(item.mrpPrice)}</span>
                          </>
                        ) : (
                          <span className="sale">{fmt(item.mrpPrice)}</span>
                        )}
                      </div>

                      <div className="cart-actions">
                        <div className="qty-box">
                          <button onClick={() => decreaseQty(item.productId)}>
                            <FaMinus />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => increaseQty(item.productId)}>
                            <FaPlus />
                          </button>
                        </div>

                        <div className="line-total">
                          {fmt((item.salePrice ?? item.mrpPrice) * item.quantity)}
                        </div>
                      </div>
                    </div>

                    {/* DELETE */}
                    <div className="cart-delete">
                      <button onClick={() => removeItem(item.productId)}>
                        <FaTrash />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT */}
        <div className="col-lg-4 mt-5">
          <div className="summary-card">

            <h5 className="fw-bold mb-3">Order Summary</h5>

            {/* COUPON */}
            <div className="coupon-box">
              <FaTag />
              <input
                type="text"
                placeholder="Coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button onClick={applyCoupon}>Apply</button>
            </div>

            {appliedCoupon && (
              <p className="coupon-success">
                Applied: {appliedCoupon}
              </p>
            )}

            {/* PRICE */}
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Discount</span>
              <span className="green">
                - {fmt(subtotal - totalBeforeCoupon)}
              </span>
            </div>

            {appliedCoupon && (
              <div className="summary-row">
                <span>Coupon</span>
                <span className="green">
                  - {fmt(discountFromCoupon)}
                </span>
              </div>
            )}

            <div className="summary-row">
              <span><FaTruck /> Shipping</span>
              <span className="free">Free</span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total</span>
              <span>{fmt(finalTotal)}</span>
            </div>

            {/* PAYMENT */}
            <div className="payment-box">
              <p className="fw-semibold mb-2">Payment</p>

              <label><input type="radio" name="pay" defaultChecked /> <FaWallet /> UPI</label>
              <label><input type="radio" name="pay" /> <FaCreditCard /> Card</label>
              <label><input type="radio" name="pay" /> <FaTruck /> COD</label>
            </div>

            <button className="checkout-btn">
              <FaLock /> Secure Checkout
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;