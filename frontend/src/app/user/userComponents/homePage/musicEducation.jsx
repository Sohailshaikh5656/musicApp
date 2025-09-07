const MusicEducation = () => {
    return (
        <section className="py-5 bg-light">
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6">
                        <div className="p-4 p-md-5 bg-white rounded-4 shadow">
                            <h2 className="display-5 fw-bold text-primary">Music Education</h2>
                            <h3 className="text-muted mb-4 fst-italic">"Learn Music With Us"</h3>
                            <p className="lead mb-4">Tutorials, instrument lessons, and production tips</p>
                            <button className="btn btn-primary btn-lg px-4 py-2 shadow-sm hover-effect">Start Learning</button>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <img src="https://randomuser.me/api/portraits/women/12.jpg" alt="Music Education"
                            className="img-fluid rounded-4 shadow-lg hover-zoom" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MusicEducation