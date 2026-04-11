import './App.css'
import NavBar from './Components/NavBar/NavBar'
import Footer from './Components/Footer/Footer'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'

import { Router, Routes, Route, ScrollRestoration } from 'react-router-dom'
import ContactUsPage from './pages/ContactUsPage'
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop.jsx";
import ProductPage from "./pages/ProductPage.jsx"
import ProductDescription from './Components/ProductDescription/ProductDescription.jsx'
import MaintenanceGuidePage from './pages/MaintenanceGuidePage.jsx'
import WhatsAppButton from './Components/WhatsAppButton/WhatsAppButton.jsx'
import ScrollToTopButton from './Components/ScrollToTopButton/ScrollToTopButton.jsx'
import Testing from './Components/Testing/Testing.jsx'
import Cart from './Components/Cart/Cart.jsx'
import Checkout from './Components/Checkout/Checkout.jsx'



function App() {
  return (
    <>
      <NavBar></NavBar>


      {/* I dont know why but this { Router } tag is not working tried some methods */}
      {/* <Router> */}
      <ScrollToTop />
      <WhatsAppButton></WhatsAppButton>
      <ScrollToTopButton></ScrollToTopButton>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/home' element={<Home></Home>}></Route>
        <Route path='/about-us' element={<AboutUs></AboutUs>}></Route>
        <Route path='/contact-us' element={<ContactUsPage></ContactUsPage>}></Route>
        <Route path='/products' element={<ProductPage></ProductPage>}>
        
        </Route>
        <Route path="/product/:id" element={<ProductDescription />} />
        <Route path='/maintenance-guide' element={<MaintenanceGuidePage></MaintenanceGuidePage>}></Route>
        <Route path="/cart" element={<Cart></Cart>}></Route>
        <Route ></Route>
        <Route ></Route>
        <Route ></Route>
        <Route ></Route>
        <Route ></Route>
        <Route ></Route>
        <Route path='/checkout' element={<Checkout></Checkout>}></Route>
      </Routes>
      {/* </Router> */}

      <Footer></Footer>
    </>
  )
}

export default App
