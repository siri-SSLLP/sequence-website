
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ProductProvider } from './Context/Context.jsx'

createRoot(document.getElementById('root')).render(

<ProductProvider>
    <BrowserRouter><App /></BrowserRouter>

</ProductProvider>


)
