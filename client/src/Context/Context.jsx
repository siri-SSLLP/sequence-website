// src/context/ProductContext.jsx
import { createContext, useContext, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [cart, setCart] = useState({});


  const addToCart = (e, id) => {
          e.stopPropagation();
          setCart(prev => ({ ...prev, [id]: 1 }));
          console.log(cart)
          console.log(Object.keys(cart).length)
      };
  
      const changeQty = (e, id, delta) => {
          e.stopPropagation();
          setCart(prev => {
              const next = (prev[id] || 0) + delta;
              if (next <= 0) { const { [id]: _, ...rest } = prev; return rest; }
              return { ...prev, [id]: next };
          });
      };





  return (
    <ProductContext.Provider value={{ addToCart, changeQty,cart,setCart }}>
      {children}
    </ProductContext.Provider>
  );
};

// custom hook (best practice)
export const useProducts = () => useContext(ProductContext);