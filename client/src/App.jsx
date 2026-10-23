import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Aboutus from './pages/About-Us.jsx';
import Contactus from './pages/Contact-Us.jsx';
import PrivacyPolicies from './pages/Privacy-Policies.jsx';
import PageNotFound from './pages/404Error.jsx';

import StudentForm from './components/StudentForm';

function App() {
  return (
    <BrowserRouter>
    <StudentForm />
      {/* <div className="app-layout">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<Aboutus />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contactus />} />
            <Route
              path="/privacy-policy"
              element={<PrivacyPolicies />}
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>

        <Footer />
      </div> */}
    </BrowserRouter>
  );
}

export default App;