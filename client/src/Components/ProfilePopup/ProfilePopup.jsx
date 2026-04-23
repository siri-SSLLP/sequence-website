// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './ProfilePopup.css';
// import { IoClose } from "react-icons/io5";
// import { FaUser, FaMapMarkerAlt, FaShoppingBag, FaHeart, FaLock, FaSignOutAlt, FaCamera, FaEdit, FaTrash, FaPlus, FaCheckCircle } from "react-icons/fa";
// import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

// const API_BASE = "https://testingserver-73um.onrender.com/api/users/"; // CHANGE THIS TO YOUR BACKEND URL

// function ProfilePopup({ onClose, onLogout }) {
//     const [activeTab, setActiveTab] = useState("profile");
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState({ type: "", text: "" });

//     // User data
//     const [user, setUser] = useState({
//         name: "",
//         email: "",
//         phone: "",
//         profileImage: "",
//         gender: "",
//         dob: "",
//     });

//     // Addresses
//     const [addresses, setAddresses] = useState([]);
//     const [showAddressForm, setShowAddressForm] = useState(false);
//     const [editingAddressId, setEditingAddressId] = useState(null);
//     const [addressForm, setAddressForm] = useState({
//         fullName: "",
//         phone: "",
//         pincode: "",
//         addressLine1: "",
//         addressLine2: "",
//         city: "",
//         state: "",
//         country: "India",
//         addressType: "Home",
//         isDefault: false,
//     });

//     // Password change
//     const [passwordForm, setPasswordForm] = useState({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//     });

//     // Orders
//     const [orders, setOrders] = useState([]);

//     const fileInputRef = useRef(null);
//     const token = localStorage.getItem("token");

//     // Load user data on mount
//     useEffect(() => {
//         loadUserData();
//         loadAddresses();
//         loadOrders();
//     }, []);

//     // Auto-hide messages
//     useEffect(() => {
//         if (message.text) {
//             const timer = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//             return () => clearTimeout(timer);
//         }
//     }, [message]);

//     const showMessage = (type, text) => setMessage({ type, text });

//     // ---------------------- API CALLS ----------------------
//     const loadUserData = async () => {
//         try {
//             const res = await axios.get(`${API_BASE}profile`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setUser(res.data);
//         } catch (err) {
//             // Fallback: decode token for name
//             if (token) {
//                 try {
//                     const decoded = JSON.parse(atob(token.split(".")[1]));
//                     setUser(prev => ({ ...prev, name: decoded.name || "User" }));
//                 } catch (e) { }
//             }
//         }
//     };

//     const loadAddresses = async () => {
//         try {
//             const res = await axios.get(`${API_BASE}addresses`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setAddresses(res.data || []);
//         } catch (err) {
//             setAddresses([]);
//         }
//     };

//     const loadOrders = async () => {
//         try {
//             const res = await axios.get(`${API_BASE}orders`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setOrders(res.data || []);
//         } catch (err) {
//             setOrders([]);
//         }
//     };

//     // ---------------------- PROFILE UPDATE ----------------------
//     const handleProfileUpdate = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const res = await axios.put(`${API_BASE}profile`, user, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             if (res.data.token) {
//                 localStorage.setItem("token", res.data.token);
//                 window.dispatchEvent(new Event("storage"));
//             }
//             showMessage("success", "Profile updated successfully!");
//         } catch (err) {
//             showMessage("error", err.response?.data?.message || "Update failed");
//         }
//         setLoading(false);
//     };

//     // ---------------------- IMAGE UPLOAD ----------------------
//     const handleImageUpload = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         // Preview + convert to base64
//         const reader = new FileReader();
//         reader.onloadend = async () => {
//             setUser(prev => ({ ...prev, profileImage: reader.result }));

//             // Upload to backend
//             try {
//                 setLoading(true);
//                 await axios.put(`${API_BASE}profile-image`, {
//                     profileImage: reader.result
//                 }, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 showMessage("success", "Profile picture updated!");
//             } catch (err) {
//                 showMessage("error", "Upload failed");
//             }
//             setLoading(false);
//         };
//         reader.readAsDataURL(file);
//     };

//     // ---------------------- ADDRESS MANAGEMENT ----------------------
//     const handleAddressSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             if (editingAddressId) {
//                 await axios.put(`${API_BASE}addresses/${editingAddressId}`, addressForm, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 showMessage("success", "Address updated!");
//             } else {
//                 await axios.post(`${API_BASE}addresses`, addressForm, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 showMessage("success", "Address added!");
//             }
//             resetAddressForm();
//             loadAddresses();
//         } catch (err) {
//             showMessage("error", "Failed to save address");
//         }
//         setLoading(false);
//     };

//     const handleEditAddress = (address) => {
//         setAddressForm(address);
//         setEditingAddressId(address._id);
//         setShowAddressForm(true);
//     };

//     const handleDeleteAddress = async (id) => {
//         if (!window.confirm("Delete this address?")) return;
//         try {
//             await axios.delete(`${API_BASE}addresses/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             showMessage("success", "Address deleted!");
//             loadAddresses();
//         } catch (err) {
//             showMessage("error", "Delete failed");
//         }
//     };

//     const handleSetDefault = async (id) => {
//         try {
//             await axios.put(`${API_BASE}addresses/${id}/default`, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             loadAddresses();
//             showMessage("success", "Default address updated!");
//         } catch (err) {
//             showMessage("error", "Failed to update");
//         }
//     };

//     const resetAddressForm = () => {
//         setAddressForm({
//             fullName: "", phone: "", pincode: "", addressLine1: "", addressLine2: "",
//             city: "", state: "", country: "India", addressType: "Home", isDefault: false,
//         });
//         setEditingAddressId(null);
//         setShowAddressForm(false);
//     };

//     // ---------------------- PASSWORD CHANGE ----------------------
//     const handlePasswordChange = async (e) => {
//         e.preventDefault();
//         if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//             return showMessage("error", "Passwords don't match");
//         }
//         if (passwordForm.newPassword.length < 6) {
//             return showMessage("error", "Password must be at least 6 characters");
//         }

//         setLoading(true);
//         try {
//             await axios.put(`${API_BASE}change-password`, {
//                 currentPassword: passwordForm.currentPassword,
//                 newPassword: passwordForm.newPassword,
//             }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
//             showMessage("success", "Password changed successfully!");
//         } catch (err) {
//             showMessage("error", err.response?.data?.message || "Change failed");
//         }
//         setLoading(false);
//     };

//     // ---------------------- LOGOUT ----------------------
//     const handleLogout = () => {
//         if (!window.confirm("Are you sure you want to logout?")) return;
//         localStorage.removeItem("token");
//         window.dispatchEvent(new Event("storage"));
//         if (onLogout) onLogout();
//         onClose();
//         window.location.reload();
//     };

//     // ---------------------- RENDER ----------------------
//     return (
//         <div className="profile-popup-overlay" onClick={onClose}>
//             <div className="profile-popup-container" onClick={(e) => e.stopPropagation()}>

//                 {/* CLOSE BUTTON */}
//                 <button className="profile-close-btn" onClick={onClose}>
//                     <IoClose />
//                 </button>

//                 {/* SIDEBAR */}
//                 <div className="profile-sidebar">
//                     <div className="profile-user-card">
//                         <div className="profile-image-wrapper">
//                             {user.profileImage ? (
//                                 <img src={user.profileImage} alt="Profile" className="profile-image" />
//                             ) : (
//                                 <div className="profile-image-placeholder">
//                                     {user.name ? user.name.charAt(0).toUpperCase() : "U"}
//                                 </div>
//                             )}
//                             <button className="profile-camera-btn" onClick={() => fileInputRef.current?.click()}>
//                                 <FaCamera />
//                             </button>
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 ref={fileInputRef}
//                                 onChange={handleImageUpload}
//                                 style={{ display: "none" }}
//                             />
//                         </div>
//                         <h3 className="profile-user-name">{user.name || "User"}</h3>
//                         <p className="profile-user-email">{user.email || user.phone}</p>
//                     </div>

//                     <ul className="profile-nav">
//                         <li className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
//                             <FaUser /> <span>My Profile</span>
//                         </li>
//                         <li className={activeTab === "addresses" ? "active" : ""} onClick={() => setActiveTab("addresses")}>
//                             <FaMapMarkerAlt /> <span>My Addresses</span>
//                         </li>
//                         <li className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
//                             <FaShoppingBag /> <span>My Orders</span>
//                         </li>
//                         <li className={activeTab === "password" ? "active" : ""} onClick={() => setActiveTab("password")}>
//                             <FaLock /> <span>Change Password</span>
//                         </li>
//                         <li className="logout-item" onClick={handleLogout}>
//                             <FaSignOutAlt /> <span>Logout</span>
//                         </li>
//                     </ul>
//                 </div>

//                 {/* MAIN CONTENT */}
//                 <div className="profile-content">
//                     {message.text && (
//                         <div className={`profile-message ${message.type}`}>
//                             {message.text}
//                         </div>
//                     )}

//                     {/* PROFILE TAB */}
//                     {activeTab === "profile" && (
//                         <div className="tab-content">
//                             <h2>My Profile</h2>
//                             <p className="tab-subtitle">Manage your personal information</p>

//                             <form onSubmit={handleProfileUpdate} className="profile-form">
//                                 <div className="form-row">
//                                     <div className="form-group">
//                                         <label>Full Name</label>
//                                         <input
//                                             type="text"
//                                             value={user.name || ""}
//                                             onChange={(e) => setUser({ ...user, name: e.target.value })}
//                                             placeholder="Enter your name"
//                                         />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Email</label>
//                                         <input
//                                             type="email"
//                                             value={user.email || ""}
//                                             onChange={(e) => setUser({ ...user, email: e.target.value })}
//                                             placeholder="Enter your email"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="form-row">
//                                     <div className="form-group">
//                                         <label>Phone Number</label>
//                                         <input
//                                             type="tel"
//                                             value={user.phone || ""}
//                                             onChange={(e) => setUser({ ...user, phone: e.target.value })}
//                                             placeholder="Enter phone number"
//                                         />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Gender</label>
//                                         <select
//                                             value={user.gender || ""}
//                                             onChange={(e) => setUser({ ...user, gender: e.target.value })}
//                                         >
//                                             <option value="">Select Gender</option>
//                                             <option value="Male">Male</option>
//                                             <option value="Female">Female</option>
//                                             <option value="Other">Other</option>
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <div className="form-row">
//                                     <div className="form-group">
//                                         <label>Date of Birth</label>
//                                         <input
//                                             type="date"
//                                             value={user.dob ? user.dob.split("T")[0] : ""}
//                                             onChange={(e) => setUser({ ...user, dob: e.target.value })}
//                                         />
//                                     </div>
//                                 </div>

//                                 <button type="submit" className="profile-save-btn" disabled={loading}>
//                                     {loading ? "Saving..." : "Save Changes"}
//                                 </button>
//                             </form>
//                         </div>
//                     )}

//                     {/* ADDRESSES TAB */}
//                     {activeTab === "addresses" && (
//                         <div className="tab-content">
//                             <div className="tab-header">
//                                 <div>
//                                     <h2>My Addresses</h2>
//                                     <p className="tab-subtitle">Manage your delivery addresses</p>
//                                 </div>
//                                 {!showAddressForm && (
//                                     <button className="add-address-btn" onClick={() => setShowAddressForm(true)}>
//                                         <FaPlus /> Add New Address
//                                     </button>
//                                 )}
//                             </div>

//                             {showAddressForm && (
//                                 <form onSubmit={handleAddressSubmit} className="address-form">
//                                     <h3>{editingAddressId ? "Edit Address" : "Add New Address"}</h3>

//                                     <div className="form-row">
//                                         <div className="form-group">
//                                             <label>Full Name *</label>
//                                             <input
//                                                 type="text"
//                                                 required
//                                                 value={addressForm.fullName}
//                                                 onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
//                                             />
//                                         </div>
//                                         <div className="form-group">
//                                             <label>Phone Number *</label>
//                                             <input
//                                                 type="tel"
//                                                 required
//                                                 value={addressForm.phone}
//                                                 onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="form-row">
//                                         <div className="form-group">
//                                             <label>Pincode *</label>
//                                             <input
//                                                 type="text"
//                                                 required
//                                                 value={addressForm.pincode}
//                                                 onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
//                                             />
//                                         </div>
//                                         <div className="form-group">
//                                             <label>City *</label>
//                                             <input
//                                                 type="text"
//                                                 required
//                                                 value={addressForm.city}
//                                                 onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="form-group full-width">
//                                         <label>Address Line 1 *</label>
//                                         <input
//                                             type="text"
//                                             required
//                                             placeholder="House No, Building, Street"
//                                             value={addressForm.addressLine1}
//                                             onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
//                                         />
//                                     </div>

//                                     <div className="form-group full-width">
//                                         <label>Address Line 2</label>
//                                         <input
//                                             type="text"
//                                             placeholder="Area, Colony, Landmark"
//                                             value={addressForm.addressLine2}
//                                             onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
//                                         />
//                                     </div>

//                                     <div className="form-row">
//                                         <div className="form-group">
//                                             <label>State *</label>
//                                             <input
//                                                 type="text"
//                                                 required
//                                                 value={addressForm.state}
//                                                 onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
//                                             />
//                                         </div>
//                                         <div className="form-group">
//                                             <label>Country *</label>
//                                             <input
//                                                 type="text"
//                                                 required
//                                                 value={addressForm.country}
//                                                 onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="form-row">
//                                         <div className="form-group">
//                                             <label>Address Type</label>
//                                             <div className="address-type-buttons">
//                                                 {["Home", "Work", "Other"].map(type => (
//                                                     <button
//                                                         type="button"
//                                                         key={type}
//                                                         className={addressForm.addressType === type ? "type-active" : ""}
//                                                         onClick={() => setAddressForm({ ...addressForm, addressType: type })}
//                                                     >
//                                                         {type}
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="checkbox-label">
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={addressForm.isDefault}
//                                                     onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
//                                                 />
//                                                 Set as default address
//                                             </label>
//                                         </div>
//                                     </div>

//                                     <div className="form-actions">
//                                         <button type="button" className="btn-cancel" onClick={resetAddressForm}>
//                                             Cancel
//                                         </button>
//                                         <button type="submit" className="btn-save" disabled={loading}>
//                                             {loading ? "Saving..." : editingAddressId ? "Update Address" : "Save Address"}
//                                         </button>
//                                     </div>
//                                 </form>
//                             )}

//                             {!showAddressForm && (
//                                 <div className="address-list">
//                                     {addresses.length === 0 ? (
//                                         <div className="empty-state">
//                                             <FaMapMarkerAlt />
//                                             <p>No addresses saved yet</p>
//                                         </div>
//                                     ) : (
//                                         addresses.map(addr => (
//                                             <div key={addr._id} className={`address-card ${addr.isDefault ? "default-address" : ""}`}>
//                                                 <div className="address-type-badge">{addr.addressType}</div>
//                                                 {addr.isDefault && <div className="default-badge"><FaCheckCircle /> Default</div>}

//                                                 <h4>{addr.fullName}</h4>
//                                                 <p><MdPhone /> {addr.phone}</p>
//                                                 <p><MdLocationOn /> {addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}</p>
//                                                 <p>{addr.city}, {addr.state} - {addr.pincode}</p>
//                                                 <p>{addr.country}</p>

//                                                 <div className="address-actions">
//                                                     {!addr.isDefault && (
//                                                         <button className="btn-default" onClick={() => handleSetDefault(addr._id)}>
//                                                             Set as Default
//                                                         </button>
//                                                     )}
//                                                     <button className="btn-edit" onClick={() => handleEditAddress(addr)}>
//                                                         <FaEdit /> Edit
//                                                     </button>
//                                                     <button className="btn-delete" onClick={() => handleDeleteAddress(addr._id)}>
//                                                         <FaTrash /> Delete
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ))
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* ORDERS TAB */}
//                     {activeTab === "orders" && (
//                         <div className="tab-content">
//                             <h2>My Orders</h2>
//                             <p className="tab-subtitle">Track and manage your orders</p>

//                             {orders.length === 0 ? (
//                                 <div className="empty-state">
//                                     <FaShoppingBag />
//                                     <p>No orders yet</p>
//                                     <small>Your order history will appear here</small>
//                                 </div>
//                             ) : (
//                                 <div className="orders-list">
//                                     {orders.map(order => (
//                                         <div key={order._id} className="order-card">
//                                             <div className="order-header">
//                                                 <div>
//                                                     <p className="order-id">Order #{order.orderId || order._id}</p>
//                                                     <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
//                                                 </div>
//                                                 <span className={`order-status ${order.status?.toLowerCase()}`}>
//                                                     {order.status || "Processing"}
//                                                 </span>
//                                             </div>
//                                             <div className="order-items">
//                                                 {order.items?.map((item, i) => (
//                                                     <div key={i} className="order-item">
//                                                         <img src={item.image} alt={item.name} />
//                                                         <div>
//                                                             <p>{item.name}</p>
//                                                             <small>Qty: {item.quantity}</small>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                             <div className="order-footer">
//                                                 <p>Total: <strong>₹{order.total}</strong></p>
//                                             </div>
//                                         </div>
//                                     ))}
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
//                                 <div className="form-group full-width">
//                                     <label>Current Password *</label>
//                                     <input
//                                         type="password"
//                                         required
//                                         value={passwordForm.currentPassword}
//                                         onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
//                                     />
//                                 </div>

//                                 <div className="form-group full-width">
//                                     <label>New Password *</label>
//                                     <input
//                                         type="password"
//                                         required
//                                         value={passwordForm.newPassword}
//                                         onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
//                                     />
//                                 </div>

//                                 <div className="form-group full-width">
//                                     <label>Confirm New Password *</label>
//                                     <input
//                                         type="password"
//                                         required
//                                         value={passwordForm.confirmPassword}
//                                         onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
//                                     />
//                                 </div>

//                                 <button type="submit" className="profile-save-btn" disabled={loading}>
//                                     {loading ? "Updating..." : "Update Password"}
//                                 </button>
//                             </form>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ProfilePopup;




// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './ProfilePopup.css';
// import { IoClose } from "react-icons/io5";
// import { FaUser, FaMapMarkerAlt, FaShoppingBag, FaLock, FaSignOutAlt, FaCamera, FaEdit, FaTrash, FaPlus, FaCheckCircle } from "react-icons/fa";
// import { MdPhone, MdLocationOn } from "react-icons/md";

// const API_BASE = "https://testingserver-73um.onrender.com/api/users/";

// function ProfilePopup({ onClose, onLogout }) {
//     const [activeTab, setActiveTab] = useState("profile");
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState({ type: "", text: "" });

//     const [user, setUser] = useState({
//         name: "",
//         email: "",
//         phone: "",
//         profileImage: "",
//         gender: "",
//         dob: "",
//     });

//     const [addresses, setAddresses] = useState([]);
//     const [showAddressForm, setShowAddressForm] = useState(false);
//     const [editingAddressId, setEditingAddressId] = useState(null);
//     const [addressForm, setAddressForm] = useState({
//         fullName: "",
//         phone: "",
//         pincode: "",
//         addressLine1: "",
//         addressLine2: "",
//         city: "",
//         state: "",
//         country: "India",
//         addressType: "Home",
//         isDefault: false,
//     });

//     const [passwordForm, setPasswordForm] = useState({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//     });

//     const [orders, setOrders] = useState([]);

//     const fileInputRef = useRef(null);
//     const token = localStorage.getItem("token");

//     useEffect(() => {
//         loadUserData();
//         loadAddresses();
//         loadOrders();
//     }, []);

//     useEffect(() => {
//         if (message.text) {
//             const timer = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//             return () => clearTimeout(timer);
//         }
//     }, [message]);

//     const showMessage = (type, text) => setMessage({ type, text });

//     const loadUserData = async () => {
//         try {
//             const res = await axios.get(`${API_BASE}profile`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setUser(res.data);
//         } catch (err) {
//             if (token) {
//                 try {
//                     const decoded = JSON.parse(atob(token.split(".")[1]));
//                     setUser(prev => ({ ...prev, name: decoded.name || "User" }));
//                 } catch (e) { }
//             }
//         }
//     };

//     const loadAddresses = async () => {
//         try {
//             const res = await axios.get(`${API_BASE}addresses`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setAddresses(res.data || []);
//         } catch (err) {
//             setAddresses([]);
//         }
//     };

//     const loadOrders = async () => {
//         try {
//             const res = await axios.get(`${API_BASE}orders`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setOrders(res.data || []);
//         } catch (err) {
//             setOrders([]);
//         }
//     };

//     const handleProfileUpdate = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const res = await axios.put(`${API_BASE}profile`, user, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             if (res.data.token) {
//                 localStorage.setItem("token", res.data.token);
//                 window.dispatchEvent(new Event("storage"));
//             }
//             showMessage("success", "Profile updated successfully!");
//         } catch (err) {
//             showMessage("error", err.response?.data?.message || "Update failed");
//         }
//         setLoading(false);
//     };

//     const handleImageUpload = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//         const reader = new FileReader();
//         reader.onloadend = async () => {
//             setUser(prev => ({ ...prev, profileImage: reader.result }));
//             try {
//                 setLoading(true);
//                 await axios.put(`${API_BASE}profile-image`, {
//                     profileImage: reader.result
//                 }, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 showMessage("success", "Profile picture updated!");
//             } catch (err) {
//                 showMessage("error", "Upload failed");
//             }
//             setLoading(false);
//         };
//         reader.readAsDataURL(file);
//     };

//     const handleAddressSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             if (editingAddressId) {
//                 await axios.put(`${API_BASE}addresses/${editingAddressId}`, addressForm, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 showMessage("success", "Address updated!");
//             } else {
//                 await axios.post(`${API_BASE}addresses`, addressForm, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 showMessage("success", "Address added!");
//             }
//             resetAddressForm();
//             loadAddresses();
//         } catch (err) {
//             showMessage("error", "Failed to save address");
//         }
//         setLoading(false);
//     };

//     const handleEditAddress = (address) => {
//         setAddressForm(address);
//         setEditingAddressId(address._id);
//         setShowAddressForm(true);
//     };

//     const handleDeleteAddress = async (id) => {
//         if (!window.confirm("Delete this address?")) return;
//         try {
//             await axios.delete(`${API_BASE}addresses/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             showMessage("success", "Address deleted!");
//             loadAddresses();
//         } catch (err) {
//             showMessage("error", "Delete failed");
//         }
//     };

//     const handleSetDefault = async (id) => {
//         try {
//             await axios.put(`${API_BASE}addresses/${id}/default`, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             loadAddresses();
//             showMessage("success", "Default address updated!");
//         } catch (err) {
//             showMessage("error", "Failed to update");
//         }
//     };

//     const resetAddressForm = () => {
//         setAddressForm({
//             fullName: "", phone: "", pincode: "", addressLine1: "", addressLine2: "",
//             city: "", state: "", country: "India", addressType: "Home", isDefault: false,
//         });
//         setEditingAddressId(null);
//         setShowAddressForm(false);
//     };

//     const handlePasswordChange = async (e) => {
//         e.preventDefault();
//         if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//             return showMessage("error", "Passwords don't match");
//         }
//         if (passwordForm.newPassword.length < 6) {
//             return showMessage("error", "Password must be at least 6 characters");
//         }
//         setLoading(true);
//         try {
//             await axios.put(`${API_BASE}change-password`, {
//                 currentPassword: passwordForm.currentPassword,
//                 newPassword: passwordForm.newPassword,
//             }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
//             showMessage("success", "Password changed successfully!");
//         } catch (err) {
//             showMessage("error", err.response?.data?.message || "Change failed");
//         }
//         setLoading(false);
//     };

//     const handleLogout = () => {
//         if (!window.confirm("Are you sure you want to logout?")) return;
//         localStorage.removeItem("token");
//         window.dispatchEvent(new Event("storage"));
//         if (onLogout) onLogout();
//         onClose();
//         window.location.reload();
//     };

//     return (
//         <div className="profile-popup-overlay" onClick={onClose}>
//             <div className="profile-popup-container" onClick={(e) => e.stopPropagation()}>

//                 <button className="profile-close-btn" onClick={onClose}>
//                     <IoClose />
//                 </button>

//                 {/* SIDEBAR */}
//                 <div className="profile-sidebar">
//                     <div className="profile-user-card">
//                         <div className="profile-image-wrapper">
//                             {user.profileImage ? (
//                                 <img src={user.profileImage} alt="Profile" className="profile-image" />
//                             ) : (
//                                 <div className="profile-image-placeholder">
//                                     {user.name ? user.name.charAt(0).toUpperCase() : "U"}
//                                 </div>
//                             )}
//                             <button className="profile-camera-btn" onClick={() => fileInputRef.current?.click()}>
//                                 <FaCamera />
//                             </button>
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 ref={fileInputRef}
//                                 onChange={handleImageUpload}
//                                 style={{ display: "none" }}
//                             />
//                         </div>
//                         <h3 className="profile-user-name">{user.name || "User"}</h3>
//                         <p className="profile-user-email">{user.email || user.phone}</p>
//                     </div>

//                     <ul className="profile-nav">
//                         <li className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
//                             <FaUser /> <span>My Profile</span>
//                         </li>
//                         <li className={activeTab === "addresses" ? "active" : ""} onClick={() => setActiveTab("addresses")}>
//                             <FaMapMarkerAlt /> <span>My Addresses</span>
//                         </li>
//                         <li className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
//                             <FaShoppingBag /> <span>My Orders</span>
//                         </li>
//                         <li className={activeTab === "password" ? "active" : ""} onClick={() => setActiveTab("password")}>
//                             <FaLock /> <span>Change Password</span>
//                         </li>
//                         <li className="logout-item" onClick={handleLogout}>
//                             <FaSignOutAlt /> <span>Logout</span>
//                         </li>
//                     </ul>
//                 </div>

//                 {/* MAIN CONTENT */}
//                 <div className="profile-content">
//                     {message.text && (
//                         <div className={`profile-message ${message.type}`}>
//                             {message.text}
//                         </div>
//                     )}

//                     {/* PROFILE TAB */}
//                     {activeTab === "profile" && (
//                         <div className="tab-content">
//                             <h2>My Profile</h2>
//                             <p className="tab-subtitle">Manage your personal information</p>

//                             <form onSubmit={handleProfileUpdate} className="profile-form">
//                                 <div className="form-row">
//                                     <div className="form-group">
//                                         <label>Full Name</label>
//                                         <input
//                                             type="text"
//                                             value={user.name || ""}
//                                             onChange={(e) => setUser({ ...user, name: e.target.value })}
//                                             placeholder="Enter your name"
//                                         />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Email</label>
//                                         <input
//                                             type="email"
//                                             value={user.email || ""}
//                                             onChange={(e) => setUser({ ...user, email: e.target.value })}
//                                             placeholder="Enter your email"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="form-row">
//                                     <div className="form-group">
//                                         <label>Phone Number</label>
//                                         <input
//                                             type="tel"
//                                             value={user.phone || ""}
//                                             onChange={(e) => setUser({ ...user, phone: e.target.value })}
//                                             placeholder="Enter phone number"
//                                         />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Gender</label>
//                                         <select
//                                             value={user.gender || ""}
//                                             onChange={(e) => setUser({ ...user, gender: e.target.value })}
//                                         >
//                                             <option value="">Select Gender</option>
//                                             <option value="Male">Male</option>
//                                             <option value="Female">Female</option>
//                                             <option value="Other">Other</option>
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <div className="form-row">
//                                     <div className="form-group">
//                                         <label>Date of Birth</label>
//                                         <input
//                                             type="date"
//                                             value={user.dob ? user.dob.split("T")[0] : ""}
//                                             onChange={(e) => setUser({ ...user, dob: e.target.value })}
//                                         />
//                                     </div>
//                                 </div>

//                                 <button type="submit" className="profile-save-btn" disabled={loading}>
//                                     {loading ? "Saving..." : "Save Changes"}
//                                 </button>
//                             </form>
//                         </div>
//                     )}

//                     {/* ADDRESSES TAB */}
//                     {activeTab === "addresses" && (
//                         <div className="tab-content">
//                             <div className="tab-header">
//                                 <div>
//                                     <h2>My Addresses</h2>
//                                     <p className="tab-subtitle">Manage your delivery addresses</p>
//                                 </div>
//                                 {!showAddressForm && (
//                                     <button className="add-address-btn" onClick={() => setShowAddressForm(true)}>
//                                         <FaPlus /> Add New Address
//                                     </button>
//                                 )}
//                             </div>

//                             {showAddressForm && (
//                                 <form onSubmit={handleAddressSubmit} className="address-form">
//                                     <h3>{editingAddressId ? "Edit Address" : "Add New Address"}</h3>

//                                     <div className="form-row">
//                                         <div className="form-group">
//                                             <label>Full Name *</label>
//                                             <input
//                                                 type="text"
//                                                 required
//                                                 value={addressForm.fullName}
//                                                 onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
//                                             />
//                                         </div>
//                                         <div className="form-group">
//                                             <label>Phone Number *</label>
//                                             <input
//                                                 type="tel"
//                                                 required
//                                                 value={addressForm.phone}
//                                                 onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="form-row">
//                                         <div className="form-group">
//                                             <label>Pincode *</label>
//                                             <input
//                                                 type="text"
//                                                 required
//                                                 value={addressForm.pincode}
//                                                 onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
//                                             />
//                                         </div>
//                                         <div className="form-group">
//                                             <label>City *</label>
//                                             <input
//                                                 type="text"
//                                                 required
//                                                 value={addressForm.city}
//                                                 onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="form-group full-width">
//                                         <label>Address Line 1 *</label>
//                                         <input
//                                             type="text"
//                                             required
//                                             placeholder="House No, Building, Street"
//                                             value={addressForm.addressLine1}
//                                             onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
//                                         />
//                                     </div>

//                                     <div className="form-group full-width">
//                                         <label>Address Line 2</label>
//                                         <input
//                                             type="text"
//                                             placeholder="Area, Colony, Landmark"
//                                             value={addressForm.addressLine2}
//                                             onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
//                                         />
//                                     </div>

//                                     <div className="form-row">
//                                         <div className="form-group">
//                                             <label>State *</label>
//                                             <input
//                                                 type="text"
//                                                 required
//                                                 value={addressForm.state}
//                                                 onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
//                                             />
//                                         </div>
//                                         <div className="form-group">
//                                             <label>Country *</label>
//                                             <input
//                                                 type="text"
//                                                 required
//                                                 value={addressForm.country}
//                                                 onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="form-row">
//                                         <div className="form-group">
//                                             <label>Address Type</label>
//                                             <div className="address-type-buttons">
//                                                 {["Home", "Work", "Other"].map(type => (
//                                                     <button
//                                                         type="button"
//                                                         key={type}
//                                                         className={addressForm.addressType === type ? "type-active" : ""}
//                                                         onClick={() => setAddressForm({ ...addressForm, addressType: type })}
//                                                     >
//                                                         {type}
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="checkbox-label">
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={addressForm.isDefault}
//                                                     onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
//                                                 />
//                                                 Set as default address
//                                             </label>
//                                         </div>
//                                     </div>

//                                     <div className="form-actions">
//                                         <button type="button" className="btn-cancel" onClick={resetAddressForm}>
//                                             Cancel
//                                         </button>
//                                         <button type="submit" className="btn-save" disabled={loading}>
//                                             {loading ? "Saving..." : editingAddressId ? "Update Address" : "Save Address"}
//                                         </button>
//                                     </div>
//                                 </form>
//                             )}

//                             {!showAddressForm && (
//                                 <div className="address-list">
//                                     {addresses.length === 0 ? (
//                                         <div className="empty-state">
//                                             <FaMapMarkerAlt />
//                                             <p>No addresses saved yet</p>
//                                         </div>
//                                     ) : (
//                                         addresses.map(addr => (
//                                             <div key={addr._id} className={`address-card ${addr.isDefault ? "default-address" : ""}`}>
//                                                 <div className="address-type-badge">{addr.addressType}</div>
//                                                 {addr.isDefault && <div className="default-badge"><FaCheckCircle /> Default</div>}

//                                                 <h4>{addr.fullName}</h4>
//                                                 <p><MdPhone /> {addr.phone}</p>
//                                                 <p><MdLocationOn /> {addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}</p>
//                                                 <p>{addr.city}, {addr.state} - {addr.pincode}</p>
//                                                 <p>{addr.country}</p>

//                                                 <div className="address-actions">
//                                                     {!addr.isDefault && (
//                                                         <button className="btn-default" onClick={() => handleSetDefault(addr._id)}>
//                                                             Set as Default
//                                                         </button>
//                                                     )}
//                                                     <button className="btn-edit" onClick={() => handleEditAddress(addr)}>
//                                                         <FaEdit /> Edit
//                                                     </button>
//                                                     <button className="btn-delete" onClick={() => handleDeleteAddress(addr._id)}>
//                                                         <FaTrash /> Delete
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ))
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* ORDERS TAB */}
//                     {activeTab === "orders" && (
//                         <div className="tab-content">
//                             <h2>My Orders</h2>
//                             <p className="tab-subtitle">Track and manage your orders</p>

//                             {orders.length === 0 ? (
//                                 <div className="empty-state">
//                                     <FaShoppingBag />
//                                     <p>No orders yet</p>
//                                     <small>Your order history will appear here</small>
//                                 </div>
//                             ) : (
//                                 <div className="orders-list">
//                                     {orders.map(order => (
//                                         <div key={order._id} className="order-card">
//                                             <div className="order-header">
//                                                 <div>
//                                                     <p className="order-id">Order #{order.orderId || order._id}</p>
//                                                     <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
//                                                 </div>
//                                                 <span className={`order-status ${order.status?.toLowerCase()}`}>
//                                                     {order.status || "Processing"}
//                                                 </span>
//                                             </div>
//                                             <div className="order-items">
//                                                 {order.items?.map((item, i) => (
//                                                     <div key={i} className="order-item">
//                                                         <img src={item.image} alt={item.name} />
//                                                         <div>
//                                                             <p>{item.name}</p>
//                                                             <small>Qty: {item.quantity}</small>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                             <div className="order-footer">
//                                                 <p>Total: <strong>₹{order.total}</strong></p>
//                                             </div>
//                                         </div>
//                                     ))}
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
//                                 <div className="form-group full-width">
//                                     <label>Current Password *</label>
//                                     <input
//                                         type="password"
//                                         required
//                                         value={passwordForm.currentPassword}
//                                         onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
//                                     />
//                                 </div>

//                                 <div className="form-group full-width">
//                                     <label>New Password *</label>
//                                     <input
//                                         type="password"
//                                         required
//                                         value={passwordForm.newPassword}
//                                         onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
//                                     />
//                                 </div>

//                                 <div className="form-group full-width">
//                                     <label>Confirm New Password *</label>
//                                     <input
//                                         type="password"
//                                         required
//                                         value={passwordForm.confirmPassword}
//                                         onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
//                                     />
//                                 </div>

//                                 <button type="submit" className="profile-save-btn" disabled={loading}>
//                                     {loading ? "Updating..." : "Update Password"}
//                                 </button>
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
    FaCamera, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaChevronDown, FaChevronUp
} from "react-icons/fa";
import { MdPhone, MdLocationOn, MdPayment } from "react-icons/md";

const API_BASE = "https://testingserver-73um.onrender.com/api/users/";

// ── Order status steps ──────────────────────────────────────────────────────
const ORDER_STEPS = [
    { key: "pending",   label: "Order Placed",  emoji: "📋", desc: "Your order has been received" },
    { key: "paid",      label: "Payment Done",  emoji: "💳", desc: "Payment confirmed successfully" },
    { key: "packed",    label: "Packed",        emoji: "📦", desc: "Your order is being packed" },
    { key: "shipped",   label: "Shipped",       emoji: "🚚", desc: "Order is on the way" },
    { key: "delivered", label: "Delivered",     emoji: "🏠", desc: "Order delivered successfully" },
];

function getStepIndex(status) {
    const idx = ORDER_STEPS.findIndex(s => s.key === status);
    return idx === -1 ? 1 : idx; // default to paid (1) if unknown
}

function OrderStatusStepper({ status }) {
    if (status === "cancelled" || status === "failed" || status === "refunded") {
        const labels = { cancelled: ["❌", "Order Cancelled", "This order was cancelled"],
                         failed:    ["⚠️", "Payment Failed",  "Payment could not be processed"],
                         refunded:  ["↩️", "Refunded",        "Amount has been refunded"] };
        const [emoji, label, desc] = labels[status];
        return (
            <div className="stepper-cancelled">
                <div className="cancelled-icon">{emoji}</div>
                <div><p className="step-label-active">{label}</p><p className="step-desc">{desc}</p></div>
            </div>
        );
    }

    const currentIdx = getStepIndex(status);
    return (
        <div className="order-stepper">
            {ORDER_STEPS.map((step, idx) => {
                const isDone   = idx < currentIdx;
                const isActive = idx === currentIdx;
                return (
                    <div key={step.key} className="stepper-row">
                        <div className="stepper-col">
                            <div className={`stepper-dot ${isDone ? "dot-done" : isActive ? "dot-active" : "dot-pending"}`}>
                                {isDone ? "✓" : step.emoji}
                            </div>
                            {idx < ORDER_STEPS.length - 1 && (
                                <div className={`stepper-line ${isDone ? "line-done" : ""}`} />
                            )}
                        </div>
                        <div className={`stepper-text ${idx > currentIdx ? "text-faded" : ""}`}>
                            <p className={`step-label ${isActive ? "step-label-active" : ""}`}>{step.label}</p>
                            {isActive && <p className="step-desc">{step.desc}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function getStatusMeta(status) {
    const map = {
        pending:   { text: "Order Placed",  cls: "s-pending" },
        paid:      { text: "Paid",          cls: "s-paid" },
        packed:    { text: "Packed",        cls: "s-packed" },
        shipped:   { text: "Shipped",       cls: "s-shipped" },
        delivered: { text: "Delivered",     cls: "s-delivered" },
        cancelled: { text: "Cancelled",     cls: "s-cancelled" },
        failed:    { text: "Failed",        cls: "s-failed" },
        refunded:  { text: "Refunded",      cls: "s-refunded" },
    };
    return map[status] || { text: status, cls: "s-pending" };
}

function OrderCard({ order }) {
    const [expanded, setExpanded] = useState(false);
    const meta = getStatusMeta(order.status);

    return (
        <div className={`order-card ocard-${order.status}`}>
            {/* ── Top Row ── */}
            <div className="ocard-header" onClick={() => setExpanded(v => !v)}>
                <div className="ocard-left">
                    <div className="ocard-bag"><FaShoppingBag /></div>
                    <div>
                        <p className="ocard-id">
                            #{(order.orderId || order._id || "").toString().slice(-10).toUpperCase()}
                        </p>
                        <p className="ocard-date">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric"
                            })}
                        </p>
                    </div>
                </div>
                <div className="ocard-right">
                    <span className={`status-pill ${meta.cls}`}>{meta.text}</span>
                    <span className="ocard-amount">₹{order.total ?? order.amount}</span>
                    <span className="ocard-chevron">{expanded ? <FaChevronUp /> : <FaChevronDown />}</span>
                </div>
            </div>

            {/* ── Items Preview ── */}
            <div className="ocard-preview">
                {(order.items || []).slice(0, 3).map((item, i) => (
                    <div key={i} className="preview-chip">
                        {item.image
                            ? <img src={item.image} alt={item.name} />
                            : <div className="chip-placeholder">📦</div>}
                        <span className="chip-name">{item.name}</span>
                        <span className="chip-qty">×{item.quantity}</span>
                    </div>
                ))}
                {(order.items || []).length > 3 && (
                    <span className="preview-more">+{order.items.length - 3} more</span>
                )}
            </div>

            {/* ── Expanded Body ── */}
            {expanded && (
                <div className="ocard-body">

                    {/* Items full list */}
                    <div className="ocard-section">
                        <p className="section-title">🛍️ Items Ordered</p>
                        {(order.items || []).map((item, i) => (
                            <div key={i} className="item-row">
                                {item.image
                                    ? <img src={item.image} alt={item.name} className="item-img" />
                                    : <div className="item-img-ph">📦</div>}
                                <div className="item-info">
                                    <p className="item-name">{item.name}</p>
                                    <p className="item-meta">Qty {item.quantity} × ₹{item.price}</p>
                                </div>
                                <p className="item-total">₹{((item.quantity || 1) * (item.price || 0)).toFixed(0)}</p>
                            </div>
                        ))}
                        <div className="items-total-row">
                            <span>Total Paid</span>
                            <strong>₹{order.total ?? order.amount}</strong>
                        </div>
                    </div>

                    {/* Status tracker */}
                    <div className="ocard-section">
                        <p className="section-title">📍 Order Tracking</p>
                        <OrderStatusStepper status={order.status} />
                    </div>

                    {/* Shipping address */}
                    {order.shippingAddress && (
                        <div className="ocard-section">
                            <p className="section-title">📬 Delivery Address</p>
                            <div className="addr-box">
                                <MdLocationOn className="addr-icon" />
                                <div>
                                    <p className="addr-name">{order.shippingAddress.name}</p>
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
                                    {order.shippingAddress.phone && <p>📞 {order.shippingAddress.phone}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment info */}
                    <div className="ocard-section ocard-payment">
                        <p className="section-title">💳 Payment Info</p>
                        <div className="payment-row">
                            <span>{order.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay"}</span>
                            {order.razorpayPaymentId && (
                                <span className="pay-id">ID: …{order.razorpayPaymentId.slice(-8)}</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
function ProfilePopup({ onClose, onLogout }) {
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading]     = useState(false);
    const [message, setMessage]     = useState({ type: "", text: "" });
    const [ordersLoading, setOrdersLoading] = useState(false);

    const [user, setUser] = useState({ name: "", email: "", phone: "", profileImage: "", gender: "", dob: "" });
    const [addresses, setAddresses]         = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({
        fullName: "", phone: "", pincode: "", addressLine1: "", addressLine2: "",
        city: "", state: "", country: "India", addressType: "Home", isDefault: false,
    });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [orders, setOrders] = useState([]);

    const fileInputRef = useRef(null);
    const token = localStorage.getItem("token");

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
        }
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
                ...o,
                orderId: o.razorpayOrderId,
                total:   o.amount,
                items:   (o.items || []).map(i => ({ ...i, name: i.productName, image: i.imageUrl })),
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
        try { await axios.delete(`${API_BASE}addresses/${id}`, { headers: { Authorization: `Bearer ${token}` } }); showMessage("success", "Deleted!"); loadAddresses(); }
        catch { showMessage("error", "Delete failed"); }
    };
    const handleSetDefault = async (id) => {
        try { await axios.put(`${API_BASE}addresses/${id}/default`, {}, { headers: { Authorization: `Bearer ${token}` } }); loadAddresses(); showMessage("success", "Default updated!"); }
        catch { showMessage("error", "Failed"); }
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
        <div className="profile-popup-overlay" onClick={onClose}>
            <div className="profile-popup-container" onClick={e => e.stopPropagation()}>
                <button className="profile-close-btn" onClick={onClose}><IoClose /></button>

                {/* SIDEBAR */}
                <div className="profile-sidebar">
                    <div className="profile-user-card">
                        <div className="profile-image-wrapper">
                            {user.profileImage
                                ? <img src={user.profileImage} alt="Profile" className="profile-image" />
                                : <div className="profile-image-placeholder">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>}
                            <button className="profile-camera-btn" onClick={() => fileInputRef.current?.click()}><FaCamera /></button>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: "none" }} />
                        </div>
                        <h3 className="profile-user-name">{user.name || "User"}</h3>
                        <p className="profile-user-email">{user.email || user.phone}</p>
                    </div>
                    <ul className="profile-nav">
                        {[
                            { key: "profile",   label: "My Profile",      icon: <FaUser /> },
                            { key: "addresses", label: "My Addresses",     icon: <FaMapMarkerAlt /> },
                            { key: "orders",    label: "My Orders",        icon: <FaShoppingBag />, badge: orders.length || null },
                            { key: "password",  label: "Change Password",  icon: <FaLock /> },
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

                    {/* PROFILE */}
                    {activeTab === "profile" && (
                        <div className="tab-content">
                            <h2>My Profile</h2>
                            <p className="tab-subtitle">Manage your personal information</p>
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
                        </div>
                    )}

                    {/* ADDRESSES */}
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

                    {/* ORDERS */}
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

                    {/* PASSWORD */}
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