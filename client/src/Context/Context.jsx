// // src/context/ProductContext.jsx
// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// export const ProductContext = createContext();

// export const ProductProvider = ({ children }) => {
//   // ✅ Load cart from localStorage on first render
//   const [cart, setCart] = useState(() => {
//     try {
//       const saved = localStorage.getItem("cart");
//       return saved ? JSON.parse(saved) : {};
//     } catch {
//       return {};
//     }
//   });

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Save cart to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(
//         "https://testingserver-73um.onrender.com/api/products",
//         {
//           headers: {
//             Authorization: `Bearer seq$123`,
//           },
//         }
//       );
//       setProducts(res.data);
//     } catch (err) {
//       console.log("Error fetching products:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const addToCart = (e, id) => {
//     e.stopPropagation();
//     setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
//   };

//   const changeQty = (e, id, delta) => {
//     e.stopPropagation();
//     setCart(prev => {
//       const next = (prev[id] || 0) + delta;
//       if (next <= 0) {
//         const { [id]: _, ...rest } = prev;
//         return rest;
//       }
//       return { ...prev, [id]: next };
//     });
//   };

//   const removeFromCart = (e, productId) => {
//     e.stopPropagation();
//     setCart(prev => {
//       const { [productId]: _, ...rest } = prev;
//       return rest;
//     });
//   };

//   return (
//     <ProductContext.Provider
//       value={{
//         addToCart,
//         changeQty,
//         removeFromCart,
//         cart,
//         setCart,
//         loading,
//         products,
//         setLoading,
//         setProducts,
//       }}
//     >
//       {children}
//     </ProductContext.Provider>
//   );
// };

// export const useProducts = () => useContext(ProductContext);

// src/context/ProductContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const ProductContext = createContext();

// ── Helper: get logged-in user's ID from JWT token ──────────────
const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return "guest";
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.id || "guest";
  } catch {
    return "guest";
  }
};

// ── Helper: get cart key for current user ───────────────────────
const getCartKey = () => `cart_${getUserId()}`;

// ── Helper: load cart from localStorage for current user ────────
const loadCart = () => {
  try {
    const saved = localStorage.getItem(getCartKey());
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

// ── Helper: get favourites key for current user ─────────────────
const getFavouritesKey = () => `favourites_${getUserId()}`;

// ── Helper: load favourites from localStorage for current user ──
const loadFavourites = () => {
  try {
    const saved = localStorage.getItem(getFavouritesKey());
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export const ProductProvider = ({ children }) => {
  const [cart, setCartState] = useState(() => loadCart());
  const [favourites, setFavourites] = useState(() => loadFavourites());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Save cart to localStorage under current user's key ─────────
  // Wrap setCart so every update auto-saves to the right key
  const setCart = (updater) => {
    setCartState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem(getCartKey(), JSON.stringify(next));
      return next;
    });
  };

  // ── When login/logout happens, reload cart for the new user ────
  // ProfilePopup and login already fire window.dispatchEvent(new Event("storage"))
  // so this listener will automatically swap the cart on login/logout
  useEffect(() => {
    const handleAuthChange = () => {
      const freshCart = loadCart();
      setCartState(freshCart);
      setFavourites(loadFavourites());
    };

    window.addEventListener("storage", handleAuthChange);
    return () => window.removeEventListener("storage", handleAuthChange);
  }, []);

  // ── Fetch products ──────────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://sequence-website-backend.vercel.app/api/products",
        {
          headers: {
            Authorization: `Bearer seq$123`,
          },
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.log("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ── Cart actions ────────────────────────────────────────────────
  const addToCart = (e, id) => {
    e.stopPropagation();
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const changeQty = (e, id, delta) => {
    e.stopPropagation();
    setCart((prev) => {
      const next = (prev[id] || 0) + delta;
      if (next <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const removeFromCart = (e, productId) => {
    e.stopPropagation();
    setCart((prev) => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  };

  // ── Favourites action ───────────────────────────────────────────
  const toggleFavourite = (e, id) => {
    e.stopPropagation();
    setFavourites((prev) => {
      const { [id]: saved, ...rest } = prev;
      const next = saved ? rest : { ...prev, [id]: true };
      localStorage.setItem(getFavouritesKey(), JSON.stringify(next));
      return next;
    });
  };

  return (
    <ProductContext.Provider
      value={{
        addToCart,
        changeQty,
        removeFromCart,
        cart,
        setCart,
        favourites,
        toggleFavourite,
        loading,
        products,
        setLoading,
        setProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);