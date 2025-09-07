"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { getAllFeaturedPlayList } from "@/app/utils/apiHandler"
const FeaturedPlayList = () => {
    const [featuredList, setfeaturedList] = useState([])
    const {data:session} = useSession()
    const fetchList = async () => {
        const res = await getAllFeaturedPlayList({ jwtToken: session?.user?.jwtToken })
        if (res.code == 1) {
            setfeaturedList(res.data)
        }
    }
    useEffect(() => {
        if (session?.user?.jwtToken && (!featuredList || featuredList.length == 0)) {
            fetchList()
        }
    }, [session?.user?.jwtToken])

    return (
        featuredList && featuredList?.length > 0 &&
        <section className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="fw-bold">Featured Playlists</h2>
                <a href="#" className="btn btn-outline-primary">View All</a>
            </div>
            <div className="row g-4">
                {featuredList.map((item,index) => (
                    <div key={index} className="col-md-4">
                        <div className="card">
                            <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`} className="card-img-top" alt="Summer Vibes" />
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h5 className="card-title">{item.name}</h5>
                                        <p className="text-muted">{item?.songs} songs • 8h 42m</p>
                                    </div>
                                    <span className="genre-badge">{item?.category_name?item.category_name.toUpperCase():"POP"}</span>
                                </div>
                                <p className="card-text mt-3">The hottest tracks for your summer adventures. {item.description?.substring(0, 100)}{item.description?.length > 100 ? "..." : ""}</p>
                                <a href="#" className="btn btn-sm btn-primary mt-2">Play Now</a>
                            </div>
                        </div>
                    </div>
                ))
                }
                <div className="col-md-4">
                    <div className="card">
                        <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" className="card-img-top" alt="Focus Flow" />
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 className="card-title">Focus Flow</h5>
                                    <p className="text-muted">85 songs • 6h 15m</p>
                                </div>
                                <span className="genre-badge">Instrumental</span>
                            </div>
                            <p className="card-text mt-3">Concentration boosting tracks for deep work.</p>
                            <a href="#" className="btn btn-sm btn-primary mt-2">Play Now</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" className="card-img-top" alt="Throwback Hits" />
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 className="card-title">Throwback Hits</h5>
                                    <p className="text-muted">150 songs • 10h 22m</p>
                                </div>
                                <span className="genre-badge">classNameics</span>
                            </div>
                            <p className="card-text mt-3">Relive the greatest hits from past decades.</p>
                            <a href="#" className="btn btn-sm btn-primary mt-2">Play Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default FeaturedPlayList