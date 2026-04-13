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
  FaChevronRight,
} from "react-icons/fa";
import "./Cart.css";

const Cart = () => {
  const { cart, setCart } = useContext(ProductContext);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [payMethod, setPayMethod] = useState("upi");

  const coupons = { SAVE10: 0.1, SAVE20: 0.2, FIRST50: 0.5 };

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
  const totalSaved = subtotal - finalTotal;

  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (coupons[code]) {
      setAppliedCoupon(code);
    } else {
      alert("Invalid Coupon Code");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCoupon("");
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
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <div className="cart-header-inner">
          <span className="cart-eyebrow">Shopping Bag</span>
          <h1 className="cart-title">
            {totalQty === 0 ? "Your bag is empty" : `${totalQty} item${totalQty > 1 ? "s" : ""}`}
          </h1>
        </div>
      </div>

      <div className="cart-body">
        {/* LEFT — Items */}
        <div className="cart-left">
          {cartItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FaShoppingCart />
              </div>
              <p className="empty-text">Add items to get started</p>
              <button className="empty-cta">Continue Shopping <FaChevronRight /></button>
            </div>
          ) : (
            <div className="items-list">
              {cartItems.map((item, idx) => {
                const hasSale = item.salePrice && item.salePrice < item.mrpPrice;
                const savings = hasSale
                  ? ((1 - item.salePrice / item.mrpPrice) * 100).toFixed(0)
                  : null;

                return (
                  <div
                    key={item.productId}
                    className="item-row"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="item-img-wrap">
                      <img src={item.imageUrl} alt={item.productName} className="item-img" />
                      {savings && <span className="item-badge">-{savings}%</span>}
                    </div>

                    <div className="item-body">
                      <div className="item-top">
                        <h3 className="item-name">{item.productName}</h3>
                        <button
                          className="item-remove"
                          onClick={() => removeItem(item.productId)}
                          aria-label="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      <div className="item-prices">
                        {hasSale ? (
                          <>
                            <span className="price-sale">{fmt(item.salePrice)}</span>
                            <span className="price-mrp">{fmt(item.mrpPrice)}</span>
                          </>
                        ) : (
                          <span className="price-sale">{fmt(item.mrpPrice)}</span>
                        )}
                      </div>

                      <div className="item-footer">
                        <div className="qty-control">
                          <button
                            className="qty-btn"
                            onClick={() => decreaseQty(item.productId)}
                          >
                            <FaMinus />
                          </button>
                          <span className="qty-num">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => increaseQty(item.productId)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <span className="item-line-total">
                          {fmt((item.salePrice ?? item.mrpPrice) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Savings Banner */}
          {totalSaved > 0 && (
            <div className="savings-banner">
              <span className="savings-icon">✦</span>
              <span>You're saving <strong>{fmt(totalSaved)}</strong> on this order</span>
            </div>
          )}
        </div>

        {/* RIGHT — Summary */}
        <div className="cart-right">
          <div className="summary-panel">

            {/* Coupon */}
            <div className="section-label">Promo Code</div>
            {!appliedCoupon ? (
              <div className="coupon-row">
                <div className="coupon-input-wrap">
                  <FaTag className="coupon-icon" />
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="Enter code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                  />
                </div>
                <button className="coupon-apply-btn" onClick={applyCoupon}>
                  Apply
                </button>
              </div>
            ) : (
              <div className="coupon-applied">
                <div className="coupon-applied-left">
                  <span className="coupon-check">✓</span>
                  <span className="coupon-code-text">{appliedCoupon}</span>
                  <span className="coupon-discount-label">
                    -{(coupons[appliedCoupon] * 100).toFixed(0)}% off
                  </span>
                </div>
                <button className="coupon-remove" onClick={removeCoupon}>Remove</button>
              </div>
            )}

            <div className="divider" />

            {/* Price Breakdown */}
            <div className="section-label">Order Summary</div>
            <div className="price-rows">
              <div className="price-row">
                <span>Subtotal (MRP)</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="price-row discount">
                <span>Product Discount</span>
                <span>− {fmt(subtotal - totalBeforeCoupon)}</span>
              </div>
              {appliedCoupon && (
                <div className="price-row discount">
                  <span>Coupon ({appliedCoupon})</span>
                  <span>− {fmt(discountFromCoupon)}</span>
                </div>
              )}
              <div className="price-row free-ship">
                <span>
                  <FaTruck style={{ marginRight: 6 }} />
                  Delivery
                </span>
                <span className="free-tag">FREE</span>
              </div>
            </div>

            <div className="divider" />

            <div className="total-row">
              <span>Total</span>
              <span>{fmt(finalTotal)}</span>
            </div>

            <div className="divider" />

            {/* Payment */}
            <div className="section-label">Payment Method</div>
            <div className="payment-methods">
              {[
                { id: "upi", icon: <FaWallet />, label: "UPI" },
                { id: "card", icon: <FaCreditCard />, label: "Card" },
                { id: "cod", icon: <FaTruck />, label: "Cash on Delivery" },
              ].map(({ id, icon, label }) => (
                <label
                  key={id}
                  className={`pay-option ${payMethod === id ? "pay-active" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={id}
                    checked={payMethod === id}
                    onChange={() => setPayMethod(id)}
                  />
                  <span className="pay-icon">{icon}</span>
                  <span className="pay-label">{label}</span>
                  {payMethod === id && <span className="pay-dot" />}
                </label>
              ))}
            </div>

            <button className="checkout-btn" disabled={cartItems.length === 0}>
              <FaLock style={{ fontSize: 13 }} />
              Secure Checkout · {fmt(finalTotal)}
            </button>

            <p className="checkout-note">
              By placing your order you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;