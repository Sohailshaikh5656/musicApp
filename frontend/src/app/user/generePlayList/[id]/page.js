"use client"
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGenereSongs } from "@/store/slice/userSlicer";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "next/navigation";
import Layout from "../../common/layout";
import { Audio } from "react-loader-spinner";
import Link from "next/link";
import { FaEye, FaHeart, FaRegComment, FaShareAlt } from "react-icons/fa";
import { useRouter } from "next/router";

export default function GenerePlay() {
    const params = useParams()
    const id = params.id
    const dispatch = useDispatch()
    const { data: session, status: authStatus } = useSession()

    const { genereSongs, status: storyStatus, error } = useSelector(
        (state) => state.userAllSlicer
    );

    const [genere, setGenere] = useState(null)
    const [loading, setLoading] = useState(true)
    const [songs, setSongs] = useState([])
    const [oldSongs, setOldSongs] = useState([])
    const [playList, setPlayList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const songsPerPage = 10
    const timeOutRef = useRef(null)

    // Fetch API
    useEffect(() => {
        if (authStatus === "authenticated" && !genere) {
            dispatch(fetchGenereSongs({ token: session.user.jwtToken, id: id }));
        }
    }, [authStatus, genere, session, dispatch]);

    // Handle slice status
    useEffect(() => {
        if (storyStatus === "succeeded") {
            setGenere(genereSongs?.genere);
            setSongs(genereSongs?.getSongs || []);
            setOldSongs(genereSongs?.getSongs || []);
            setPlayList(genereSongs?.getFeaturePlayList || []);
            setLoading(false);
        }
    }, [storyStatus, genereSongs]);

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
                setSongs(oldSongs);
            } else {
                const filteredData = oldSongs.filter(item =>
                    (item.title.toLowerCase().includes(searchValue)) ||
                    (item.album_name.toLowerCase().includes(searchValue)) ||
                    (item.lyrics.toLowerCase().includes(searchValue))
                );
                setSongs(filteredData);
            }
        }, 500);
    };

    // Pagination logic
    const indexOfLastSong = currentPage * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);
    const totalPages = Math.ceil(songs.length / songsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Layout>
            {genere && <div className="container mt-4 mb-5">
                {/* Genre Info */}
                <div className="row mb-4 align-items-center p-4 rounded-4 shadow-sm"
                    style={{
                        background: "linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)",
                        border: "1px solid #e3f2fd"
                    }}>

                    {/* Genre Image */}
                    <div className="col-md-3 text-center">
                        <img
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${genere.image}`}
                            alt={genere.name}
                            className="img-fluid rounded-4 shadow"
                            style={{
                                maxHeight: "180px",
                                objectFit: "cover",
                                width: "100%"
                            }}
                        />
                    </div>

                    {/* Genre Details */}
                    <div className="col-md-9">
                        <h2 className="fw-bold text-primary mb-3">{genere.name}</h2>

                        <div className="d-flex flex-column gap-3">
                            <div className="d-flex align-items-center">
                                <span className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                                    <i className="fas fa-calendar-plus text-primary fs-4"></i>
                                </span>
                                <div>
                                    <p className="mb-0 fw-medium">Created Date</p>
                                    <p className="text-muted mb-0">{new Date(genere.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <span className="bg-info bg-opacity-10 p-3 rounded-3 me-3">
                                    <i className="fas fa-calendar-check text-info fs-4"></i>
                                </span>
                                <div>
                                    <p className="mb-0 fw-medium">Last Updated</p>
                                    <p className="text-muted mb-0">{new Date(genere.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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

                {/* Songs Listing */}
                <div className="row">
                    {currentSongs.length > 0 ? currentSongs.map((song, index) => (
                        <div key={index} className="col-md-6 col-lg-4 mb-4">
                            <div className="card shadow-lg h-100 transition-all"
                                style={{
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    transform: 'translateY(0)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 1rem 3rem rgba(0, 0, 0, 0.275)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                }}>

                                {/* Song Image */}
                                <img
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${song.cover_image}`}
                                    className="card-img-top"
                                    alt={song.title}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />

                                <div className="card-body d-flex flex-column">
                                    {/* Song Info */}
                                    <h5 className="card-title text-truncate">{song.title}</h5>
                                    <p className="card-text text-muted text-truncate">{song.album_name || "Unknown Album"}</p>

                                    {/* Stats Row */}
                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        <small className="text-muted d-flex align-items-center gap-1">
                                            <i className="fas fa-eye"></i> {song.play_count || Math.floor(Math.random() * 1000)}
                                        </small>
                                        <small className="text-muted d-flex align-items-center gap-1">
                                            <i className="far fa-comment"></i> {song.total_comments || Math.floor(Math.random() * 200)}
                                        </small>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1">
                                                <i className="fas fa-heart"></i> {song.total_likes}
                                            </button>
                                            {/* <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                                                <i className="fas fa-share-alt"></i> Share
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted fs-5">No songs found</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-center mt-4">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`btn btn-sm mx-1 ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => paginate(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                <br />
                <hr className="mb-4" />

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
                                        <small className="text-muted text-truncate">{genere?.name || "Uncategorized"}</small>
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
                            {/* <Link style={{zIndex:"6"}} className="btn btn-primary mt-2">
                                <i className="fas fa-plus me-2"></i>Create Playlist
                            </Link> */}
                        </div>
                    )}
                </div>
            </div>}
        </Layout>
    );
}
