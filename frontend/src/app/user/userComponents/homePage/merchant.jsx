const MerchantiseShop = () => {
    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-5">Artist Merchandise</h2>
            <div className="row g-4">
                <div className="col-md-4">
                    <div className="merch-card card glow-on-hover">
                        <img src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" className="card-img-top" alt="Merch" />
                            <div className="card-body">
                                <h5 className="card-title">Tour T-Shirt</h5>
                                <p className="merch-price">$29.99</p>
                                <a href="#" className="btn btn-sm btn-primary ripple">Add to Cart</a>
                            </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="merch-card card glow-on-hover">
                        <img src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" className="card-img-top" alt="Merch" />
                            <div className="card-body">
                                <h5 className="card-title">Vinyl Record</h5>
                                <p className="merch-price">$24.99</p>
                                <a href="#" className="btn btn-sm btn-primary ripple">Add to Cart</a>
                            </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="merch-card card glow-on-hover">
                        <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2030&q=80" className="card-img-top" alt="Merch" />
                            <div className="card-body">
                                <h5 className="card-title">Signed Poster</h5>
                                <p className="merch-price">$49.99</p>
                                <a href="#" className="btn btn-sm btn-primary ripple">Add to Cart</a>
                            </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default MerchantiseShop