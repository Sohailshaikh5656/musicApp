"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { getAllFeaturedPlayList } from "@/app/utils/apiHandler"
import Link from "next/link"
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
                <Link href={`user/featurePlayList`} className="btn btn-outline-primary">View All</Link>
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
                                <Link style={{zIndex:"2"}}  href={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/user/featurePlayListSongs/${item?.id}`}  className="btn btn-sm btn-primary mt-2">Play Now</Link>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div>
        </section>

    )
}

export default FeaturedPlayList