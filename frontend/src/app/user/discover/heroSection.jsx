export default function HeroSection() {
    // Sample carousel data (replace with your actual data)
    const carouselItems = [
        {
            id: 1,
            title: "Discover New Music",
            description: "Explore the latest tracks from emerging artists around the world",
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            id: 2,
            title: "Top Podcasts",
            description: "Listen to the most popular podcasts in every category",
            image: "https://images.unsplash.com/photo-1589903308904-d969a5ad15d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80"
        },
        {
            id: 3,
            title: "Artist Spotlights",
            description: "Get to know the stories behind your favorite musicians",
            image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        }
    ];
    return (
        <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {carouselItems.map((item, index) => (
                    <button
                        key={item.id}
                        type="button"
                        data-bs-target="#heroCarousel"
                        data-bs-slide-to={index}
                        className={index === 0 ? "active" : ""}
                        aria-current={index === 0 ? "true" : "false"}
                        aria-label={`Slide ${index + 1}`}
                    ></button>
                ))}
            </div>
            <div className="carousel-inner rounded">
                {carouselItems.map((item, index) => (
                    <div key={item.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <img
                            src={item.image}
                            className="d-block w-100 carousel-image"
                            alt={item.title}
                            style={{ height: "500px", objectFit: "cover" }}
                        />
                        <div className="carousel-caption d-none d-md-block">
                            <h2 className="display-4 fw-bold">{item.title}</h2>
                            <p className="lead">{item.description}</p>
                            <button className="btn btn-primary btn-lg mt-3 rounded-pill px-4">Explore Now</button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    )
} 