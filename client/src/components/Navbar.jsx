import { Link } from "react-router-dom";
const Navbar = () => {
    return ( 
        <nav>
            <h2>Dispaly content</h2>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
        </nav>
     );
}
 
export default Navbar;