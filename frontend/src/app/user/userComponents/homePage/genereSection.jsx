const GenereSection = () => {
    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-5">Explore By Genre</h2>
            <div className="row g-3">
                <div className="col-6 col-md-3">
                    <div className="genre-card" style={{background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') center/cover"}}>
                        <div className="text-center">
                            <i className="fas fa-guitar genre-icon"></i>
                            <div>Rock</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="genre-card" style={{background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') center/cover"}}>
                        <div className="text-center">
                            <i className="fas fa-headphones genre-icon"></i>
                            <div>Pop</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="genre-card" style={{background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') center/cover"}}>
                        <div className="text-center">
                            <i className="fas fa-hip-hop genre-icon"></i>
                            <div>Hip Hop</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="genre-card" style={{background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2013&q=80') center/cover"}}>
                        <div className="text-center">
                            <i className="fas fa-music genre-icon"></i>
                            <div>Classical</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default GenereSection