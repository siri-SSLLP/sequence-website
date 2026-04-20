import { Routes, Route, Navigate } from 'react-router-dom'
import { DataProvider } from './Context/DataContext.jsx'
import ProtectedRoute from './Components/ProtectedRoute.jsx'
import LoginPage from './Components/LoginPage.jsx'
import Dashboard from './Components/Dashboard.jsx'
import ProductsManager from './Components/ProductsManager.jsx'
import NewLaunchManager from './Components/NewLaunchManager.jsx'
import CategoryManager from './Components/CategoryManager.jsx'
import CategoryIconManager from './Components/CategoryIconManager.jsx'
import InspirationManager from './Components/InspirationManager.jsx'
import TrendingManager from './Components/TrendingManager.jsx'
import ThemesManager from './Components/ThemesManager.jsx'
import SettingsManager from './Components/SettingsManager.jsx'

function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute><ProductsManager /></ProtectedRoute>
        } />
        <Route path="/new-launches" element={
          <ProtectedRoute><NewLaunchManager /></ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute><CategoryManager /></ProtectedRoute>
        } />
        <Route path="/category-icons" element={
          <ProtectedRoute><CategoryIconManager /></ProtectedRoute>
        } />
        <Route path="/inspiration" element={
          <ProtectedRoute><InspirationManager /></ProtectedRoute>
        } />
        <Route path="/trending" element={
          <ProtectedRoute><TrendingManager /></ProtectedRoute>
        } />
        <Route path="/themes" element={
          <ProtectedRoute><ThemesManager /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><SettingsManager /></ProtectedRoute>
        } />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DataProvider>
  )
}

export default App
