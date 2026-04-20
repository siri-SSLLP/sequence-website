// src/context/ProductContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";


export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [cart, setCart] = useState({});


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

      // 🔥 FETCH DATA FROM BACKEND
//   const fetchProducts = async () => {
//   try {
//     const res = await axios.get(
//       "http://127.0.0.1:5002/api/products",
//       {
//         headers: {
//           Authorization: "Bearer seq$123",
//         },
//       }
//     );

//     setProducts(res.data);
//     console.log("Fetched products:", res.data);
//   } catch (err) {
//     console.log("Error fetching products:", err);
//   } finally {
//     setLoading(false);
//   }
// };



const fetchProducts = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      // "http://127.0.0.1:5002/api/products",
      "https://testingserver-73um.onrender.com/api/products",
      {
        headers: {
          // Authorization: `Bearer ${token}`,seq$123
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

      const removeFromCart = (e, productId) => {
    e.stopPropagation();
    setCart(prev => {
        const { [productId]: _, ...rest } = prev;
        return rest;
    });
};




  return (
    <ProductContext.Provider value={{ addToCart, changeQty,cart,setCart,loading ,products,setLoading, setProducts}}>
      {children}
    </ProductContext.Provider>
  );
};

// custom hook (best practice)
export const useProducts = () => useContext(ProductContext);