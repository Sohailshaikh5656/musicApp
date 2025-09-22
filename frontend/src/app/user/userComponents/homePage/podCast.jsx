import Link from "next/link"

const Postcast = ({data}) => {
    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-5">Discover Podcasts</h2>
            <div className="row g-4">
                {data && data.map((item, index)=>(
                    <div key={index} className="col-md-4">
                    <div className="podcast-card card glow-on-hover">
                        <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.thumbnail}`} className="card-img-top" alt="Podcast" />
                            <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="podcast-host">By {item.taken_by}</p>
                                <p className="card-text">{item.description.slice(0,70)}{item.description.length>70?" ...":""}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="podcast-duration">{Math.floor(item.duration/60)} min</span>
                                    <Link style={{zIndex:"2"}} href={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/user/podcast/${item.id}`} className="btn btn-sm btn-outline-primary ripple">Listen</Link>
                                </div>
                            </div>
                    </div>
                </div>
                ))}
                {/* <div className="col-md-4">
                    <div className="podcast-card card glow-on-hover">
                        <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" className="card-img-top" alt="Podcast" />
                            <div className="card-body">
                                <h5 className="card-title">Songwriter's Diary</h5>
                                <p className="podcast-host">By Sarah Jones</p>
                                <p className="card-text">The creative process behind hit songs from top songwriters.</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="podcast-duration">32 min</span>
                                    <button className="btn btn-sm btn-outline-primary ripple">Listen</button>
                                </div>
                            </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="podcast-card card glow-on-hover">
                        <img src="https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2013&q=80" className="card-img-top" alt="Podcast" />
                            <div className="card-body">
                                <h5 className="card-title">Vinyl Revival</h5>
                                <p className="podcast-host">By Mark Roberts</p>
                                <p className="card-text">Exploring the resurgence of vinyl records and analog sound.</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="podcast-duration">58 min</span>
                                    <button className="btn btn-sm btn-outline-primary ripple">Listen</button>
                                </div>
                            </div>
                    </div>
                </div> */}
            </div>
        </section>
    )
}
export default Postcast