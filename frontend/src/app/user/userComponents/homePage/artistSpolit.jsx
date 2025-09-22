const ArtistSpolit = ({data}) => {
    let firstArtist = data[0]
    data = data.slice(1)
    return (
        <section className="container py-5">
            <div className="artist-spotlight p-4 p-md-5">
                <div className="row align-items-center">
                    <div className="col-md-4 mb-4 mb-md-0">
                        <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${firstArtist.profile_picture}`} className="img-fluid rounded-circle glow-on-hover" alt="Artist" />
                    </div>
                    <div className="col-md-8">
                        <h2 className="fw-bold mb-3">Featured Artist of the Month</h2>
                        <h3 className="mb-4">#1 {firstArtist?.name}</h3>
                        <p className="artist-bio mb-4">{firstArtist?.bio}</p>
                        <h5 className="mb-3">Top Tracks</h5>
                        {data && data.map((item, index) => (
                            <div className="top-track" key={index}>
                                <div className="track-number"># {index + 2}</div>
                                <div className="track-info d-flex align-items-center">
                                    <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.profile_picture}`} className="img-fluid rounded-circle me-3" alt="Artist" style={{width: '60px', height: '60px'}} />
                                    <div>
                                        <div>{item.name}</div>
                                        <small className="text-secondary">{item?.play_count} streams</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* <div className="top-track">
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
                        </div> */}
                    </div>
                </div>
            </div>
        </section>

    )
}

export default ArtistSpolit