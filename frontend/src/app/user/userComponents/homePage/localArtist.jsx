const LocalArtist = () => {
    return (
        <section className="py-5 bg-light">
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6">
                        <div className="p-4 p-md-5 bg-white rounded-4 shadow">
                            <h2 className="display-5 fw-bold text-info">Local Artists</h2>
                            <h3 className="text-muted mb-4 fst-italic">"Homegrown Talent"</h3>
                            <p className="lead mb-4">Promotes musicians from your geographic area</p>
                            <button className="btn btn-info btn-lg px-4 py-2 shadow-sm hover-effect">Discover Artists</button>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Local Artists"
                            className="img-fluid rounded-4 shadow-lg hover-zoom" />
                    </div>
                </div>
            </div>
        </section>
    )
}
export default LocalArtist