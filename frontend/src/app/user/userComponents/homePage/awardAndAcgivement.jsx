const AwardAndAchivement = () => {
    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-5">Chart Toppers & Awards</h2>
            <div className="row g-4">
                <div className="col-md-4">
                    <div className="card text-center glow-on-hover">
                        <div className="card-body">
                            <div className="award-badge">
                                <i className="fas fa-trophy"></i>
                            </div>
                            <h5 className="card-title">Grammy Winner</h5>
                            <p className="card-text">Album of the Year 2023</p>
                            <p className="text-muted">Harry Styles - "Harry's House"</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center glow-on-hover">
                        <div className="card-body">
                            <div className="award-badge">
                                <i className="fas fa-award"></i>
                            </div>
                            <h5 className="card-title">Billboard #1</h5>
                            <p className="card-text">12 Weeks at Top Spot</p>
                            <p className="text-muted">Miley Cyrus - "Flowers"</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center glow-on-hover">
                        <div className="card-body">
                            <div className="award-badge">
                                <i className="fas fa-star"></i>
                            </div>
                            <h5 className="card-title">Diamond Certified</h5>
                            <p className="card-text">10M+ Units Sold</p>
                            <p className="text-muted">The Weeknd - "Blinding Lights"</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default AwardAndAchivement