const Testimonial = () => {
    return (
        <section className="testimonial-section">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">What Our Listeners Say</h2>
          <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <blockquote className="blockquote">
                  <p className="mb-4">"VibeStream has completely changed how I discover music. The personalized recommendations are spot on!"</p>
                  <footer className="blockquote-footer text-white">Sarah Johnson, Music Blogger</footer>
                </blockquote>
              </div>
              <div className="carousel-item">
                <blockquote className="blockquote">
                  <p className="mb-4">"As a DJ, I rely on VibeStream to find the latest tracks and underground gems. It's my go-to platform."</p>
                  <footer className="blockquote-footer text-white">Mark Williams, Professional DJ</footer>
                </blockquote>
              </div>
              <div className="carousel-item">
                <blockquote className="blockquote">
                  <p className="mb-4">"The sound quality is exceptional, and I love how easy it is to create and share playlists with friends."</p>
                  <footer className="blockquote-footer text-white">Emily Chen, Music Enthusiast</footer>
                </blockquote>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </section>
    )
}

export default Testimonial