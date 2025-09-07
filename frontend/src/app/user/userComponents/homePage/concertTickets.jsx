const ConcertTickets = () => {
    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-5">Upcoming Live Events</h2>
            <div className="row g-4">
                <div className="col-md-6 col-lg-3">
                    <div className="event-card card glow-on-hover">
                        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" className="card-img-top" alt="Event" />
                            <div className="card-body">
                                <span className="event-date">Jun 25, 2023</span>
                                <h5 className="card-title mt-2">Coldplay World Tour</h5>
                                <p className="event-location">Madison Square Garden, NY</p>
                                <a href="#" className="btn btn-sm btn-primary ripple">Get Tickets</a>
                            </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                    <div className="event-card card glow-on-hover">
                        <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" className="card-img-top" alt="Event" />
                            <div className="card-body">
                                <span className="event-date">Jul 12, 2023</span>
                                <h5 className="card-title mt-2">EDM Festival</h5>
                                <p className="event-location">Las Vegas Speedway, NV</p>
                                <a href="#" className="btn btn-sm btn-primary ripple">Get Tickets</a>
                            </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                    <div className="event-card card glow-on-hover">
                        <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" className="card-img-top" alt="Event" />
                            <div className="card-body">
                                <span className="event-date">Aug 5, 2023</span>
                                <h5 className="card-title mt-2">Jazz Night</h5>
                                <p className="event-location">Chicago Theater, IL</p>
                                <a href="#" className="btn btn-sm btn-primary ripple">Get Tickets</a>
                            </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                    <div className="event-card card glow-on-hover">
                        <img src="https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2013&q=80" className="card-img-top" alt="Event" />
                            <div className="card-body">
                                <span className="event-date">Sep 18, 2023</span>
                                <h5 className="card-title mt-2">Country Live</h5>
                                <p className="event-location">Grand Ole Opry, TN</p>
                                <a href="#" className="btn btn-sm btn-primary ripple">Get Tickets</a>
                            </div>
                    </div>
                </div>
            </div>
        </section>

    )
}
export default ConcertTickets