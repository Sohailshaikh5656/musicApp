const CollabrativePlayList = () => {
    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-5">Create Together</h2>
            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="collab-playlist glow-on-hover">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>Road Trip Mix</h4>
                            <div className="d-flex">
                                <img src="https://randomuser.me/api/portraits/women/43.jpg" className="collab-avatar" alt="User" />
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" className="collab-avatar" alt="User" />
                                <img src="https://randomuser.me/api/portraits/women/22.jpg" className="collab-avatar" alt="User" />
                            </div>
                        </div>
                        <p>Our perfect playlist for summer road trips across the country.</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">12 songs • 45 min</span>
                            <button className="btn btn-sm btn-outline-primary ripple">Join</button>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 mb-4">
                    <div className="collab-playlist glow-on-hover">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>Workout Jams</h4>
                            <div className="d-flex">
                                <img src="https://randomuser.me/api/portraits/men/45.jpg" className="collab-avatar" alt="User" />
                                <img src="https://randomuser.me/api/portraits/men/67.jpg" className="collab-avatar" alt="User" />
                            </div>
                        </div>
                        <p>High energy tracks to keep you motivated during workouts.</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">18 songs • 1h 12min</span>
                            <button className="btn btn-sm btn-outline-primary ripple">Join</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default CollabrativePlayList