import { useLocation } from "react-router-dom";
import { useGoBack } from "../../utils/useGoBack";
import { FaArrowLeft } from "react-icons/fa";
import "./BackButton.css";

// Pages whose left side holds a sticky panel; they show their own Back
// button inside it on wider screens, so the floating one steps aside there.
const PAGES_WITH_OWN_BACK = ["/products"];

// Floating "Back" button on every page except the home page. Bottom-left,
// mirroring the WhatsApp button, so it never covers a page's heading.
const BackButton = () => {
    const { pathname } = useLocation();
    const goBack = useGoBack();

    if (pathname === "/" || pathname === "/home") return null;

    const ownBack = PAGES_WITH_OWN_BACK.includes(pathname);

    return (
        <button
            type="button"
            className={`back-float${ownBack ? " back-float--page-has-own" : ""}`}
            onClick={goBack}
            aria-label="Go back to the previous page"
        >
            <FaArrowLeft aria-hidden="true" />
            <span>Back</span>
        </button>
    );
};

export default BackButton;
