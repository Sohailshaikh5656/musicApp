const BehindTheMusic = () => {
    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-5">Song Stories</h2>
            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="song-story glow-on-hover">
                        <h4 className="song-story-title">"Bohemian Rhapsody" - Queen</h4>
                        <p>Freddie Mercury wrote the song over years, using a piano and pieces of paper. The band recorded it in three weeks with producer Roy Thomas Baker. The operatic section alone took 70-80 hours to complete.</p>
                        <a href="#" className="btn btn-sm btn-outline-primary ripple">Read Full Story</a>
                    </div>
                </div>
                <div className="col-lg-6 mb-4">
                    <div className="song-story glow-on-hover">
                        <h4 className="song-story-title">"Imagine" - John Lennon</h4>
                        <p>Written in one morning at his home studio, the song's simple piano part was recorded in one take. The lyrics were inspired by Yoko Ono's poetry and Lennon's desire for world peace during the Vietnam War era.</p>
                        <a href="#" className="btn btn-sm btn-outline-primary ripple">Read Full Story</a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BehindTheMusic