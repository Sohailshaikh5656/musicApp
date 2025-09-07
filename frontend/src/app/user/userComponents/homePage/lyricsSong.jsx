const LyricsSong = () => {
    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-5">Sing Along With Lyrics</h2>
            <div className="row">
                <div className="col-md-5 mb-4 mb-md-0">
                    <div className="card">
                        <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" className="card-img-top" alt="Song" />
                            <div className="card-body">
                                <h5 className="card-title">Blinding Lights</h5>
                                <p className="text-muted">The Weeknd</p>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div className="progress w-100 me-3">
                                        <div className="progress-bar bg-primary" style={{width: "45%"}}></div>
                                    </div>
                                    <span>2:35 / 3:20</span>
                                </div>
                            </div>
                    </div>
                </div>
                <div className="col-md-7">
                    <div className="lyrics-container">
                        <div className="lyrics-line">I been tryna call</div>
                        <div className="lyrics-line">I been on my own for long enough</div>
                        <div className="lyrics-line">Maybe you can show me how to love, maybe</div>
                        <div className="lyrics-line active">I'm going through withdrawals</div>
                        <div className="lyrics-line">You don't even have to do too much</div>
                        <div className="lyrics-line">You can turn me on with just a touch, baby</div>
                        <div className="lyrics-line">I look around and</div>
                        <div className="lyrics-line">Sin City's cold and empty (Oh)</div>
                        <div className="lyrics-line">No one's around to judge me (Oh)</div>
                        <div className="lyrics-line">I can't see clearly when you're gone</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default LyricsSong