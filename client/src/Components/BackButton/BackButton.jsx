import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./BackButton.css";

// Floating "Back" button on every page except the home page. Bottom-left,
// mirroring the WhatsApp button, so it never covers a page's heading.
const BackButton = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    if (pathname === "/" || pathname === "/home") return null;

    // React Router counts the pages visited in this tab. If the visitor
    // landed straight on this page (a shared link, a new tab), there is
    // nothing on the site to go back to, so take them home instead.
    const goBack = () => {
        if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
        else navigate("/");
    };

    return (
        <button type="button" className="back-float" onClick={goBack} aria-label="Go back to the previous page">
            <FaArrowLeft aria-hidden="true" />
            <span>Back</span>
        </button>
    );
};

export default BackButton;
