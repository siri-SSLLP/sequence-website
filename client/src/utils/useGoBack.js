import { useNavigate } from "react-router-dom";

// Go to the previous page on this site. React Router counts the pages
// visited in this tab; if the visitor landed straight on this page (a shared
// link, a new tab), there is nothing to go back to, so go home instead.
export const useGoBack = () => {
    const navigate = useNavigate();
    return () => {
        if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
        else navigate("/");
    };
};
