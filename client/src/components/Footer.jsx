import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-about">
          <h2>MyWebsite</h2>
          <p>
            Simple, responsive, and user-friendly.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 MyWebsite. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;