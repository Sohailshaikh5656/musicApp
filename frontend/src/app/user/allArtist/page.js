"use client"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllArtist } from "@/store/slice/userSlicer"
import Layout from "../common/layout"
import { Audio } from "react-loader-spinner"
import Link from "next/link"


const AllArtist = () => {
  const { data: session, status: authStatus } = useSession()
  const [artist, setArtist] = useState(null)
  const [oldArtist, setOldArtist] = useState(null)
  const dispatch = useDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const timeOutRef = useRef(null)
  const { AllArtist, status: artistStatus, error } = useSelector(
    (state) => state.userAllSlicer
  )

  const [showModal, setShowModal] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState(null)

  useEffect(() => {
    if (session && authStatus === "authenticated") {
      dispatch(fetchAllArtist(session?.user?.jwtToken))
    }
  }, [session, authStatus, dispatch])

  useEffect(() => {
    setArtist(AllArtist)
    setOldArtist(AllArtist)
    setLoading(false)
  }, [artistStatus, AllArtist])

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

  if (artistStatus === "failed") {
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

  const openModal = (artist) => {
    setSelectedArtist(artist)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedArtist(null)
    setShowModal(false)
  }

  const handleSearch = (searchValue) => {
    searchValue = searchValue.toLowerCase()
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    timeOutRef.current = setTimeout(() => {
      if (searchValue === "") {
        setArtist(oldArtist)
      } else {
        const filteredData = oldArtist.filter((item) =>
          item.name.toLowerCase().includes(searchValue)
        )
        setArtist(filteredData)
      }
    }, 500)
  }

  return (
    <Layout>
      <div className="container mt-4 mb-5">
        <h2 className="mb-4 fw-bold text-center">🎤 All Artists</h2>
        <div className="row">
            <div className="col-8 mx-auto">
                <input type="text" style={{height:"70px", minHeight:"50px", borderRadius:"70px", padding:"20px"}} className="form-control"  onChange={(e)=>handleSearch(e.target.value)} placeholder="Enter Artist Name to Search ..."/>
            </div>
        </div>
        <hr />
        <div className="row mt-3">
          {artist && artist.length > 0 ? (
            artist.map((item, index) => (
              <div key={index} className="col-sm-6 col-md-4 col-lg-4 mb-4">
                <div className="artist-card">
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.profile_picture}`}
                    alt={item.name}
                    className="artist-img"
                  />

                  <div className="card-body text-center mt-2">
                    <h5 className="card-title fw-bold">{item.name}</h5>
                    <p className="card-text text-muted mt-2" style={{ fontSize: "14px" }}>
                      {item.bio.length > 80 ? (
                        <>
                          {item.bio.slice(0, 80)}...
                          <button
                            className="btn btn-link p-0 ms-1"
                            style={{ fontSize: "14px" }}
                            onClick={() => openModal(item)}
                          >
                            Read More
                          </button>
                        </>
                      ) : (
                        item.bio
                      )}
                    </p>
                  </div>

                  <div className="card-footer bg-white border-0 text-center pb-3 mt-3">
                    <Link className="btn btn-dark rounded-pill px-4" href={`/user/artistSongs/${item.id}`}>
                      Listen Songs
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h5 className="text-center text-muted">No Artist Found!</h5>
          )}

          {/* Modal */}
          {showModal && selectedArtist && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            >
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content rounded-4 border-0 shadow-lg">
                  <div className="modal-header">
                    <h5 className="modal-title">{selectedArtist.name}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeModal}
                    ></button>
                  </div>
                  <div className="modal-body text-center">
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${selectedArtist.profile_picture}`}
                      alt={selectedArtist.name}
                      className="img-fluid rounded-4 mb-3"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                    />
                    <p className="text-muted">{selectedArtist.bio}</p>
                  </div>
                  <div className="modal-footer justify-content-center">
                     <Link className="btn btn-dark rounded-pill px-4" href={`/user/artistSongs/${selectedArtist.id}`}>
                      Listen Songs
                    </Link>
                  </div>
                </div>
              </div>
            </div>
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

export default AllArtist
