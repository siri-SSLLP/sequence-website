import { useState } from "react";
import "./Checkout.css";

const CheckoutIcon = ({ type }) => {
  const icons = {
    visa: (
      <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="#1A1F71" />
        <text x="8" y="22" fontFamily="serif" fontSize="14" fontWeight="bold" fill="white" letterSpacing="1">VISA</text>
      </svg>
    ),
    mastercard: (
      <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="#252525" />
        <circle cx="18" cy="16" r="10" fill="#EB001B" />
        <circle cx="30" cy="16" r="10" fill="#F79E1B" />
        <path d="M24 8.27a10 10 0 0 1 0 15.46A10 10 0 0 1 24 8.27z" fill="#FF5F00" />
      </svg>
    ),
    rupay: (
      <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="#1B5E20" />
        <text x="6" y="21" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="white">RuPay</text>
      </svg>
    ),
    amex: (
      <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="#2E77BC" />
        <text x="5" y="21" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="white">AMEX</text>
      </svg>
    ),
    upi: (
      <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="#F5F5F5" />
        <text x="9" y="21" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill="#6C3BFF">UPI</text>
      </svg>
    ),
    gpay: (
      <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="white" />
        <text x="7" y="21" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#4285F4">G</text>
        <text x="15" y="21" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#EA4335">P</text>
        <text x="22" y="21" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#FBBC04">a</text>
        <text x="29" y="21" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#34A853">y</text>
      </svg>
    ),
    phonepe: (
      <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="#5F259F" />
        <text x="5" y="21" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="white">PhonePe</text>
      </svg>
    ),
    paytm: (
      <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="#00B9F1" />
        <text x="5" y="21" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="white">Paytm</text>
      </svg>
    ),
    netbanking: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    wallet: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="6" width="22" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M1 10h22" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="15" r="1.5" fill="currentColor" />
      </svg>
    ),
    cod: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  };
  return icons[type] || null;
};

const formatCardNumber = (val) =>
  val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (val) => {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
};

export default function Checkout() {
  const [activeMethod, setActiveMethod] = useState("card");
  const [cardType, setCardType] = useState("debit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiApp, setUpiApp] = useState(null);
  const [bank, setBank] = useState("");
  const [wallet, setWallet] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const orderItems = [
    { name: "Wireless Headphones", qty: 1, price: 2499 },
    { name: "Phone Case", qty: 2, price: 399 },
    { name: "USB-C Cable", qty: 1, price: 199 },
  ];
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 49;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="checkout-wrapper">
        <div className="checkout-success">
          <div className="success-checkmark">
            <svg viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="25" stroke="#22c55e" strokeWidth="2" />
              <path d="M14 26l8 8 16-16" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2>Payment Successful!</h2>
          <p>Order #ORD-{Math.floor(Math.random() * 900000 + 100000)} confirmed</p>
          <p className="success-amount">₹{total.toLocaleString("en-IN")}</p>
          <button className="btn-primary" onClick={() => setSubmitted(false)}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <div className="checkout-header-inner">
            <div className="checkout-header-lock">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Secure Checkout</span>
            </div>
            <div className="checkout-card-logos">
              {["visa", "mastercard", "rupay", "amex"].map((c) => (
                <span key={c} className="card-logo-sm"><CheckoutIcon type={c} /></span>
              ))}
            </div>
          </div>
          <div className="checkout-steps">
            <span className="step done">Cart</span>
            <span className="step-sep" />
            <span className="step done">Address</span>
            <span className="step-sep" />
            <span className="step active">Payment</span>
            <span className="step-sep" />
            <span className="step">Confirm</span>
          </div>
        </div>

        <div className="checkout-body">
          {/* LEFT — Payment Methods */}
          <div className="checkout-left">
            <h2 className="section-title">Payment Method</h2>

            {/* Method Tabs */}
            <div className="method-tabs">
              {[
                { key: "card", label: "Card" },
                { key: "upi", label: "UPI" },
                { key: "netbanking", label: "Net Banking" },
                { key: "wallet", label: "Wallets" },
                { key: "cod", label: "Cash on Delivery" },
              ].map((m) => (
                <button
                  key={m.key}
                  className={`method-tab ${activeMethod === m.key ? "active" : ""}`}
                  onClick={() => setActiveMethod(m.key)}
                >
                  <span className="method-tab-icon"><CheckoutIcon type={m.key} /></span>
                  {m.label}
                </button>
              ))}
            </div>

            {/* ───── CARD PANEL ───── */}
            {activeMethod === "card" && (
              <div className="panel card-panel">
                <div className="card-type-toggle">
                  {["debit", "credit"].map((t) => (
                    <button
                      key={t}
                      className={`toggle-btn ${cardType === t ? "active" : ""}`}
                      onClick={() => setCardType(t)}
                    >
                      {t === "debit" ? "Debit Card" : "Credit Card"}
                    </button>
                  ))}
                </div>

                {/* Card visual */}
                <div
                  className={`card-visual ${flipped ? "flipped" : ""}`}
                  onClick={() => setFlipped(!flipped)}
                >
                  <div className="card-visual-inner">
                    <div className="card-front">
                      <div className="card-chip">
                        <svg viewBox="0 0 30 24" fill="none" width="36">
                          <rect x="1" y="1" width="28" height="22" rx="3" fill="#d4a843" stroke="#b8922e" strokeWidth="1" />
                          <line x1="10" y1="1" x2="10" y2="23" stroke="#b8922e" strokeWidth="1" />
                          <line x1="20" y1="1" x2="20" y2="23" stroke="#b8922e" strokeWidth="1" />
                          <line x1="1" y1="8" x2="29" y2="8" stroke="#b8922e" strokeWidth="1" />
                          <line x1="1" y1="16" x2="29" y2="16" stroke="#b8922e" strokeWidth="1" />
                        </svg>
                      </div>
                      <div className="card-network">
                        <CheckoutIcon type="visa" />
                      </div>
                      <div className="card-number-display">
                        {(cardNumber || "•••• •••• •••• ••••")
                          .padEnd(19, "•")
                          .slice(0, 19)}
                      </div>
                      <div className="card-bottom">
                        <div>
                          <div className="card-label">Card Holder</div>
                          <div className="card-value">{cardName || "FULL NAME"}</div>
                        </div>
                        <div>
                          <div className="card-label">Expires</div>
                          <div className="card-value">{expiry || "MM/YY"}</div>
                        </div>
                      </div>
                    </div>
                    <div className="card-back">
                      <div className="card-mag-strip" />
                      <div className="card-cvv-row">
                        <div className="card-signature" />
                        <div className="card-cvv-box">
                          <div className="card-label">CVV</div>
                          <div className="card-value">{cvv ? "•••" : "•••"}</div>
                        </div>
                      </div>
                      <div className="card-back-logo">
                        <CheckoutIcon type="visa" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="card-flip-hint">Tap card to flip</p>

                <form className="card-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Card Number</label>
                    <div className="input-icon-wrap">
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        inputMode="numeric"
                        required
                      />
                      <span className="input-card-icon"><CheckoutIcon type="visa" /></span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Name on Card</label>
                    <input
                      type="text"
                      placeholder="As printed on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        inputMode="numeric"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        maxLength={4}
                        inputMode="numeric"
                        onFocus={() => setFlipped(true)}
                        onBlur={() => setFlipped(false)}
                        required
                      />
                    </div>
                  </div>
                  <div className="accepted-cards">
                    <span>Accepted:</span>
                    {["visa", "mastercard", "rupay", "amex"].map((c) => (
                      <span key={c} className="card-logo-sm"><CheckoutIcon type={c} /></span>
                    ))}
                  </div>
                  <button type="submit" className="btn-primary pay-btn">
                    Pay ₹{total.toLocaleString("en-IN")}
                    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              </div>
            )}

            {/* ───── UPI PANEL ───── */}
            {activeMethod === "upi" && (
              <div className="panel upi-panel">
                <p className="panel-subtitle">Pay instantly via any UPI app</p>
                <div className="upi-apps">
                  {[
                    { key: "gpay", label: "Google Pay" },
                    { key: "phonepe", label: "PhonePe" },
                    { key: "paytm", label: "Paytm" },
                    { key: "upi", label: "Other UPI" },
                  ].map((app) => (
                    <button
                      key={app.key}
                      className={`upi-app-btn ${upiApp === app.key ? "active" : ""}`}
                      onClick={() => setUpiApp(app.key)}
                    >
                      <CheckoutIcon type={app.key} />
                      <span>{app.label}</span>
                    </button>
                  ))}
                </div>
                <div className="upi-divider"><span>or enter UPI ID</span></div>
                <form className="upi-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>UPI ID</label>
                    <div className="upi-input-wrap">
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        required={!upiApp}
                      />
                      <button type="button" className="verify-btn">Verify</button>
                    </div>
                    <span className="input-hint">e.g. mobilenumber@paytm, name@okaxis</span>
                  </div>
                  <button type="submit" className="btn-primary pay-btn">
                    Pay ₹{total.toLocaleString("en-IN")}
                    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              </div>
            )}

            {/* ───── NET BANKING PANEL ───── */}
            {activeMethod === "netbanking" && (
              <div className="panel netbanking-panel">
                <p className="panel-subtitle">Select your bank to proceed</p>
                <div className="popular-banks">
                  {[
                    { id: "sbi", name: "State Bank of India", color: "#1B4E9B" },
                    { id: "hdfc", name: "HDFC Bank", color: "#004C8F" },
                    { id: "icici", name: "ICICI Bank", color: "#B02A2A" },
                    { id: "axis", name: "Axis Bank", color: "#97144D" },
                    { id: "kotak", name: "Kotak Bank", color: "#E31837" },
                    { id: "yes", name: "Yes Bank", color: "#1E4DA1" },
                  ].map((b) => (
                    <button
                      key={b.id}
                      className={`bank-btn ${bank === b.id ? "active" : ""}`}
                      onClick={() => setBank(b.id)}
                    >
                      <span className="bank-dot" style={{ background: b.color }} />
                      {b.name}
                    </button>
                  ))}
                </div>
                <div className="form-group" style={{ marginTop: "1rem" }}>
                  <label>Or select from all banks</label>
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="bank-select"
                  >
                    <option value="">-- Choose Bank --</option>
                    <option>Bank of Baroda</option>
                    <option>Canara Bank</option>
                    <option>Punjab National Bank</option>
                    <option>Union Bank of India</option>
                    <option>Indian Bank</option>
                    <option>Federal Bank</option>
                    <option>IndusInd Bank</option>
                    <option>IDFC First Bank</option>
                  </select>
                </div>
                <form onSubmit={handleSubmit}>
                  <button type="submit" className="btn-primary pay-btn" style={{ marginTop: "1.5rem" }}>
                    Proceed to Bank
                    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              </div>
            )}

            {/* ───── WALLET PANEL ───── */}
            {activeMethod === "wallet" && (
              <div className="panel wallet-panel">
                <p className="panel-subtitle">Choose a digital wallet</p>
                <div className="wallet-list">
                  {[
                    { key: "paytm", label: "Paytm Wallet", balance: "₹450" },
                    { key: "phonepe", label: "PhonePe Wallet", balance: "₹120" },
                    { key: "gpay", label: "Amazon Pay", balance: "₹0" },
                    { key: "upi", label: "Mobikwik", balance: "₹85" },
                  ].map((w) => (
                    <button
                      key={w.key}
                      className={`wallet-item ${wallet === w.key ? "active" : ""}`}
                      onClick={() => setWallet(w.key)}
                    >
                      <span className="wallet-icon"><CheckoutIcon type={w.key} /></span>
                      <span className="wallet-name">{w.label}</span>
                      <span className="wallet-balance">Balance: {w.balance}</span>
                    </button>
                  ))}
                </div>
                <form onSubmit={handleSubmit}>
                  <button type="submit" className="btn-primary pay-btn" style={{ marginTop: "1.5rem" }}>
                    Pay from Wallet
                    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              </div>
            )}

            {/* ───── COD PANEL ───── */}
            {activeMethod === "cod" && (
              <div className="panel cod-panel">
                <div className="cod-icon">
                  <svg viewBox="0 0 64 64" fill="none" width="64">
                    <circle cx="32" cy="32" r="30" fill="#fef9c3" stroke="#eab308" strokeWidth="2" />
                    <path d="M20 32l8 8 16-16" stroke="#eab308" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3>Cash on Delivery</h3>
                <p className="cod-desc">
                  Pay in cash when your order is delivered. Please keep exact change ready.
                </p>
                <div className="cod-notice">
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  COD charge of ₹40 will be added at checkout
                </div>
                <label className="agree-label">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                  I agree to pay cash on delivery
                </label>
                <form onSubmit={handleSubmit}>
                  <button type="submit" className="btn-primary pay-btn" disabled={!agreed} style={{ marginTop: "1.5rem" }}>
                    Confirm COD Order
                    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              </div>
            )}

            {/* Security badges */}
            <div className="security-row">
              {["SSL Secured", "PCI DSS", "256-bit Encryption"].map((b) => (
                <span key={b} className="security-badge">
                  <svg viewBox="0 0 24 24" fill="none" width="12" height="12">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — Order Summary */}
          <div className="checkout-right">
            <div className="order-summary">
              <h2 className="section-title">Order Summary</h2>
              <div className="order-items">
                {orderItems.map((item, i) => (
                  <div key={i} className="order-item">
                    <div className="order-item-img" />
                    <div className="order-item-info">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-qty">Qty: {item.qty}</span>
                    </div>
                    <span className="order-item-price">
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="coupon-row">
                <input type="text" placeholder="Coupon code" className="coupon-input" />
                <button className="coupon-btn">Apply</button>
              </div>

              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="price-row">
                  <span>Shipping</span>
                  <span className="text-green">₹{shipping}</span>
                </div>
                <div className="price-row">
                  <span>GST (18%)</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>
                <div className="price-row total-row">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="delivery-info">
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                  <rect x="1" y="3" width="15" height="13" rx="1" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 8h4l3 5v3h-7V8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>Estimated delivery: <strong>2–4 business days</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}