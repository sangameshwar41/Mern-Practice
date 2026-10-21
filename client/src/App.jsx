import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from "./pages/Home.jsx"
import Services from "./pages/Services.jsx"
import Aboutus from "./pages/About-Us.jsx"
import Contactus from "./pages/Contact-Us.jsx"
import PrivacyPolicies from "./pages/Privacy-Policies.jsx"
import PageNotFound from "./pages/404Error.jsx"


function App() {
    return (
        <BrowserRouter>
        <Navbar/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<Aboutus />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contactus />} />
              <Route path="/privacy-policy" element={<PrivacyPolicies />} />
              <Route path="*" element={<PageNotFound/>} />
            </Routes>
          <Footer/>
        </BrowserRouter>
    );
}

export default App;