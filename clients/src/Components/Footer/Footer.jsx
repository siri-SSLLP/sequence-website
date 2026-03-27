import React from "react";
import "./Footer.css";
import {
    FaInstagram,
    FaFacebookF,
    FaYoutube,
    FaTwitter,
    FaPinterestP,
    FaMapMarkerAlt
} from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { Link } from "react-router-dom";


const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-container">

                {/* CONTACT */}
                <div className="footer-section">
                    <h3>CONTACT US</h3>

                    <p>
                        <strong>Showroom:</strong><br />
                        Sequence Surfaces LLP<br />
                        No 269/1 Mysore Road, Kasturiba Nagar<br />
                        Bangalore - 560026
                    </p>

                    {/* GOOGLE MAP LINK - SHOWROOM */}
                    <a
                        href="https://maps.app.goo.gl/uoXK3vrvdthMMRck7"
                        target="_blank"
                        rel="noreferrer"
                        className="map-link"
                    >
                        <FaMapMarkerAlt /> View Showroom on Map
                    </a>

                    <p>
                        <strong>Warehouse:</strong><br />
                        Sequence Surfaces LLP<br />
                        46/1, 1st Main Road, Kamakshipalya<br />
                        Bangalore - 560079
                    </p>

                    {/* GOOGLE MAP LINK - WAREHOUSE */}
                    <a
                        href="https://maps.app.goo.gl/noSpS8DtiZXgM16KA"
                        target="_blank"
                        rel="noreferrer"
                        className="map-link"
                    >
                        <FaMapMarkerAlt /> View Warehouse on Map
                    </a>

                    <p>
                        Phone: +91 9164001231 / +91 6363865515<br />
                        WhatsApp: 8660799143
                    </p>

                    <p>Hours: Mon - Fri (11 AM to 7 PM)</p>
                </div>

                {/* QUICK LINKS */}
                <div className="footer-section">
                    <h3>QUICK LINKS</h3>

                    <ul className="footer-links">
                        <li><Link to={"/about-us"}>About Us</Link></li>
                        <li><Link to={"/privacy-policy"}>Privacy Policy</Link></li>
                        <li><Link to={"/maintenance-guide"}>Maintenance Guide</Link></li>
                        <li><Link to={"/contact-us"}>Contact Us</Link></li>
                        <li><Link to={"/cancellation-policy"}>Cancellation Policy</Link></li>
                    </ul>
                </div>

                {/* SOCIAL MEDIA */}
                <div>
                    <div className="footer-section">
                        <h3>FOLLOW US</h3>

                        <div className="social-icons">
                            <a href="https://www.instagram.com/sequencesurfaces/" target="_blank" rel="noreferrer">
                                <FaInstagram />
                            </a>
                            <a href="https://www.facebook.com/people/SequenceSurfaces/100082320810904/" target="_blank" rel="noreferrer">
                                <FaFacebookF />
                            </a>
                            <a href="https://www.youtube.com/channel/UCQnmM3SDPUBzucLLlx_uGVg" target="_blank" rel="noreferrer">
                                <FaYoutube />
                            </a>
                            <a href="https://x.com/sequencellp" target="_blank" rel="noreferrer">
                                {/* <FaTwitter /> */}
                                <BsTwitterX />
                            </a>
                            <a href="https://www.pinterest.com/SequenceSurfaceLaminate/" target="_blank" rel="noreferrer">
                                <FaPinterestP />
                            </a>
                        </div>
                    </div>
                    <div>
                        {/* GOOGLE MAP */}
                        <div className="footer-map-container">
                            <iframe
                            className="footer-main-map"
                                title="map"
                                src="https://maps.google.com/maps?q=12.9716,77.5946&output=embedhttps://maps.google.com/maps?q=Bangalore&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>

            </div>

            {/* BOTTOM */}
            <div className="footer-bottom">
                © {new Date().getFullYear()} Sequence Surfaces LLP. All rights reserved. Managed by
                <Link className="footer-link-to-website" to={'https://sequencesurface.com/'}
                    target="_blank"
                    rel="noopener noreferrer">
                    <p>
                        Sequence Surface LLP
                    </p>
                </Link>
            </div>

        </footer>
    );
};

export default Footer;