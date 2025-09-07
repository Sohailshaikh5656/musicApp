const ReviewSection = () => {
    return (
        <section className="py-5 bg-white">
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6 order-lg-2">
                        <div className="p-4 p-md-5 bg-light rounded-4 shadow">
                            <h2 className="display-5 fw-bold text-success">Year In Review</h2>
                            <h3 className="text-muted mb-4 fst-italic">"Your Year In Music"</h3>
                            <p className="lead mb-4">Annual personalized recap (like Spotify Wrapped)</p>
                            <button className="btn btn-success btn-lg px-4 py-2 shadow-sm hover-effect">See Your Recap</button>
                        </div>
                    </div>
                    <div className="col-lg-6 order-lg-1">
                        <img src="https://randomuser.me/api/portraits/men/82.jpg" alt="Year In Review"
                            className="img-fluid rounded-4 shadow-lg hover-zoom" />
                    </div>
                </div>
            </div>
        </section>
    )
}
export default ReviewSection