"use client"
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturePlayList } from "@/store/slice/userSlicer";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "next/navigation";
import Layout from "../common/layout";
import { Audio } from "react-loader-spinner";
import Link from "next/link";
import { FaEye, FaHeart, FaRegComment, FaShareAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import { BiCategory } from "react-icons/bi";


export default function GenerePlay() {
    const params = useParams()
    const id = params.id
    const dispatch = useDispatch()
    const { data: session, status: authStatus } = useSession()

    const { featurePlayList, status: storyStatus, error } = useSelector(
        (state) => state.userAllSlicer
    );

    const [loading, setLoading] = useState(true)
    const [songs, setSongs] = useState([])
    const [oldPlayList, setOldPlayList] = useState(null)
    const [playList, setPlayList] = useState(null)
    const timeOutRef = useRef(null)

    // Fetch API
    useEffect(() => {
        if (authStatus === "authenticated" && !playList) {
            dispatch(fetchFeaturePlayList(session?.user?.jwtToken));
        }
    }, [authStatus, featurePlayList, session, dispatch]);

    // Handle slice status
    useEffect(() => {
        if (storyStatus === "succeeded") {
            setPlayList(featurePlayList);
            setOldPlayList(featurePlayList);
            setLoading(false);
        }
    }, [storyStatus, featurePlayList]);

    if (loading) {
        return (
            <Layout>
                <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <Audio />
                </div>
            </Layout>
        );
    }

    if (storyStatus === "failed") {
        return (
            <Layout>
                <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <h3 className="text-danger">Error: {error}</h3>
                </div>
            </Layout>
        );
    }

    // Search handler (unchanged logic)
    const handleSearch = (searchValue) => {
        searchValue = searchValue.toLowerCase()
        if (timeOutRef.current) clearTimeout(timeOutRef.current)

        timeOutRef.current = setTimeout(() => {
            if (searchValue === "") {
                setPlayList(oldPlayList);
            } else {
                const filteredData = oldPlayList.filter(item =>
                    (item.name.toLowerCase().includes(searchValue)) ||
                    (item.description.toLowerCase().includes(searchValue)) ||
                    (item?.category_name.toLowerCase().includes(searchValue))
                );
                setPlayList(filteredData);
            }
        }, 500);
    };

    return (
        <Layout>
            {playList && <div className="container mt-4 mb-5">

                {/* Search Input */}
                <div className="row mb-5 justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        <div className="input-group input-group-lg shadow-lg rounded-pill">
                            <span className="input-group-text bg-white border-0 rounded-pill-start ps-4">
                                <i className="fas fa-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-0 rounded-pill-end py-3"
                                placeholder="Search songs, artists, or albums..."
                                onChange={(e) => handleSearch(e.target.value)}
                                style={{
                                    boxShadow: "none", // Remove default Bootstrap shadow
                                    fontSize: "1.1rem"
                                }}
                            />
                            <button
                                className="btn btn-primary rounded-pill position-absolute end-0 h-100 me-2 d-none d-md-block"
                                style={{ zIndex: 10, paddingLeft: "20px", paddingRight: "20px" }}
                            >
                                Search
                            </button>
                        </div>
                        <div className="text-center mt-3">
                            <small className="text-muted">
                                Search by title, artist name, or album name
                            </small>
                        </div>
                    </div>
                </div>
                <hr />

                {/* Featured Playlists */}
                <div className="row mt-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold">Featured Playlists</h4>
                    </div>

                    {playList.length > 0 ? playList.map((pl, i) => (
                        <div key={i} className="col-md-6 col-lg-4 mb-4">
                            <div className="card shadow-sm h-100 transition-all"
                                style={{
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    transform: 'translateY(0)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 0.5rem 1.5rem rgba(0, 0, 0, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                }}>

                                {/* Playlist Image */}
                                <img
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${pl.image}`}
                                    className="card-img-top"
                                    alt={pl.name}
                                    style={{ height: "180px", objectFit: "cover" }}
                                />

                                <div className="card-body d-flex flex-column">
                                    {/* Playlist Name */}
                                    <h6 className="card-title fw-bold text-truncate">{pl.name}</h6>

                                    {/* Category Name */}
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="badge bg-primary bg-opacity-10 text-primary me-2">
                                            <i className="fas fa-tag me-1 small"></i>
                                        </span>
                                        <small className="text-muted text-truncate">{pl.category_name || "Uncategorized"}</small>
                                    </div>

                                    {/* Created Date */}
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="badge bg-info bg-opacity-10 text-info me-2">
                                            <i className="fas fa-calendar me-1 small"></i>
                                        </span>
                                        <small className="text-muted">
                                            Created: {new Date(pl.created_at).toLocaleDateString()}
                                        </small>
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="mt-auto pt-2 d-flex justify-content-between">
                                        <Link style={{zIndex:"2"}} className="btn btn-outline-primary btn-sm" href={`/user/featurePlayListSongs/${pl.id}`}>
                                            <i className="fas fa-play me-1"></i> Play
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-12 text-center py-4">
                            <i className="fas fa-music text-muted fs-1 mb-3"></i>
                            <p className="text-muted fs-5">No featured playlists available</p>
                        </div>
                    )}
                </div>
            </div>}
        </Layout>
    );
}
