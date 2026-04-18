import { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
// import { product } from '../../assets/assets.js';
import { ImWhatsapp } from "react-icons/im";
import { IoCall } from "react-icons/io5";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BsCart3 } from "react-icons/bs";
import { IoPerson } from "react-icons/io5";
import { MdOutlineStorefront } from "react-icons/md";
import { IoLogIn } from "react-icons/io5";
import { FaSignInAlt } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaPersonChalkboard } from "react-icons/fa6";
import { BiSolidContact } from "react-icons/bi";
import { FaBlog } from "react-icons/fa6";
import { callNumber, Message, WhatsappNumber } from '../../assets/assets.js';
import SignInSignUp from '../Signupsignin/Signupsignin.jsx';
import { ProductContext } from '../../Context/Context.jsx';
import ProfilePopup from '../ProfilePopup/ProfilePopup.jsx';

function NavBar() {
    const [showProfile, setShowProfile] = useState(false);
    const { cart, products } = useContext(ProductContext);
    const product = products;
    const [showAuth, setShowAuth] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [userName, setUserName] = useState("");

    // Ref for click-outside detection
    const desktopSearchRef = useRef(null);
    const mobileSearchRef = useRef(null);

    const groupedCategories = {};
    product.forEach((item) => {
        const parentId = item.parentCategory.id;
        if (!groupedCategories[parentId]) {
            groupedCategories[parentId] = { name: item.parentCategory.name, children: [] };
        }
        const childExists = groupedCategories[parentId].children.find(
            (c) => c.id === item.childCategory.id
        );
        if (!childExists) {
            groupedCategories[parentId].children.push(item.childCategory);
        }
    });

    // Search filter effect
    useEffect(() => {
        if (search.trim() === "") {
            setSearchResults([]);
            return;
        }

        const filtered = product.filter((item) =>
            item.productName?.toLowerCase().includes(search.toLowerCase()) ||
            item.brand?.toLowerCase().includes(search.toLowerCase()) ||
            item.tags?.some(tag =>
                tag.toLowerCase().includes(search.toLowerCase())
            )
        );

        setSearchResults(filtered.slice(0, 6));
    }, [search]);

    // Click-outside handler to close dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedOutsideDesktop =
                desktopSearchRef.current && !desktopSearchRef.current.contains(e.target);
            const clickedOutsideMobile =
                mobileSearchRef.current && !mobileSearchRef.current.contains(e.target);

            if (clickedOutsideDesktop && clickedOutsideMobile) {
                setSearch("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


 useEffect(() => {
    const updateUser = () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split(".")[1]));
                setUserName(decoded.name || "User");
            } catch (err) {
                console.log("Token decode error");
            }
        }
    };

    // ✅ RUN ON FIRST LOAD
    updateUser();

    // ✅ LISTEN FOR CHANGES (other tabs)
    window.addEventListener("storage", updateUser);

    return () => window.removeEventListener("storage", updateUser);
}, []);







    return (
        <>
            {showAuth && <SignInSignUp onClose={() => setShowAuth(false)} />}
                {showProfile && (
    <ProfilePopup 
        onClose={() => setShowProfile(false)}
        onLogout={() => setUserName("")}
    />
)}
            <ul></ul>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">

                    <Link to={'/'}>
                        <img className='img-logo' src='https://sequencesurface.com/images/logo.png' alt="logo" />
                    </Link>

                    <button className="navbar-toggler custom-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu">
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>

                    <div className="collapse navbar-collapse desktop-menu">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbar-item-test1">
                            <li className="nav-item">
                                <Link className="nav-link" style={{ color: "white" }} to="/home">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" style={{ color: "white" }} to="/about-us">About Us</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" style={{ color: "white" }} to="/contact-us">Contact Us</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" style={{ color: "white" }} to="/blog">Blog</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/products" className="nav-link" style={{ color: "white" }}>Our Collections</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="visit-store-btn-navbar nav-link navbar-btn" style={{ color: "white" }} to="/products">
                                    Visit Store
                                </Link>
                            </li>
                        </ul>

                        {/* DESKTOP SEARCH BAR */}
                        <form
                            className="d-flex"
                            style={{ position: "relative" }}
                            ref={desktopSearchRef}
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <input
                                className="navbar-search-input me-2"
                                type="search"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button className="navbar-btn btn btn-outline-success" type="submit">Search</button>

                            {/* SEARCH DROPDOWN */}
                            {search.trim() !== "" && (
                                <div className="search-dropdown">
                                    {searchResults.length > 0 ? (
                                        searchResults.map((data) => {
                                            const img = data.imageUrl || data.images?.[0];
                                            return (
                                                <Link
                                                    to={`/product/${data.productId}`}
                                                    key={data.productId}
                                                    className="search-item"
                                                    onClick={() => setSearch("")}
                                                >
                                                    <img src={img} alt={data.productName} />
                                                    <div className="search-info">
                                                        <p className="name">{data.productName}</p>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <div className="no-search-result">
                                            No Product Found
                                        </div>
                                    )}
                                </div>
                            )}
                        </form>

                        <div className='div-desktop-cart' style={{ display: "flex" }}>
                            <Link to={'/cart'} className='img-cart-icon'>
                                <BsCart3 />
                            </Link>
                            <div className='cart-count-desktop'>{Object.keys(cart).length}</div>
                        </div>

                        {/* <button
                            className='signin-signup-desktop'
                            onClick={() => setShowAuth(true)}
                            style={{
                                background: 'none',
                                border: '1px solid #ebc76c',
                                borderRadius: '25px',
                                padding: '8px 18px',
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: '500',
                                fontSize: '14px',
                                marginLeft: '10px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            SignUp / SignIn
                        </button> */}


                        {/* {userName ? (
                            <button className='signin-signup-desktop' style={{
                                background: 'none',
                                border: '1px solid #ebc76c',
                                borderRadius: '25px',
                                padding: '8px 18px',
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: '500',
                                fontSize: '14px',
                                marginLeft: '10px',
                                transition: 'all 0.2s ease'
                            }}>
                                👤 {userName}
                            </button>
                        ) : (
                            <button
                                className='signin-signup-desktop ' style={{
                                background: 'none',
                                border: '1px solid #ebc76c',
                                borderRadius: '25px',
                                padding: '8px 18px',
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: '500',
                                fontSize: '14px',
                                marginLeft: '10px',
                                transition: 'all 0.2s ease'
                            }}
                                onClick={() => setShowAuth(true)}
                            >
                                SignUp / SignIn
                            </button>
                        )} */}

{userName ? (
    <button 
        className='signin-signup-desktop' 
        onClick={() => setShowProfile(true)}  // ✅ ONLY ADD THIS LINE
        style={{
            background: 'none',
            border: '1px solid #ebc76c',
            borderRadius: '25px',
            padding: '8px 18px',
            cursor: 'pointer',
            color: 'white',
            fontWeight: '500',
            fontSize: '14px',
            marginLeft: '10px',
            transition: 'all 0.2s ease'
        }}>
        👤 {userName}
    </button>
) : (
    <button
        className='signin-signup-desktop' 
        style={{
                                background: 'none',
                                border: '1px solid #ebc76c',
                                borderRadius: '25px',
                                padding: '8px 18px',
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: '500',
                                fontSize: '14px',
                                marginLeft: '10px',
                                transition: 'all 0.2s ease'
                            }}
        onClick={() => setShowAuth(true)}
    >
        SignUp / SignIn
    </button>
)}







                    </div>
                </div>
            </nav>

            {/* MOBILE OFFCANVAS MENU */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="mobileMenu">
                <Link to={'/'}>
                    <img src='https://sequencesurface.com/images/logo.png' className='img-offcanvas-logo' alt='Sequence Surface Logo' />
                </Link>

                <div className="offcanvas-header">
                    <button type="button" className="btn-close close-btn" data-bs-dismiss="offcanvas"></button>
                </div>

                <div className="p-3">
                    <ul className="navbar-nav">
                        <div className='colasped-side-bar'>

                            <li className="nav-item">
                                <Link className="nav-link" to="/home">
                                    <div className='row' data-bs-dismiss="offcanvas">
                                        <div className='col-6 text-end offcanvas-icons'><FaHome /></div>
                                        <div className='col-4 text-start offcanvas-home'><span> Home</span></div>
                                    </div>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/about-us">
                                    <div className='row' data-bs-dismiss="offcanvas">
                                        <div className='col-6 text-end offcanvas-icons'><FaPersonChalkboard /></div>
                                        <div className='col-4 text-start offcanvas-about-us'><span> About Us</span></div>
                                    </div>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/contact-us">
                                    <div className='row' data-bs-dismiss="offcanvas">
                                        <div className='col-6 text-end offcanvas-icons'><BiSolidContact /></div>
                                        <div className='col-4 text-start offcanvas-contact-us'><span> Contact Us</span></div>
                                    </div>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/blog">
                                    <div className='row' data-bs-dismiss="offcanvas">
                                        <div className='col-6 text-end offcanvas-icons'><FaBlog /></div>
                                        <div className='col-4 text-start'><span> Blog</span></div>
                                    </div>
                                </Link>
                            </li>

                            <li className="nav-item mt-3" data-bs-dismiss="offcanvas">
                                {/* <Link className="visit-store-btn-navbar nav-link navbar-btn visit-btn" onClick={() => setShowAuth(true)}>
                                    <BsCart3 /> <span>SignUp / SignIn</span>
                                </Link> */}
                                {userName ? (
    <Link 
        className="visit-store-btn-navbar nav-link navbar-btn visit-btn" 
        onClick={() => setShowProfile(true)}
        data-bs-dismiss="offcanvas"
    >
        <IoPerson /> <span>👤 {userName}</span>
    </Link>
) : (
    <Link 
        className="visit-store-btn-navbar nav-link navbar-btn visit-btn" 
        onClick={() => setShowAuth(true)}
    >
        <BsCart3 /> <span>SignUp / SignIn</span>
    </Link>
)}

                                <Link className="visit-store-btn-navbar nav-link navbar-btn visit-btn" to="/cart">
                                    <BsCart3 /> <span>Cart</span>
                                </Link>

                                <Link className="visit-store-btn-navbar nav-link navbar-btn visit-btn" to="/products">
                                    <MdOutlineStorefront /> <span data-bs-dismiss="offcanvas">Visit Store</span>
                                </Link>
                            </li>

                        </div>
                    </ul>

                    {/* MOBILE SEARCH */}
                    <form
                        className="d-flex mt-3"
                        style={{ position: "relative" }}
                        ref={mobileSearchRef}
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            className="offcanvas-search-field form-control me-2"
                            type="search"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-outline-success" type="submit">
                            <span>Search</span>
                        </button>

                        {/* MOBILE SEARCH DROPDOWN */}
                        {search.trim() !== "" && (
                            <div className="search-dropdown">
                                {searchResults.length > 0 ? (
                                    searchResults.map((data) => {
                                        const img = data.imageUrl || data.images?.[0];
                                        return (
                                            <Link
                                                to={`/product/${data.productId}`}
                                                key={data.productId}
                                                className="search-item"
                                                onClick={() => setSearch("")}
                                            >
                                                <img src={img} alt={data.productName} />
                                                <div className="search-info">
                                                    <p className="name">{data.productName}</p>
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="no-search-result">
                                        No Product Found
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                </div>

                <div className="second-row-mobile">
                    <div className='container'>
                        <div className="row" data-bs-dismiss="offcanvas">
                            {Object.entries(groupedCategories).map(([key, category], index) => (
                                <div key={index} className="col-6">
                                    <li className="nav-item dropdown" style={{ listStyleType: "none" }}>
                                        <div className='off-canvas-category'>

                                            {/* 
                                            <Link
                                        className="dropdown-item"
                                        to="/products"
                                        state={{
                                            category: category.name,
                                            subcategory: child.name
                                        }}
                                    >
                                        {child.name}
                                    </Link> */}

                                            <Link
                                                to="/products"
                                                className="nav-link dropdown-toggle wrap-text box-size"
                                                style={{ color: "black" }}
                                                role="button" state={{
                                                    category: category.name
                                                }}
                                            >
                                                {category.name}
                                            </Link>
                                        </div>
                                    </li>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='row p-4'>
                    <div className='col-6 container'>
                        <button className="btn-contact-details-offcanvas" onClick={() => window.location.href = `tel:${callNumber}`}>
                            <div className='whatsapp-logo-img'><IoCall /></div>
                            <span> Call Us</span>
                        </button>
                    </div>

                    <div className='col-6 container'>
                        <button className="btn-contact-details-offcanvas" onClick={() => window.open(`https://wa.me/${WhatsappNumber}?text=${Message}`)}>
                            <div className='whatsapp-logo-img'><ImWhatsapp /></div>
                            <span> WhatsApp</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* DESKTOP SECOND ROW - CATEGORY DROPDOWNS */}
            <div className='dropdowns-link mb-5'>
                {Object.entries(groupedCategories).map(([key, category], index) => (
                    <li key={index} className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                        >
                            {category.name}
                            <img
                                className='dropdown-img-logo'
                                src='https://img.icons8.com/?size=100&id=5jRysPx2JtDa&format=png&color=000000'
                                alt=""
                            />
                        </a>

                        <ul className="dropdown-menu">
                            {category.children.map((child, i) => (
                                <li key={i}>
                                    <Link
                                        className="dropdown-item"
                                        to="/products"
                                        state={{
                                            category: category.name,
                                            subcategory: child.name
                                        }}
                                    >
                                        {child.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </div>
        </>
    );
}

export default NavBar;