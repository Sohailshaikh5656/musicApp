"use client"
const Footer = () => {
    return (
        <>
            <footer className="bg-dark text-light pt-5 pb-3">
                <div className="container mt-5"> {/* Increased margin top */}
                    <div className="row">
                        <div className="col-lg-4 mb-4">
                            <h4 className="fw-bold text-primary">
                                <i className="fas fa-music me-2"></i>VibeStream
                            </h4>
                            <p className="mt-3 text-light-emphasis">
                                The ultimate music streaming platform for discovering new artists and enjoying your favorite tracks.
                            </p>
                            <div className="social-icons mt-4">
                                <a href="#" className="text-light me-3 fs-5 opacity-75 hover-opacity-100">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="text-light me-3 fs-5 opacity-75 hover-opacity-100">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="text-light me-3 fs-5 opacity-75 hover-opacity-100">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#" className="text-light me-3 fs-5 opacity-75 hover-opacity-100">
                                    <i className="fab fa-spotify"></i>
                                </a>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-2 mb-4">
                            <h5 className="text-light mb-3">Company</h5>
                            <div className="footer-links d-flex flex-column">
                                <a href="#" className="text-light-emphasis mb-2 text-decoration-none hover-text-light">About Us</a>
                                <a href="#" className="text-light-emphasis mb-2 text-decoration-none hover-text-light">Careers</a>
                                <a href="#" className="text-light-emphasis mb-2 text-decoration-none hover-text-light">Press</a>
                                <a href="#" className="text-light-emphasis mb-2 text-decoration-none hover-text-light">Blog</a>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-2 mb-4">
                            <h5 className="text-light mb-3">Support</h5>
                            <div className="footer-links d-flex flex-column">
                                <a href="#" className="text-light-emphasis mb-2 text-decoration-none hover-text-light">Contact Us</a>
                                <a href="#" className="text-light-emphasis mb-2 text-decoration-none hover-text-light">Help Center</a>
                                <a href="#" className="text-light-emphasis mb-2 text-decoration-none hover-text-light">Community</a>
                                <a href="#" className="text-light-emphasis mb-2 text-decoration-none hover-text-light">System Status</a>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 mb-4">
                            <h5 className="text-light mb-3">Subscribe to Our Newsletter</h5>
                            <p className="text-light-emphasis">
                                Get the latest updates and music recommendations.
                            </p>
                            <form className="mt-3">
                                <div className="input-group">
                                    <input 
                                        type="email" 
                                        className="form-control bg-dark text-light border-secondary" 
                                        placeholder="Your email address" 
                                        required 
                                    />
                                    <button className="btn btn-primary" type="submit">
                                        Subscribe
                                    </button>
                                </div>
                                <small className="text-light-emphasis mt-2 d-block">
                                    By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                                </small>
                            </form>
                        </div>
                    </div>
                    <hr className="my-4 border-secondary" />
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <p className="small text-light-emphasis mb-0">© 2025 VibeStream. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <a href="#" className="text-light-emphasis small me-3 text-decoration-none hover-text-light">Privacy Policy</a>
                            <a href="#" className="text-light-emphasis small me-3 text-decoration-none hover-text-light">Terms of Service</a>
                            <a href="#" className="text-light-emphasis small text-decoration-none hover-text-light">Cookies</a>
                        </div>
                    </div>
                </div>
                
                <style jsx>{`
                    .hover-opacity-100:hover {
                        opacity: 1 !important;
                        transition: opacity 0.2s ease;
                    }
                    .hover-text-light:hover {
                        color: #fff !important;
                        transition: color 0.2s ease;
                    }
                    .form-control:focus {
                        background-color: #1a1a1a;
                        border-color: #6c757d;
                        color: #fff;
                        box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25);
                    }
                `}</style>
            </footer>
        </>
    )
}

export default Footer
