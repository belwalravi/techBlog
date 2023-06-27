import React from 'react';
import '../../Css/Footer.css'

const Footer = () => {
    return (
        <div>
            <div className="footer">
            </div>
            <div className="copyright">
                <p className="copyright-blog">© {new Date().getFullYear()} Tech Blogs. All Rights Reserved</p>
            </div>
        </div>
    )
}

export default Footer;
