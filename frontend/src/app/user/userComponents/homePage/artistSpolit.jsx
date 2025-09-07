const ArtistSpolit = () => {
    return (
        <section className="container py-5">
            <div className="artist-spotlight p-4 p-md-5">
                <div className="row align-items-center">
                    <div className="col-md-4 mb-4 mb-md-0">
                        <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" className="img-fluid rounded-circle glow-on-hover" alt="Artist" />
                    </div>
                    <div className="col-md-8">
                        <h2 className="fw-bold mb-3">Featured Artist of the Month</h2>
                        <h3 className="mb-4">The Weeknd</h3>
                        <p className="artist-bio mb-4">Abel Makkonen Tesfaye, known professionally as the Weeknd, is a Canadian singer, songwriter, and record producer. Known for his sonic versatility and dark lyricism, his music explores escapism, romance, and melancholia.</p>
                        <h5 className="mb-3">Top Tracks</h5>
                        <div className="top-track">
                            <div className="track-number">1</div>
                            <div className="track-info">
                                <div>Blinding Lights</div>
                                <small className="text-muted">3.2M streams</small>
                            </div>
                        </div>
                        <div className="top-track">
                            <div className="track-number">2</div>
                            <div className="track-info">
                                <div>Save Your Tears</div>
                                <small className="text-muted">2.8M streams</small>
                            </div>
                        </div>
                        <div className="top-track">
                            <div className="track-number">3</div>
                            <div className="track-info">
                                <div>Starboy</div>
                                <small className="text-muted">2.1M streams</small>
                            </div>
                        </div>
                        <a href="#" className="btn btn-primary mt-4 ripple">View Full Discography</a>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default ArtistSpolit