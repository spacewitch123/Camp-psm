import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <div className="Footer">
            <div className="footer-content">
                <div className="copyright">
                    &copy; {new Date().getFullYear()} UTM. All rights reserved.
                </div>
                <div className="links">
                    <a href="/about">About Us</a>
                    <a href="/contact">Contact Us</a>
                </div>
            </div>
        </div>
    );
}

export default Footer;
