import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  product as initialProducts,
  newLaunchProducts as initialNewLaunches,
  category as initialCategories,
  CategoryIcon as initialCategoryIcons,
  inspirationCategory as initialInspiration,
  trendingCollections as initialTrending,
  exploreThemes as initialThemes,
  callNumber as initialCallNumber,
  WhatsappNumber as initialWhatsappNumber,
  Message as initialMessage,
} from '../assets/assets.js';

const DataContext = createContext(null);

const KEYS = {
  products: 'admin_products',
  newLaunches: 'admin_newLaunches',
  categories: 'admin_categories',
  categoryIcons: 'admin_categoryIcons',
  inspiration: 'admin_inspiration',
  trending: 'admin_trending',
  themes: 'admin_themes',
  settings: 'admin_settings',
};

function seed(key, fallback) {
  const existing = localStorage.getItem(key);
  if (!existing) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(existing);
  } catch {
    return fallback;
  }
}

export function DataProvider({ children }) {
  const [products, setProductsState] = useState(() => seed(KEYS.products, initialProducts));
  const [newLaunches, setNewLaunchesState] = useState(() => seed(KEYS.newLaunches, initialNewLaunches));
  const [categories, setCategoriesState] = useState(() => seed(KEYS.categories, initialCategories));
  const [categoryIcons, setCategoryIconsState] = useState(() => seed(KEYS.categoryIcons, initialCategoryIcons[0] || {}));
  const [inspiration, setInspirationState] = useState(() => seed(KEYS.inspiration, initialInspiration));
  const [trending, setTrendingState] = useState(() => seed(KEYS.trending, initialTrending));
  const [themes, setThemesState] = useState(() => seed(KEYS.themes, initialThemes));
  const [settings, setSettingsState] = useState(() =>
    seed(KEYS.settings, {
      callNumber: initialCallNumber,
      WhatsappNumber: initialWhatsappNumber,
      Message: initialMessage,
    })
  );

  const persist = (key, setter) => (data) => {
    setter(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  const setProducts = persist(KEYS.products, setProductsState);
  const setNewLaunches = persist(KEYS.newLaunches, setNewLaunchesState);
  const setCategories = persist(KEYS.categories, setCategoriesState);
  const setCategoryIcons = persist(KEYS.categoryIcons, setCategoryIconsState);
  const setInspiration = persist(KEYS.inspiration, setInspirationState);
  const setTrending = persist(KEYS.trending, setTrendingState);
  const setThemes = persist(KEYS.themes, setThemesState);
  const setSettings = persist(KEYS.settings, setSettingsState);

  // Helpers
  const addProduct = (p) => setProducts([...products, p]);
  const updateProduct = (idx, p) => setProducts(products.map((x, i) => i === idx ? p : x));
  const deleteProduct = (idx) => setProducts(products.filter((_, i) => i !== idx));

  const addNewLaunch = (p) => setNewLaunches([...newLaunches, p]);
  const updateNewLaunch = (idx, p) => setNewLaunches(newLaunches.map((x, i) => i === idx ? p : x));
  const deleteNewLaunch = (idx) => setNewLaunches(newLaunches.filter((_, i) => i !== idx));

  const addCategory = (c) => setCategories([...categories, c]);
  const updateCategory = (idx, c) => setCategories(categories.map((x, i) => i === idx ? c : x));
  const deleteCategory = (idx) => setCategories(categories.filter((_, i) => i !== idx));

  const updateCategoryIcons = (icons) => setCategoryIcons(icons);

  const addInspiration = (item) => setInspiration([...inspiration, item]);
  const updateInspiration = (idx, item) => setInspiration(inspiration.map((x, i) => i === idx ? item : x));
  const deleteInspiration = (idx) => setInspiration(inspiration.filter((_, i) => i !== idx));

  const addTrending = (item) => setTrending([...trending, item]);
  const updateTrending = (idx, item) => setTrending(trending.map((x, i) => i === idx ? item : x));
  const deleteTrending = (idx) => setTrending(trending.filter((_, i) => i !== idx));

  const addTheme = (item) => setThemes([...themes, item]);
  const updateTheme = (idx, item) => setThemes(themes.map((x, i) => i === idx ? item : x));
  const deleteTheme = (idx) => setThemes(themes.filter((_, i) => i !== idx));

  const updateSettings = (s) => setSettings(s);

  return (
    <DataContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      newLaunches, addNewLaunch, updateNewLaunch, deleteNewLaunch,
      categories, addCategory, updateCategory, deleteCategory,
      categoryIcons, updateCategoryIcons,
      inspiration, addInspiration, updateInspiration, deleteInspiration,
      trending, addTrending, updateTrending, deleteTrending,
      themes, addTheme, updateTheme, deleteTheme,
      settings, updateSettings,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
