// src/context/ProductContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // ✅ Load cart from localStorage on first render
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://testingserver-73um.onrender.com/api/products",
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

  const addToCart = (e, id) => {
    e.stopPropagation();
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const changeQty = (e, id, delta) => {
    e.stopPropagation();
    setCart(prev => {
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
    setCart(prev => {
      const { [productId]: _, ...rest } = prev;
      return rest;
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