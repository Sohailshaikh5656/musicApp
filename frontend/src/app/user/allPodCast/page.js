"use client"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllPodCast } from "@/store/slice/userSlicer"
import Layout from "../common/layout"
import { Audio } from "react-loader-spinner"
import Link from "next/link"


const AllPodCastList = () => {
  const { data: session, status: authStatus } = useSession()
  const [podcast, setPodcast] = useState(null)
  const [oldPodcast, setOldPodcast] = useState(null)
  const dispatch = useDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const timeOutRef = useRef(null)
  const { AllPodCast, status: podcastError, error } = useSelector(
    (state) => state.userAllSlicer
  )

  useEffect(() => {
    if (session && authStatus === "authenticated") {
      dispatch(fetchAllPodCast({jwtToken : session?.user?.jwtToken}))
    }
  }, [session, authStatus, dispatch])

  useEffect(() => {
    if(!Array.isArray(AllPodCast)){
        const Arr = []
        Arr.push(AllPodCast)
        setPodcast(Arr)
        setOldPodcast(Arr)
    }else{
        setPodcast(AllPodCast)
        setOldPodcast(AllPodCast)
    }
    setLoading(false)
  }, [podcastError, AllPodCast])

  if (loading) {
    return (
      <Layout>
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Audio />
        </div>
      </Layout>
    )
  }

  if (podcastError === "failed") {
    return (
      <Layout>
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <h3 className="text-danger">Error: {error}</h3>
        </div>
      </Layout>
    )
  }

  const handleSearch = (searchValue) => {
    searchValue = searchValue.toLowerCase()
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    timeOutRef.current = setTimeout(() => {
      if (searchValue === "") {
        setPodcast(oldPodcast)
      } else {
        const filteredData = oldPodcast.filter((item) =>
          item.title.toLowerCase().includes(searchValue) ||
          item.taken_by.toLowerCase().includes(searchValue) ||
          item.description.toLowerCase().includes(searchValue) 
        )
        setPodcast(filteredData)
      }
    }, 500)
  }

  return (
    <Layout>
      <div className="container mt-4 mb-5">
        <h2 className="mb-4 fw-bold text-center">🎤 All PodCast</h2>
        <div className="row">
            <div className="col-8 mx-auto">
                <input type="text" style={{height:"50px", minHeight:"50px", borderRadius:"70px", padding:"20px"}} className="form-control"  onChange={(e)=>handleSearch(e.target.value)} placeholder="Enter Keyword to Search ..."/>
            </div>
        </div>
        <hr />
        <div className="row mt-3">
          {podcast && podcast.length > 0 ? (
            podcast.map((item, index) => (
              <div key={index} className="col-sm-6 col-md-4 col-lg-4 mb-4">
                <div className="artist-card">
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.thumbnail}`}
                    alt={item.name}
                    className="artist-img"
                  />

                  <div className="card-body text-center mt-2">
                    <h5 className="card-title fw-bold">{item.title}</h5>
                  </div>

                  <div className="card-footer bg-white border-0 text-center pb-3 mt-3">
                    <Link className="btn btn-dark rounded-pill px-4" href={`/user/podcast/${item.id}`}>
                     View
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h5 className="text-center text-muted">No Podcast Found!</h5>
          )}
        </div>
      </div>

      {/* 👇 CSS same file me likha */}
      <style jsx>{`
        .artist-card {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .artist-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .artist-img {
          width: 100%;
          height: 250px;
          object-fit: cover;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default AllPodCastList
