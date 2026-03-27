import { Link } from 'react-router-dom';
import './NavBar.css'
import { product } from '../../assets/assets.js'
import { ImWhatsapp } from "react-icons/im";
import { IoCall } from "react-icons/io5";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BsCart3 } from "react-icons/bs";
import { IoPerson } from "react-icons/io5";
import { MdOutlineStorefront } from "react-icons/md";
import { IoLogIn } from "react-icons/io5";
import { FaSignInAlt } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { FaPersonChalkboard } from "react-icons/fa6";
import { BiSolidContact } from "react-icons/bi";
import { FaBlog } from "react-icons/fa6";
import { callNumber, Message, WhatsappNumber } from '../../assets/assets.js';




function NavBar() {

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
            <ul>
            </ul>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    {/* Logo */}
                    <Link to={'/'}>
                        <img
                            className='img-logo'
                            src='https://sequencesurface.com/images/logo.png'
                            alt="logo"
                        />
                    </Link>
                    <button
                        className="navbar-toggler custom-toggler"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#mobileMenu"
                    >
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>
                    {/* Desktop Menu */}
                    <div className="collapse navbar-collapse desktop-menu">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbar-item-test1">
                            <li className="nav-item">
                                <Link className="nav-link" style={{ color: "white" }} to="/home">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" style={{ color: "white" }} to="/about-us">
                                    About Us
                                </Link>
                            </li><li className="nav-item">
                                <Link className="nav-link" style={{ color: "white" }} to="/contact-us">
                                    Contact Us
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" style={{ color: "white" }} to="/blog">
                                    Blog
                                </Link>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link disabled" style={{ color: "white" }}>
                                    560079
                                </span>
                            </li>
                            <li className="nav-item">
                                <Link className="visit-store-btn-navbar nav-link navbar-btn" style={{ color: "white" }} to="/store">
                                    Visit Store
                                </Link>
                            </li>
                        </ul>
                        {/* Search Bar */}
                        <form className="d-flex">
                            <input className="navbar-search-input me-2" type="search" placeholder="Search" />
                            <button className="navbar-btn btn btn-outline-success" type="submit">
                                Search
                            </button>
                        </form>
                        <div className='div-desktop-cart' style={{ display: "flex" }}>
                            <Link to={'/cart'} className='img-cart-icon'>
                                <BsCart3 />
                            </Link>
                            <div className='cart-count-desktop'>
                                20
                            </div>
                        </div>
                        {/* <a href="/login"><button className="login-desktop navbar-btn btn btn-outline-success">Login</button></a> */}
                        <Link className='signin-signup-desktop' to={'signup'}>SignUp / SignIn</Link>
                    </div>
                </div>
            </nav>
            {/* MOBILE OFFCANVAS MENU */}
            <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="mobileMenu"
            >
                <Link to={'/'}>
                    <img src='https://sequencesurface.com/images/logo.png' className='img-offcanvas-logo' alt='Sequence Surface Logo' ></img>
                </Link>
                <div className="offcanvas-header">
                    {/* <h5>Menu</h5> */}
                    <button
                        type="button"
                        className="btn-close close-btn"
                        data-bs-dismiss="offcanvas"
                    ></button>
                </div>
                <div className="p-3">
                    <ul className="navbar-nav">
                        <div className='colasped-side-bar'>
                            <li className="nav-item">
                                <Link className="nav-link" to="/home">
                                    <div className='row'>
                                        <div className='col-6 text-end offcanvas-icons'><FaHome /></div>
                                        <div className='col-4 text-start offcanvas-home'><span> Home</span></div>
                                    </div>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/about-us">
                                    <div className='row'>
                                        <div className='col-6 text-end offcanvas-icons'><FaPersonChalkboard /></div>
                                        <div className='col-4 text-start offcanvas-about-us'><span> About Us</span></div>
                                    </div>
                                </Link>
                            </li><li className="nav-item">
                                <Link className="nav-link" to="/contact-us">
                                    <div className='row'>
                                        <div className='col-6 text-end offcanvas-icons'><BiSolidContact /></div>
                                        <div className='col-4 text-start offcanvas-contact-us'><span> Contact Us</span></div>
                                    </div>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/blog">
                                    <div className='row'>
                                        <div className='col-6 text-end offcanvas-icons'><FaBlog /></div>
                                        <div className='col-4 text-start'><span> Blog</span></div>
                                    </div>
                                </Link>
                            </li>
                            <div className='login-mobile'>
                                <div className='row'>
                                    <div className='col-6'><li className="nav-item">
                                        <Link className="nav-link" to="/login">
                                            <IoLogIn /><span> Login</span>
                                        </Link>
                                    </li></div>
                                    <div className='col-6'><li className="nav-item">
                                        <Link className="nav-link" to="/signup">
                                            <FaSignInAlt /><span> Signup</span>
                                        </Link>
                                    </li></div>
                                </div>
                            </div>
                            <li className="nav-item mt-3">
                                <Link className="visit-store-btn-navbar nav-link navbar-btn visit-btn" to="/cart">
                                    <BsCart3 /> <span>Cart</span>
                                </Link>
                                <Link className="visit-store-btn-navbar nav-link navbar-btn visit-btn" to="/profile">
                                    <IoPerson /> <span>Profile</span>
                                </Link>
                                <Link className="visit-store-btn-navbar nav-link navbar-btn visit-btn" to="/store">
                                    <MdOutlineStorefront /> <span>Visit Store</span>
                                </Link>
                            </li>
                        </div>
                    </ul>
                    {/* Search */}
                    <form className="d-flex mt-3">
                        <input className="offcanvas-search-field form-control me-2" type="search" placeholder="Search" />
                        <button className="btn btn-outline-success">
                            <div className='offcanvas-search-icon'>
                                {/* <BsSearch /> */}
                            </div> <span>Search</span>
                        </button>
                    </form>
                </div>
                {/* Second Row Mobile View */}
                <div className="second-row-mobile">
                    <div className='container'>
                        <div className="row">
                            {
                                Object.entries(groupedCategories).map(([key, category], index) => (
                                    <div key={index} className="col-6 ">
                                        <li className="nav-item dropdown" style={{ listStyleType: "none" }}>

                                            <div className='off-canvas-category'>
                                                <Link
                                                    to={`/${category.name}`}
                                                    className="nav-link dropdown-toggle wrap-text box-size"
                                                    style={{ color: "black" }}
                                                    role="button"
                                                >
                                                    {category.name}
                                                </Link>
                                            </div>

                                            {/* <ul className="dropdown-menu two-column-dropdown">
                                                {
                                                    category.children.map((child, i) => (
                                                        <li key={i}>
                                                            <a className="dropdown-item" href="#">
                                                                {child.name}
                                                            </a>
                                                        </li>
                                                    ))
                                                }
                                            </ul> */}
                                        </li>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className='row p-4'>
                    <div className='col-6 container'>
                        <button className="btn-contact-details-offcanvas" onClick={()=>window.location.href=`tel:${callNumber}`}>
                            <div className='whatsapp-logo-img'>
                                <IoCall />
                            </div>

                            <span> Call Us</span>
                        </button>

                    </div>
                    <div className='col-6 container'>
                        <button className="btn-contact-details-offcanvas" onClick={()=>window.open(`https://wa.me/${WhatsappNumber}?text=${Message}`)}>
                            <div className='whatsapp-logo-img'>
                                <ImWhatsapp />
                            </div>
                            <span> WhatsApp</span>
                        </button>

                    </div>
                </div>
            </div>
            {/* SECOND ROW DESKTOP VERSION */}
            <div className='dropdowns-link'>
                {
                    Object.entries(groupedCategories).map(([key, category], index) => (
                        <li key={index} className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                style={{ color: "black" }}
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                            >
                                {category.name} <img className='dropdown-img-logo' src='https://img.icons8.com/?size=100&id=5jRysPx2JtDa&format=png&color=000000'></img>
                            </a>
                            <ul className="dropdown-menu">
                                {
                                    category.children.map((child, i) => (
                                        <li key={i} >
                                            <a className="dropdown-item" href="#">
                                                {child.name}
                                            </a>
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                    ))
                }
            </div>
        </>
    )
}
export default NavBar   