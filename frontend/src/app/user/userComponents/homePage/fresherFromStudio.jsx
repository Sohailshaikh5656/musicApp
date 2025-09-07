const FresherFromStudio = () => {
    return (
        <section className="container py-5 ">
            <h2 className="fw-bold mb-5">Fresh From The Studio</h2>
            <div className="row g-4">
                <div className="col-md-4">
                    <div className="card glow-on-hover">
                        <div className="position-relative">
                            <img src="https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80" className="card-img-top" alt="New Album" />
                                <span className="new-release-badge">NEW</span>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Midnight Dreams</h5>
                            <p className="text-muted">Taylor Swift</p>
                            <p className="release-date">Released: June 15, 2023</p>
                            <a href="#" className="btn btn-sm btn-primary mt-2 ripple">Listen Now</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card glow-on-hover">
                        <div className="position-relative">
                            <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" className="card-img-top" alt="New Single" />
                                <span className="new-release-badge">SINGLE</span>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Electric Love</h5>
                            <p className="text-muted">BTS</p>
                            <p className="release-date">Released: June 10, 2023</p>
                            <a href="#" className="btn btn-sm btn-primary mt-2 ripple">Listen Now</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card glow-on-hover">
                        <div className="position-relative">
                            <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" className="card-img-top" alt="New EP" />
                                <span className="new-release-badge">EP</span>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Summer Nights</h5>
                            <p className="text-muted">Dua Lipa</p>
                            <p className="release-date">Released: June 5, 2023</p>
                            <a href="#" className="btn btn-sm btn-primary mt-2 ripple">Listen Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FresherFromStudio