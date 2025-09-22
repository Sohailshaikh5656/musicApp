import Link from "next/link"
const BehindTheMusic = ({ data }) => {
    return (
        data ? <>
            <section className="container py-5">
                <h2 className="fw-bold mb-5">Song Stories</h2>
                <div className="row">
                    {data.map((item, index) => (
                        <div className="col-lg-6 mb-4" key={index}>
                            <div className="song-story glow-on-hover">
                                <h4 className="song-story-title">"{item.title}" - {item.star_name}</h4>
                                <p>
                                    {item.description.slice(0, 64)}
                                    {item.description.length > 64 ? " ..." : ""}
                                </p>
                                <Link href={`user/singleStory/${item.id}`} className="btn btn-sm btn-outline-primary ripple">
                                    Read Full Story
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </> : <></>
    )
}

export default BehindTheMusic