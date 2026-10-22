
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        
        <h2>Website</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
