import './App.css'
import NavBar from './Components/NavBar/NavBar'
import Footer from './Components/Footer/Footer'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import { Routes, Route, Navigate } from 'react-router-dom'
import ContactUsPage from './pages/ContactUsPage'
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop.jsx"
import ProductPage from "./pages/ProductPage.jsx"
import ProductDescription from './Components/ProductDescription/ProductDescription.jsx'
import MaintenanceGuidePage from './pages/MaintenanceGuidePage.jsx'
import WhatsAppButton from './Components/WhatsAppButton/WhatsAppButton.jsx'
import ScrollToTopButton from './Components/ScrollToTopButton/ScrollToTopButton.jsx'
import Cart from './Components/Cart/Cart.jsx'
import Checkout from './Components/Checkout/Checkout.jsx'
import Career from './Components/Career/Career.jsx'
import PrivacyPolicy from './Components/Privacypolicy/Privacypolicy.jsx'
import CancellationPolicy from './Components/Cancellationpolicy/Cancellationpolicy.jsx'
import { BlogListing, BlogPost } from './Components/Blog/Blog.jsx'
import Favourites from './Components/Favourites/Favourites.jsx'

function App() {
  return (
    <>
      <NavBar />
      <ScrollToTop />
      <WhatsAppButton />
      <ScrollToTopButton />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/contact-us' element={<ContactUsPage />} />
        <Route path='/products' element={<ProductPage />} />
        <Route path='/product/:id' element={<ProductDescription />} />
        <Route path='/maintenance-guide' element={<MaintenanceGuidePage />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/favourites' element={<Favourites />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/career' element={<Career />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/cancellation-policy' element={<CancellationPolicy />} />
        <Route path='/blog' element={<BlogListing />} />
        <Route path='/blog/:slug' element={<BlogPost />} />
        <Route path='*' element={<Navigate to='/' replace />} />
        <Route></Route>
        <Route></Route>
        <Route></Route>
        <Route></Route>
        <Route></Route>
        <Route></Route>
        <Route></Route>
        <Route></Route>
        <Route></Route>
        <Route></Route>
      </Routes>
      <Footer />
    </>
  )
}
export default App