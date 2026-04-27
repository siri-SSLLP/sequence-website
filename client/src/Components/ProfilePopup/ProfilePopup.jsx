// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './ProfilePopup.css';
// import { IoClose } from "react-icons/io5";
// import {
//     FaUser, FaMapMarkerAlt, FaShoppingBag, FaLock, FaSignOutAlt,
//     FaCamera, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaChevronDown, FaChevronUp
// } from "react-icons/fa";
// import { MdPhone, MdLocationOn, MdPayment } from "react-icons/md";

// const API_BASE = "https://testingserver-73um.onrender.com/api/users/";

// // ── Order status steps ──────────────────────────────────────────────────────
// const ORDER_STEPS = [
//     { key: "pending",   label: "Order Placed",  emoji: "📋", desc: "Your order has been received" },
//     { key: "paid",      label: "Payment Done",  emoji: "💳", desc: "Payment confirmed successfully" },
//     { key: "packed",    label: "Packed",        emoji: "📦", desc: "Your order is being packed" },
//     { key: "shipped",   label: "Shipped",       emoji: "🚚", desc: "Order is on the way" },
//     { key: "delivered", label: "Delivered",     emoji: "🏠", desc: "Order delivered successfully" },
// ];

// function getStepIndex(status) {
//     const idx = ORDER_STEPS.findIndex(s => s.key === status);
//     return idx === -1 ? 1 : idx;
// }

// function OrderStatusStepper({ status }) {
//     if (status === "cancelled" || status === "failed" || status === "refunded") {
//         const labels = {
//             cancelled: ["❌", "Order Cancelled", "This order was cancelled"],
//             failed:    ["⚠️", "Payment Failed",  "Payment could not be processed"],
//             refunded:  ["↩️", "Refunded",        "Amount has been refunded"]
//         };
//         const [emoji, label, desc] = labels[status];
//         return (
//             <div className="stepper-cancelled">
//                 <div className="cancelled-icon">{emoji}</div>
//                 <div><p className="step-label-active">{label}</p><p className="step-desc">{desc}</p></div>
//             </div>
//         );
//     }

//     const currentIdx = getStepIndex(status);
//     return (
//         <div className="order-stepper">
//             {ORDER_STEPS.map((step, idx) => {
//                 const isDone   = idx < currentIdx;
//                 const isActive = idx === currentIdx;
//                 return (
//                     <div key={step.key} className="stepper-row">
//                         <div className="stepper-col">
//                             <div className={`stepper-dot ${isDone ? "dot-done" : isActive ? "dot-active" : "dot-pending"}`}>
//                                 {isDone ? "✓" : step.emoji}
//                             </div>
//                             {idx < ORDER_STEPS.length - 1 && (
//                                 <div className={`stepper-line ${isDone ? "line-done" : ""}`} />
//                             )}
//                         </div>
//                         <div className={`stepper-text ${idx > currentIdx ? "text-faded" : ""}`}>
//                             <p className={`step-label ${isActive ? "step-label-active" : ""}`}>{step.label}</p>
//                             {isActive && <p className="step-desc">{step.desc}</p>}
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// function getStatusMeta(status) {
//     const map = {
//         pending:   { text: "Order Placed",  cls: "s-pending" },
//         paid:      { text: "Paid",          cls: "s-paid" },
//         packed:    { text: "Packed",        cls: "s-packed" },
//         shipped:   { text: "Shipped",       cls: "s-shipped" },
//         delivered: { text: "Delivered",     cls: "s-delivered" },
//         cancelled: { text: "Cancelled",     cls: "s-cancelled" },
//         failed:    { text: "Failed",        cls: "s-failed" },
//         refunded:  { text: "Refunded",      cls: "s-refunded" },
//     };
//     return map[status] || { text: status, cls: "s-pending" };
// }

// function OrderCard({ order }) {
//     const [expanded, setExpanded] = useState(false);
//     const meta = getStatusMeta(order.status);

//     return (
//         <div className={`order-card ocard-${order.status}`}>
//             {/* ── Top Row ── */}
//             <div className="ocard-header" onClick={() => setExpanded(v => !v)}>
//                 <div className="ocard-left">
//                     <div className="ocard-bag"><FaShoppingBag /></div>
//                     <div>
//                         <p className="ocard-id">
//                             #{(order.orderId || order._id || "").toString().slice(-10).toUpperCase()}
//                         </p>
//                         <p className="ocard-date">
//                             {new Date(order.createdAt).toLocaleDateString("en-IN", {
//                                 day: "numeric", month: "short", year: "numeric"
//                             })}
//                         </p>
//                     </div>
//                 </div>
//                 <div className="ocard-right">
//                     <span className={`status-pill ${meta.cls}`}>{meta.text}</span>
//                     <span className="ocard-amount">₹{order.total ?? order.amount}</span>
//                     <span className="ocard-chevron">{expanded ? <FaChevronUp /> : <FaChevronDown />}</span>
//                 </div>
//             </div>

//             {/* ── Items Preview ── */}
//             <div className="ocard-preview">
//                 {(order.items || []).slice(0, 3).map((item, i) => (
//                     <div key={i} className="preview-chip">
//                         {item.image
//                             ? <img src={item.image} alt={item.name} />
//                             : <div className="chip-placeholder">📦</div>}
//                         <span className="chip-name">{item.name}</span>
//                         <span className="chip-qty">×{item.quantity}</span>
//                     </div>
//                 ))}
//                 {(order.items || []).length > 3 && (
//                     <span className="preview-more">+{order.items.length - 3} more</span>
//                 )}
//             </div>

//             {/* ── Expanded Body ── */}
//             {expanded && (
//                 <div className="ocard-body">
//                     <div className="ocard-section">
//                         <p className="section-title">🛍️ Items Ordered</p>
//                         {(order.items || []).map((item, i) => (
//                             <div key={i} className="item-row">
//                                 {item.image
//                                     ? <img src={item.image} alt={item.name} className="item-img" />
//                                     : <div className="item-img-ph">📦</div>}
//                                 <div className="item-info">
//                                     <p className="item-name">{item.name}</p>
//                                     <p className="item-meta">Qty {item.quantity} × ₹{item.price}</p>
//                                 </div>
//                                 <p className="item-total">₹{((item.quantity || 1) * (item.price || 0)).toFixed(0)}</p>
//                             </div>
//                         ))}
//                         <div className="items-total-row">
//                             <span>Total Paid</span>
//                             <strong>₹{order.total ?? order.amount}</strong>
//                         </div>
//                     </div>

//                     <div className="ocard-section">
//                         <p className="section-title">📍 Order Tracking</p>
//                         <OrderStatusStepper status={order.status} />
//                     </div>

//                     {order.shippingAddress && (
//                         <div className="ocard-section">
//                             <p className="section-title">📬 Delivery Address</p>
//                             <div className="addr-box">
//                                 <MdLocationOn className="addr-icon" />
//                                 <div>
//                                     <p className="addr-name">{order.shippingAddress.name}</p>
//                                     <p>{order.shippingAddress.address}</p>
//                                     <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
//                                     {order.shippingAddress.phone && <p>📞 {order.shippingAddress.phone}</p>}
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     <div className="ocard-section ocard-payment">
//                         <p className="section-title">💳 Payment Info</p>
//                         <div className="payment-row">
//                             <span>{order.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay"}</span>
//                             {order.razorpayPaymentId && (
//                                 <span className="pay-id">ID: …{order.razorpayPaymentId.slice(-8)}</span>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// // ── Main Component ────────────────────────────────────────────────────────────
// function ProfilePopup({ onClose, onLogout }) {
//     const [activeTab, setActiveTab]         = useState("profile");
//     const [loading, setLoading]             = useState(false);
//     const [dataLoading, setDataLoading]     = useState(true);   // ← skeleton flag
//     const [message, setMessage]             = useState({ type: "", text: "" });
//     const [ordersLoading, setOrdersLoading] = useState(false);

//     const [user, setUser]           = useState({ name: "", email: "", phone: "", profileImage: "", gender: "", dob: "" });
//     const [addresses, setAddresses] = useState([]);
//     const [showAddressForm, setShowAddressForm]   = useState(false);
//     const [editingAddressId, setEditingAddressId] = useState(null);
//     const [addressForm, setAddressForm] = useState({
//         fullName: "", phone: "", pincode: "", addressLine1: "", addressLine2: "",
//         city: "", state: "", country: "India", addressType: "Home", isDefault: false,
//     });
//     const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
//     const [orders, setOrders] = useState([]);

//     const fileInputRef = useRef(null);
//     const token = localStorage.getItem("token");

//     useEffect(() => { loadUserData(); loadAddresses(); loadOrders(); }, []);
//     useEffect(() => {
//         if (message.text) {
//             const t = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//             return () => clearTimeout(t);
//         }
//     }, [message]);

//     const showMessage = (type, text) => setMessage({ type, text });

//     const loadUserData = async () => {
//         try {
//             const res = await axios.get(`${API_BASE}profile`, { headers: { Authorization: `Bearer ${token}` } });
//             setUser(res.data);
//         } catch {
//             if (token) {
//                 try {
//                     const d = JSON.parse(atob(token.split(".")[1]));
//                     setUser(p => ({ ...p, name: d.name || "User" }));
//                 } catch {}
//             }
//         } finally {
//             setDataLoading(false); // ← stop skeleton
//         }
//     };

//     const loadAddresses = async () => {
//         try {
//             const res = await axios.get(`${API_BASE}addresses`, { headers: { Authorization: `Bearer ${token}` } });
//             setAddresses(res.data || []);
//         } catch { setAddresses([]); }
//     };

//     const loadOrders = async () => {
//         setOrdersLoading(true);
//         try {
//             const res = await axios.get(`${API_BASE}orders`, { headers: { Authorization: `Bearer ${token}` } });
//             const normalized = (res.data || []).map(o => ({
//                 ...o,
//                 orderId: o.razorpayOrderId,
//                 total:   o.amount,
//                 items:   (o.items || []).map(i => ({ ...i, name: i.productName, image: i.imageUrl })),
//             }));
//             setOrders(normalized);
//         } catch { setOrders([]); }
//         setOrdersLoading(false);
//     };

//     const handleProfileUpdate = async (e) => {
//         e.preventDefault(); setLoading(true);
//         try {
//             const res = await axios.put(`${API_BASE}profile`, user, { headers: { Authorization: `Bearer ${token}` } });
//             if (res.data.token) { localStorage.setItem("token", res.data.token); window.dispatchEvent(new Event("storage")); }
//             showMessage("success", "Profile updated successfully!");
//         } catch (err) { showMessage("error", err.response?.data?.message || "Update failed"); }
//         setLoading(false);
//     };

//     const handleImageUpload = async (e) => {
//         const file = e.target.files[0]; if (!file) return;
//         const reader = new FileReader();
//         reader.onloadend = async () => {
//             setUser(p => ({ ...p, profileImage: reader.result }));
//             try {
//                 setLoading(true);
//                 await axios.put(`${API_BASE}profile-image`, { profileImage: reader.result }, { headers: { Authorization: `Bearer ${token}` } });
//                 showMessage("success", "Profile picture updated!");
//             } catch { showMessage("error", "Upload failed"); }
//             setLoading(false);
//         };
//         reader.readAsDataURL(file);
//     };

//     const handleAddressSubmit = async (e) => {
//         e.preventDefault(); setLoading(true);
//         try {
//             if (editingAddressId) {
//                 await axios.put(`${API_BASE}addresses/${editingAddressId}`, addressForm, { headers: { Authorization: `Bearer ${token}` } });
//                 showMessage("success", "Address updated!");
//             } else {
//                 await axios.post(`${API_BASE}addresses`, addressForm, { headers: { Authorization: `Bearer ${token}` } });
//                 showMessage("success", "Address added!");
//             }
//             resetAddressForm(); loadAddresses();
//         } catch { showMessage("error", "Failed to save address"); }
//         setLoading(false);
//     };

//     const handleEditAddress   = (a) => { setAddressForm(a); setEditingAddressId(a._id); setShowAddressForm(true); };
//     const handleDeleteAddress = async (id) => {
//         if (!window.confirm("Delete this address?")) return;
//         try {
//             await axios.delete(`${API_BASE}addresses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//             showMessage("success", "Deleted!"); loadAddresses();
//         } catch { showMessage("error", "Delete failed"); }
//     };
//     const handleSetDefault = async (id) => {
//         try {
//             await axios.put(`${API_BASE}addresses/${id}/default`, {}, { headers: { Authorization: `Bearer ${token}` } });
//             loadAddresses(); showMessage("success", "Default updated!");
//         } catch { showMessage("error", "Failed"); }
//     };
//     const resetAddressForm = () => {
//         setAddressForm({ fullName: "", phone: "", pincode: "", addressLine1: "", addressLine2: "", city: "", state: "", country: "India", addressType: "Home", isDefault: false });
//         setEditingAddressId(null); setShowAddressForm(false);
//     };

//     const handlePasswordChange = async (e) => {
//         e.preventDefault();
//         if (passwordForm.newPassword !== passwordForm.confirmPassword) return showMessage("error", "Passwords don't match");
//         if (passwordForm.newPassword.length < 6) return showMessage("error", "Min 6 characters");
//         setLoading(true);
//         try {
//             await axios.put(`${API_BASE}change-password`, { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }, { headers: { Authorization: `Bearer ${token}` } });
//             setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
//             showMessage("success", "Password changed!");
//         } catch (err) { showMessage("error", err.response?.data?.message || "Failed"); }
//         setLoading(false);
//     };

//     const handleLogout = () => {
//         if (!window.confirm("Logout?")) return;
//         localStorage.removeItem("token");
//         window.dispatchEvent(new Event("storage"));
//         if (onLogout) onLogout();
//         onClose();
//         window.location.reload();
//     };

//     return (
//         <div className="profile-popup-overlay" onClick={onClose}>
//             <div className="profile-popup-container" onClick={e => e.stopPropagation()}>
//                 <button className="profile-close-btn" onClick={onClose}><IoClose /></button>

//                 {/* SIDEBAR */}
//                 <div className="profile-sidebar">
//                     <div className="profile-user-card">
//                         <div className="profile-image-wrapper">
//                             {dataLoading ? (
//                                 <div className="skel skel-circle" style={{ width: 80, height: 80 }} />
//                             ) : (
//                                 <>
//                                     {user.profileImage
//                                         ? <img src={user.profileImage} alt="Profile" className="profile-image" />
//                                         : <div className="profile-image-placeholder">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>}
//                                     <button className="profile-camera-btn" onClick={() => fileInputRef.current?.click()}><FaCamera /></button>
//                                     <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: "none" }} />
//                                 </>
//                             )}
//                         </div>
//                         {dataLoading ? (
//                             <>
//                                 <div className="skel skel-text" style={{ width: 120, margin: '10px auto 6px' }} />
//                                 <div className="skel skel-text" style={{ width: 160, margin: '0 auto' }} />
//                             </>
//                         ) : (
//                             <>
//                                 <h3 className="profile-user-name">{user.name || "User"}</h3>
//                                 <p className="profile-user-email">{user.email || user.phone}</p>
//                             </>
//                         )}
//                     </div>

//                     <ul className="profile-nav">
//                         {[
//                             { key: "profile",   label: "My Profile",     icon: <FaUser /> },
//                             { key: "addresses", label: "My Addresses",    icon: <FaMapMarkerAlt /> },
//                             { key: "orders",    label: "My Orders",       icon: <FaShoppingBag />, badge: orders.length || null },
//                             { key: "password",  label: "Change Password", icon: <FaLock /> },
//                         ].map(t => (
//                             <li key={t.key} className={activeTab === t.key ? "active" : ""} onClick={() => setActiveTab(t.key)}>
//                                 {t.icon}<span>{t.label}</span>
//                                 {t.badge ? <span className="nav-badge">{t.badge}</span> : null}
//                             </li>
//                         ))}
//                         <li className="logout-item" onClick={handleLogout}><FaSignOutAlt /><span>Logout</span></li>
//                     </ul>
//                 </div>

//                 {/* CONTENT */}
//                 <div className="profile-content">
//                     {message.text && <div className={`profile-message ${message.type}`}>{message.text}</div>}

//                     {/* PROFILE TAB */}
//                     {activeTab === "profile" && (
//                         <div className="tab-content">
//                             <h2>My Profile</h2>
//                             <p className="tab-subtitle">Manage your personal information</p>

//                             {dataLoading ? (
//                                 <div className="skeleton-form">
//                                     <div className="skel-row">
//                                         <div className="skel skel-input" />
//                                         <div className="skel skel-input" />
//                                     </div>
//                                     <div className="skel-row">
//                                         <div className="skel skel-input" />
//                                         <div className="skel skel-input" />
//                                     </div>
//                                     <div className="skel-row">
//                                         <div className="skel skel-input" style={{ width: '48%' }} />
//                                     </div>
//                                     <div className="skel skel-btn" />
//                                 </div>
//                             ) : (
//                                 <form onSubmit={handleProfileUpdate} className="profile-form">
//                                     <div className="form-row">
//                                         <div className="form-group"><label>Full Name</label><input type="text" value={user.name || ""} onChange={e => setUser({ ...user, name: e.target.value })} placeholder="Enter your name" /></div>
//                                         <div className="form-group"><label>Email</label><input type="email" value={user.email || ""} onChange={e => setUser({ ...user, email: e.target.value })} placeholder="Enter email" /></div>
//                                     </div>
//                                     <div className="form-row">
//                                         <div className="form-group"><label>Phone Number</label><input type="tel" value={user.phone || ""} onChange={e => setUser({ ...user, phone: e.target.value })} placeholder="Enter phone" /></div>
//                                         <div className="form-group"><label>Gender</label>
//                                             <select value={user.gender || ""} onChange={e => setUser({ ...user, gender: e.target.value })}>
//                                                 <option value="">Select Gender</option>
//                                                 <option value="Male">Male</option>
//                                                 <option value="Female">Female</option>
//                                                 <option value="Other">Other</option>
//                                             </select>
//                                         </div>
//                                     </div>
//                                     <div className="form-row">
//                                         <div className="form-group"><label>Date of Birth</label><input type="date" value={user.dob ? user.dob.split("T")[0] : ""} onChange={e => setUser({ ...user, dob: e.target.value })} /></div>
//                                     </div>
//                                     <button type="submit" className="profile-save-btn" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
//                                 </form>
//                             )}
//                         </div>
//                     )}

//                     {/* ADDRESSES TAB */}
//                     {activeTab === "addresses" && (
//                         <div className="tab-content">
//                             <div className="tab-header">
//                                 <div><h2>My Addresses</h2><p className="tab-subtitle">Manage delivery addresses</p></div>
//                                 {!showAddressForm && <button className="add-address-btn" onClick={() => setShowAddressForm(true)}><FaPlus /> Add New Address</button>}
//                             </div>
//                             {showAddressForm && (
//                                 <form onSubmit={handleAddressSubmit} className="address-form">
//                                     <h3>{editingAddressId ? "Edit Address" : "Add New Address"}</h3>
//                                     <div className="form-row">
//                                         <div className="form-group"><label>Full Name *</label><input type="text" required value={addressForm.fullName} onChange={e => setAddressForm({ ...addressForm, fullName: e.target.value })} /></div>
//                                         <div className="form-group"><label>Phone *</label><input type="tel" required value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} /></div>
//                                     </div>
//                                     <div className="form-row">
//                                         <div className="form-group"><label>Pincode *</label><input type="text" required value={addressForm.pincode} onChange={e => setAddressForm({ ...addressForm, pincode: e.target.value })} /></div>
//                                         <div className="form-group"><label>City *</label><input type="text" required value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} /></div>
//                                     </div>
//                                     <div className="form-group full-width"><label>Address Line 1 *</label><input type="text" required placeholder="House No, Building, Street" value={addressForm.addressLine1} onChange={e => setAddressForm({ ...addressForm, addressLine1: e.target.value })} /></div>
//                                     <div className="form-group full-width"><label>Address Line 2</label><input type="text" placeholder="Area, Landmark" value={addressForm.addressLine2} onChange={e => setAddressForm({ ...addressForm, addressLine2: e.target.value })} /></div>
//                                     <div className="form-row">
//                                         <div className="form-group"><label>State *</label><input type="text" required value={addressForm.state} onChange={e => setAddressForm({ ...addressForm, state: e.target.value })} /></div>
//                                         <div className="form-group"><label>Country *</label><input type="text" required value={addressForm.country} onChange={e => setAddressForm({ ...addressForm, country: e.target.value })} /></div>
//                                     </div>
//                                     <div className="form-row">
//                                         <div className="form-group"><label>Address Type</label>
//                                             <div className="address-type-buttons">
//                                                 {["Home", "Work", "Other"].map(t => <button type="button" key={t} className={addressForm.addressType === t ? "type-active" : ""} onClick={() => setAddressForm({ ...addressForm, addressType: t })}>{t}</button>)}
//                                             </div>
//                                         </div>
//                                         <div className="form-group"><label className="checkbox-label"><input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })} />Set as default</label></div>
//                                     </div>
//                                     <div className="form-actions">
//                                         <button type="button" className="btn-cancel" onClick={resetAddressForm}>Cancel</button>
//                                         <button type="submit" className="btn-save" disabled={loading}>{loading ? "Saving..." : editingAddressId ? "Update" : "Save Address"}</button>
//                                     </div>
//                                 </form>
//                             )}
//                             {!showAddressForm && (
//                                 <div className="address-list">
//                                     {addresses.length === 0
//                                         ? <div className="empty-state"><FaMapMarkerAlt /><p>No addresses saved yet</p></div>
//                                         : addresses.map(addr => (
//                                             <div key={addr._id} className={`address-card ${addr.isDefault ? "default-address" : ""}`}>
//                                                 <div className="address-type-badge">{addr.addressType}</div>
//                                                 {addr.isDefault && <div className="default-badge"><FaCheckCircle /> Default</div>}
//                                                 <h4>{addr.fullName}</h4>
//                                                 <p><MdPhone /> {addr.phone}</p>
//                                                 <p><MdLocationOn /> {addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}</p>
//                                                 <p>{addr.city}, {addr.state} - {addr.pincode}</p>
//                                                 <p>{addr.country}</p>
//                                                 <div className="address-actions">
//                                                     {!addr.isDefault && <button className="btn-default" onClick={() => handleSetDefault(addr._id)}>Set Default</button>}
//                                                     <button className="btn-edit" onClick={() => handleEditAddress(addr)}><FaEdit /> Edit</button>
//                                                     <button className="btn-delete" onClick={() => handleDeleteAddress(addr._id)}><FaTrash /> Delete</button>
//                                                 </div>
//                                             </div>
//                                         ))
//                                     }
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* ORDERS TAB */}
//                     {activeTab === "orders" && (
//                         <div className="tab-content">
//                             <div className="tab-header">
//                                 <div><h2>My Orders</h2><p className="tab-subtitle">Track and manage your orders</p></div>
//                                 <button className="refresh-btn" onClick={loadOrders} disabled={ordersLoading}>
//                                     {ordersLoading ? "Loading…" : "↻ Refresh"}
//                                 </button>
//                             </div>
//                             {ordersLoading ? (
//                                 <div className="orders-loading"><div className="loading-spinner" /><p>Loading orders…</p></div>
//                             ) : orders.length === 0 ? (
//                                 <div className="empty-state"><FaShoppingBag /><p>No orders yet</p><small>Your order history will appear here</small></div>
//                             ) : (
//                                 <div className="orders-list">
//                                     {orders.map(order => <OrderCard key={order._id} order={order} />)}
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* PASSWORD TAB */}
//                     {activeTab === "password" && (
//                         <div className="tab-content">
//                             <h2>Change Password</h2>
//                             <p className="tab-subtitle">Keep your account secure</p>
//                             <form onSubmit={handlePasswordChange} className="profile-form">
//                                 <div className="form-group full-width"><label>Current Password *</label><input type="password" required value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} /></div>
//                                 <div className="form-group full-width"><label>New Password *</label><input type="password" required value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} /></div>
//                                 <div className="form-group full-width"><label>Confirm New Password *</label><input type="password" required value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} /></div>
//                                 <button type="submit" className="profile-save-btn" disabled={loading}>{loading ? "Updating..." : "Update Password"}</button>
//                             </form>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ProfilePopup;



import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ProfilePopup.css';
import { IoClose } from "react-icons/io5";
import {
    FaUser, FaMapMarkerAlt, FaShoppingBag, FaLock, FaSignOutAlt,
    FaCamera, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaChevronDown, FaChevronUp,
    FaExpand, FaCompress
} from "react-icons/fa";
import { MdPhone, MdLocationOn } from "react-icons/md";

const API_BASE = "https://testingserver-73um.onrender.com/api/users/";

const ORDER_STEPS = [
    { key: "pending",   label: "Order Placed",  icon: "📋", desc: "Your order has been received" },
    { key: "paid",      label: "Payment Done",  icon: "💳", desc: "Payment confirmed successfully" },
    { key: "packed",    label: "Packed",        icon: "📦", desc: "Your order is being packed" },
    { key: "shipped",   label: "Shipped",       icon: "🚚", desc: "Order is on the way" },
    { key: "delivered", label: "Delivered",     icon: "✅", desc: "Order delivered successfully" },
];

function getStepIndex(status) {
    const idx = ORDER_STEPS.findIndex(s => s.key === status);
    return idx === -1 ? 1 : idx;
}

function OrderStatusStepper({ status }) {
    if (status === "cancelled" || status === "failed" || status === "refunded") {
        const labels = {
            cancelled: { icon: "❌", label: "Order Cancelled", desc: "This order was cancelled",       cls: "track-cancelled" },
            failed:    { icon: "⚠️", label: "Payment Failed",  desc: "Payment could not be processed", cls: "track-failed" },
            refunded:  { icon: "↩️", label: "Refunded",        desc: "Amount has been refunded",       cls: "track-refunded" },
        };
        const m = labels[status];
        return (
            <div className={`track-terminal ${m.cls}`}>
                <span className="track-terminal-icon">{m.icon}</span>
                <div>
                    <p className="track-terminal-label">{m.label}</p>
                    <p className="track-terminal-desc">{m.desc}</p>
                </div>
            </div>
        );
    }
    const currentIdx = getStepIndex(status);
    const pct = (currentIdx / (ORDER_STEPS.length - 1)) * 100;
    return (
        <div className="track-stepper">
            <div className="track-bar-bg">
                <div className="track-bar-fill" style={{ width: `${pct}%` }} />
                {ORDER_STEPS.map((step, idx) => (
                    <div key={step.key} className="track-dot-wrap"
                        style={{ left: `${(idx / (ORDER_STEPS.length - 1)) * 100}%` }}>
                        <div className={`track-dot ${idx < currentIdx ? 'dot-done' : idx === currentIdx ? 'dot-active' : 'dot-future'}`}>
                            {idx < currentIdx ? '✓' : step.icon}
                        </div>
                        <span className={`track-dot-label ${idx === currentIdx ? 'label-active' : idx < currentIdx ? 'label-done' : 'label-future'}`}>
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>
            <p className="track-active-desc">{ORDER_STEPS[currentIdx].icon} {ORDER_STEPS[currentIdx].desc}</p>
        </div>
    );
}

function getStatusMeta(status) {
    const map = {
        pending:   { text: "Order Placed",  cls: "s-pending",   dot: "#6c757d" },
        paid:      { text: "Paid",          cls: "s-paid",      dot: "#28a745" },
        packed:    { text: "Packed",        cls: "s-packed",    dot: "#fd7e14" },
        shipped:   { text: "Shipped",       cls: "s-shipped",   dot: "#007bff" },
        delivered: { text: "Delivered",     cls: "s-delivered", dot: "#20c997" },
        cancelled: { text: "Cancelled",     cls: "s-cancelled", dot: "#dc3545" },
        failed:    { text: "Failed",        cls: "s-failed",    dot: "#ffc107" },
        refunded:  { text: "Refunded",      cls: "s-refunded",  dot: "#6f42c1" },
    };
    return map[status] || { text: status, cls: "s-pending", dot: "#6c757d" };
}

function OrderCard({ order }) {
    const [expanded, setExpanded] = useState(false);
    const meta = getStatusMeta(order.status);
    const itemCount = (order.items || []).length;
    return (
        <div className="ocard2">
            <div className="ocard2-header" onClick={() => setExpanded(v => !v)}>
                <div className="ocard2-left">
                    <div className="ocard2-icon-wrap" style={{ background: `${meta.dot}18`, color: meta.dot }}>
                        <FaShoppingBag />
                    </div>
                    <div className="ocard2-meta">
                        <span className="ocard2-id">#{(order.orderId || order._id || "").toString().slice(-8).toUpperCase()}</span>
                        <span className="ocard2-date">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                </div>
                <div className="ocard2-right">
                    <span className={`status-pill ${meta.cls}`}>
                        <span className="s-dot" style={{ background: meta.dot }} />{meta.text}
                    </span>
                    <span className="ocard2-amount">₹{order.total ?? order.amount}</span>
                    <span className={`ocard2-chevron ${expanded ? 'chevron-open' : ''}`}><FaChevronDown /></span>
                </div>
            </div>
            <div className="ocard2-strip">
                <div className="ocard2-thumbs">
                    {(order.items || []).slice(0, 4).map((item, i) => (
                        item.image
                            ? <img key={i} src={item.image} alt={item.name} className="ocard2-thumb" />
                            : <div key={i} className="ocard2-thumb ocard2-thumb-ph">📦</div>
                    ))}
                    {itemCount > 4 && <div className="ocard2-thumb ocard2-thumb-more">+{itemCount - 4}</div>}
                </div>
                <span className="ocard2-item-count">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
            </div>
            {expanded && (
                <div className="ocard2-body">
                    <div className="ocard2-section">
                        <p className="ocard2-section-title">📍 Order Tracking</p>
                        <OrderStatusStepper status={order.status} />
                    </div>
                    <div className="ocard2-section">
                        <p className="ocard2-section-title">🛍️ Items Ordered</p>
                        <div className="ocard2-items">
                            {(order.items || []).map((item, i) => (
                                <div key={i} className="ocard2-item-row">
                                    {item.image ? <img src={item.image} alt={item.name} className="ocard2-item-img" /> : <div className="ocard2-item-img ocard2-item-img-ph">📦</div>}
                                    <div className="ocard2-item-info">
                                        <p className="ocard2-item-name">{item.name}</p>
                                        <p className="ocard2-item-meta">Qty {item.quantity} × ₹{item.price}</p>
                                    </div>
                                    <p className="ocard2-item-total">₹{((item.quantity || 1) * (item.price || 0)).toFixed(0)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="ocard2-total-row">
                            <span>Total Paid</span>
                            <strong>₹{order.total ?? order.amount}</strong>
                        </div>
                    </div>
                    <div className="ocard2-bottom-row">
                        {order.shippingAddress && (
                            <div className="ocard2-section ocard2-section-half">
                                <p className="ocard2-section-title">📬 Delivery Address</p>
                                <div className="ocard2-addr">
                                    <MdLocationOn className="ocard2-addr-icon" />
                                    <div>
                                        <p className="ocard2-addr-name">{order.shippingAddress.name}</p>
                                        <p>{order.shippingAddress.address}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
                                        {order.shippingAddress.phone && <p>📞 {order.shippingAddress.phone}</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="ocard2-section ocard2-section-half">
                            <p className="ocard2-section-title">💳 Payment</p>
                            <div className="ocard2-payment">
                                <span className="ocard2-pay-method">{order.paymentMethod === "cod" ? "💵 Cash on Delivery" : "💳 Razorpay"}</span>
                                {order.razorpayPaymentId && <span className="ocard2-pay-id">ID: …{order.razorpayPaymentId.slice(-8)}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
function ProfilePopup({ onClose, onLogout }) {
    const [activeTab, setActiveTab]         = useState("profile");
    const [loading, setLoading]             = useState(false);
    const [dataLoading, setDataLoading]     = useState(true);
    const [message, setMessage]             = useState({ type: "", text: "" });
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [isFullscreen, setIsFullscreen]   = useState(false); // ← fullscreen state

    const [user, setUser]           = useState({ name: "", email: "", phone: "", profileImage: "", gender: "", dob: "" });
    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm]   = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({
        fullName: "", phone: "", pincode: "", addressLine1: "", addressLine2: "",
        city: "", state: "", country: "India", addressType: "Home", isDefault: false,
    });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [orders, setOrders] = useState([]);

    const fileInputRef = useRef(null);
    const token = localStorage.getItem("token");

    // ── Keyboard: Escape = close fullscreen, F = toggle fullscreen ──
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
            if (e.key === "f" || e.key === "F") setIsFullscreen(v => !v);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isFullscreen]);

    useEffect(() => { loadUserData(); loadAddresses(); loadOrders(); }, []);
    useEffect(() => {
        if (message.text) {
            const t = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
            return () => clearTimeout(t);
        }
    }, [message]);

    const showMessage = (type, text) => setMessage({ type, text });

    const loadUserData = async () => {
        try {
            const res = await axios.get(`${API_BASE}profile`, { headers: { Authorization: `Bearer ${token}` } });
            setUser(res.data);
        } catch {
            if (token) {
                try {
                    const d = JSON.parse(atob(token.split(".")[1]));
                    setUser(p => ({ ...p, name: d.name || "User" }));
                } catch {}
            }
        } finally { setDataLoading(false); }
    };

    const loadAddresses = async () => {
        try {
            const res = await axios.get(`${API_BASE}addresses`, { headers: { Authorization: `Bearer ${token}` } });
            setAddresses(res.data || []);
        } catch { setAddresses([]); }
    };

    const loadOrders = async () => {
        setOrdersLoading(true);
        try {
            const res = await axios.get(`${API_BASE}orders`, { headers: { Authorization: `Bearer ${token}` } });
            const normalized = (res.data || []).map(o => ({
                ...o, orderId: o.razorpayOrderId, total: o.amount,
                items: (o.items || []).map(i => ({ ...i, name: i.productName, image: i.imageUrl })),
            }));
            setOrders(normalized);
        } catch { setOrders([]); }
        setOrdersLoading(false);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            const res = await axios.put(`${API_BASE}profile`, user, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.token) { localStorage.setItem("token", res.data.token); window.dispatchEvent(new Event("storage")); }
            showMessage("success", "Profile updated successfully!");
        } catch (err) { showMessage("error", err.response?.data?.message || "Update failed"); }
        setLoading(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            setUser(p => ({ ...p, profileImage: reader.result }));
            try {
                setLoading(true);
                await axios.put(`${API_BASE}profile-image`, { profileImage: reader.result }, { headers: { Authorization: `Bearer ${token}` } });
                showMessage("success", "Profile picture updated!");
            } catch { showMessage("error", "Upload failed"); }
            setLoading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            if (editingAddressId) {
                await axios.put(`${API_BASE}addresses/${editingAddressId}`, addressForm, { headers: { Authorization: `Bearer ${token}` } });
                showMessage("success", "Address updated!");
            } else {
                await axios.post(`${API_BASE}addresses`, addressForm, { headers: { Authorization: `Bearer ${token}` } });
                showMessage("success", "Address added!");
            }
            resetAddressForm(); loadAddresses();
        } catch { showMessage("error", "Failed to save address"); }
        setLoading(false);
    };

    const handleEditAddress   = (a) => { setAddressForm(a); setEditingAddressId(a._id); setShowAddressForm(true); };
    const handleDeleteAddress = async (id) => {
        if (!window.confirm("Delete this address?")) return;
        try {
            await axios.delete(`${API_BASE}addresses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            showMessage("success", "Deleted!"); loadAddresses();
        } catch { showMessage("error", "Delete failed"); }
    };
    const handleSetDefault = async (id) => {
        try {
            await axios.put(`${API_BASE}addresses/${id}/default`, {}, { headers: { Authorization: `Bearer ${token}` } });
            loadAddresses(); showMessage("success", "Default updated!");
        } catch { showMessage("error", "Failed"); }
    };
    const resetAddressForm = () => {
        setAddressForm({ fullName: "", phone: "", pincode: "", addressLine1: "", addressLine2: "", city: "", state: "", country: "India", addressType: "Home", isDefault: false });
        setEditingAddressId(null); setShowAddressForm(false);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) return showMessage("error", "Passwords don't match");
        if (passwordForm.newPassword.length < 6) return showMessage("error", "Min 6 characters");
        setLoading(true);
        try {
            await axios.put(`${API_BASE}change-password`, { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }, { headers: { Authorization: `Bearer ${token}` } });
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            showMessage("success", "Password changed!");
        } catch (err) { showMessage("error", err.response?.data?.message || "Failed"); }
        setLoading(false);
    };

    const handleLogout = () => {
        if (!window.confirm("Logout?")) return;
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("storage"));
        if (onLogout) onLogout();
        onClose();
        window.location.reload();
    };

    return (
        <div className="profile-popup-overlay" onClick={() => { if (!isFullscreen) onClose(); }}>
            <div
                className={`profile-popup-container ${isFullscreen ? 'pp-fullscreen' : ''}`}
                onClick={e => e.stopPropagation()}
            >
                {/* ── TOP ACTION BUTTONS ── */}
                <div className="pp-top-actions">
                    {/* Fullscreen toggle — YouTube style */}
                    <button
                        className="pp-action-btn pp-fullscreen-btn"
                        onClick={() => setIsFullscreen(v => !v)}
                        title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
                    >
                        {isFullscreen ? <FaCompress /> : <FaExpand />}
                    </button>
                    {/* Close */}
                    <button
                        className="pp-action-btn pp-close-btn"
                        onClick={onClose}
                        title="Close"
                    >
                        <IoClose />
                    </button>
                </div>

                {/* SIDEBAR */}
                <div className="profile-sidebar">
                    <div className="profile-user-card">
                        <div className="profile-image-wrapper">
                            {dataLoading ? (
                                <div className="skel skel-circle" style={{ width: 80, height: 80 }} />
                            ) : (
                                <>
                                    {user.profileImage
                                        ? <img src={user.profileImage} alt="Profile" className="profile-image" />
                                        : <div className="profile-image-placeholder">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>}
                                    <button className="profile-camera-btn" onClick={() => fileInputRef.current?.click()}><FaCamera /></button>
                                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: "none" }} />
                                </>
                            )}
                        </div>
                        {dataLoading ? (
                            <>
                                <div className="skel skel-text" style={{ width: 120, margin: '10px auto 6px' }} />
                                <div className="skel skel-text" style={{ width: 160, margin: '0 auto' }} />
                            </>
                        ) : (
                            <>
                                <h3 className="profile-user-name">{user.name || "User"}</h3>
                                <p className="profile-user-email">{user.email || user.phone}</p>
                            </>
                        )}
                    </div>
                    <ul className="profile-nav">
                        {[
                            { key: "profile",   label: "My Profile",     icon: <FaUser /> },
                            { key: "addresses", label: "My Addresses",    icon: <FaMapMarkerAlt /> },
                            { key: "orders",    label: "My Orders",       icon: <FaShoppingBag />, badge: orders.length || null },
                            { key: "password",  label: "Change Password", icon: <FaLock /> },
                        ].map(t => (
                            <li key={t.key} className={activeTab === t.key ? "active" : ""} onClick={() => setActiveTab(t.key)}>
                                {t.icon}<span>{t.label}</span>
                                {t.badge ? <span className="nav-badge">{t.badge}</span> : null}
                            </li>
                        ))}
                        <li className="logout-item" onClick={handleLogout}><FaSignOutAlt /><span>Logout</span></li>
                    </ul>
                </div>

                {/* CONTENT */}
                <div className="profile-content">
                    {message.text && <div className={`profile-message ${message.type}`}>{message.text}</div>}

                    {/* PROFILE TAB */}
                    {activeTab === "profile" && (
                        <div className="tab-content">
                            <h2>My Profile</h2>
                            <p className="tab-subtitle">Manage your personal information</p>
                            {dataLoading ? (
                                <div className="skeleton-form">
                                    <div className="skel-row"><div className="skel skel-input" /><div className="skel skel-input" /></div>
                                    <div className="skel-row"><div className="skel skel-input" /><div className="skel skel-input" /></div>
                                    <div className="skel-row"><div className="skel skel-input" style={{ width: '48%' }} /></div>
                                    <div className="skel skel-btn" />
                                </div>
                            ) : (
                                <form onSubmit={handleProfileUpdate} className="profile-form">
                                    <div className="form-row">
                                        <div className="form-group"><label>Full Name</label><input type="text" value={user.name || ""} onChange={e => setUser({ ...user, name: e.target.value })} placeholder="Enter your name" /></div>
                                        <div className="form-group"><label>Email</label><input type="email" value={user.email || ""} onChange={e => setUser({ ...user, email: e.target.value })} placeholder="Enter email" /></div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Phone Number</label><input type="tel" value={user.phone || ""} onChange={e => setUser({ ...user, phone: e.target.value })} placeholder="Enter phone" /></div>
                                        <div className="form-group"><label>Gender</label>
                                            <select value={user.gender || ""} onChange={e => setUser({ ...user, gender: e.target.value })}>
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Date of Birth</label><input type="date" value={user.dob ? user.dob.split("T")[0] : ""} onChange={e => setUser({ ...user, dob: e.target.value })} /></div>
                                    </div>
                                    <button type="submit" className="profile-save-btn" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* ADDRESSES TAB */}
                    {activeTab === "addresses" && (
                        <div className="tab-content">
                            <div className="tab-header">
                                <div><h2>My Addresses</h2><p className="tab-subtitle">Manage delivery addresses</p></div>
                                {!showAddressForm && <button className="add-address-btn" onClick={() => setShowAddressForm(true)}><FaPlus /> Add New Address</button>}
                            </div>
                            {showAddressForm && (
                                <form onSubmit={handleAddressSubmit} className="address-form">
                                    <h3>{editingAddressId ? "Edit Address" : "Add New Address"}</h3>
                                    <div className="form-row">
                                        <div className="form-group"><label>Full Name *</label><input type="text" required value={addressForm.fullName} onChange={e => setAddressForm({ ...addressForm, fullName: e.target.value })} /></div>
                                        <div className="form-group"><label>Phone *</label><input type="tel" required value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} /></div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Pincode *</label><input type="text" required value={addressForm.pincode} onChange={e => setAddressForm({ ...addressForm, pincode: e.target.value })} /></div>
                                        <div className="form-group"><label>City *</label><input type="text" required value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} /></div>
                                    </div>
                                    <div className="form-group full-width"><label>Address Line 1 *</label><input type="text" required placeholder="House No, Building, Street" value={addressForm.addressLine1} onChange={e => setAddressForm({ ...addressForm, addressLine1: e.target.value })} /></div>
                                    <div className="form-group full-width"><label>Address Line 2</label><input type="text" placeholder="Area, Landmark" value={addressForm.addressLine2} onChange={e => setAddressForm({ ...addressForm, addressLine2: e.target.value })} /></div>
                                    <div className="form-row">
                                        <div className="form-group"><label>State *</label><input type="text" required value={addressForm.state} onChange={e => setAddressForm({ ...addressForm, state: e.target.value })} /></div>
                                        <div className="form-group"><label>Country *</label><input type="text" required value={addressForm.country} onChange={e => setAddressForm({ ...addressForm, country: e.target.value })} /></div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Address Type</label>
                                            <div className="address-type-buttons">
                                                {["Home", "Work", "Other"].map(t => <button type="button" key={t} className={addressForm.addressType === t ? "type-active" : ""} onClick={() => setAddressForm({ ...addressForm, addressType: t })}>{t}</button>)}
                                            </div>
                                        </div>
                                        <div className="form-group"><label className="checkbox-label"><input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })} />Set as default</label></div>
                                    </div>
                                    <div className="form-actions">
                                        <button type="button" className="btn-cancel" onClick={resetAddressForm}>Cancel</button>
                                        <button type="submit" className="btn-save" disabled={loading}>{loading ? "Saving..." : editingAddressId ? "Update" : "Save Address"}</button>
                                    </div>
                                </form>
                            )}
                            {!showAddressForm && (
                                <div className="address-list">
                                    {addresses.length === 0
                                        ? <div className="empty-state"><FaMapMarkerAlt /><p>No addresses saved yet</p></div>
                                        : addresses.map(addr => (
                                            <div key={addr._id} className={`address-card ${addr.isDefault ? "default-address" : ""}`}>
                                                <div className="address-type-badge">{addr.addressType}</div>
                                                {addr.isDefault && <div className="default-badge"><FaCheckCircle /> Default</div>}
                                                <h4>{addr.fullName}</h4>
                                                <p><MdPhone /> {addr.phone}</p>
                                                <p><MdLocationOn /> {addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}</p>
                                                <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                                <p>{addr.country}</p>
                                                <div className="address-actions">
                                                    {!addr.isDefault && <button className="btn-default" onClick={() => handleSetDefault(addr._id)}>Set Default</button>}
                                                    <button className="btn-edit" onClick={() => handleEditAddress(addr)}><FaEdit /> Edit</button>
                                                    <button className="btn-delete" onClick={() => handleDeleteAddress(addr._id)}><FaTrash /> Delete</button>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </div>
                    )}

                    {/* ORDERS TAB */}
                    {activeTab === "orders" && (
                        <div className="tab-content">
                            <div className="tab-header">
                                <div><h2>My Orders</h2><p className="tab-subtitle">Track and manage your orders</p></div>
                                <button className="refresh-btn" onClick={loadOrders} disabled={ordersLoading}>
                                    {ordersLoading ? "Loading…" : "↻ Refresh"}
                                </button>
                            </div>
                            {ordersLoading ? (
                                <div className="orders-loading"><div className="loading-spinner" /><p>Loading orders…</p></div>
                            ) : orders.length === 0 ? (
                                <div className="empty-state"><FaShoppingBag /><p>No orders yet</p><small>Your order history will appear here</small></div>
                            ) : (
                                <div className="orders-list">
                                    {orders.map(order => <OrderCard key={order._id} order={order} />)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* PASSWORD TAB */}
                    {activeTab === "password" && (
                        <div className="tab-content">
                            <h2>Change Password</h2>
                            <p className="tab-subtitle">Keep your account secure</p>
                            <form onSubmit={handlePasswordChange} className="profile-form">
                                <div className="form-group full-width"><label>Current Password *</label><input type="password" required value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} /></div>
                                <div className="form-group full-width"><label>New Password *</label><input type="password" required value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} /></div>
                                <div className="form-group full-width"><label>Confirm New Password *</label><input type="password" required value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} /></div>
                                <button type="submit" className="profile-save-btn" disabled={loading}>{loading ? "Updating..." : "Update Password"}</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePopup;