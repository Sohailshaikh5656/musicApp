const MoodBased = () => {
    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-5">Playlists For Every Mood</h2>
            <div className="row g-4">
                <div className="col-6 col-md-3">
                    <div className="mood-card" style={{background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') center/cover"}}>
                        <h5 className="mood-label">Chill</h5>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="mood-card" style={{background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') center/cover"}}>
                        <h5 className="mood-label">Energetic</h5>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="mood-card" style={{background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3), url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') center/cover"}}>
                        <h5 className="mood-label">Focus</h5>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="mood-card" style={{background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2013&q=80') center/cover"}}>
                        <h5 className="mood-label">Romantic</h5>
                    </div>
                </div>
            </div>
        </section>
    )
}
export  default MoodBased