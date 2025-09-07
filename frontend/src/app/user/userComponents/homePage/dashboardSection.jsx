const DashBoardSection = () => {
    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-5">Your Listening History</h2>
            <div className="row g-4">
                <div className="col-md-4">
                    <div className="stats-card glow-on-hover">
                        <div className="stats-number">1,247</div>
                        <div className="stats-label">Minutes Listened</div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="stats-card glow-on-hover">
                        <div className="stats-number">87</div>
                        <div className="stats-label">Different Artists</div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="stats-card glow-on-hover">
                        <div className="stats-number">24</div>
                        <div className="stats-label">New Genres Explored</div>
                    </div>
                </div>
            </div>
            <div className="text-center mt-4">
                <a href="#" className="btn btn-outline-primary ripple">View Full Statistics</a>
            </div>
        </section>
    )
}
export default DashBoardSection