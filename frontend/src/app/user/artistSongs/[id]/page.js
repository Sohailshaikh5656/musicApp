"use client"
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllArtistSongs } from "@/store/slice/userSlicer";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "next/navigation";
import Layout from "../../common/layout";
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

    const { AllArtistSongs, status: songStatus, error } = useSelector(
        (state) => state.userAllSlicer
    );

    const [loading, setLoading] = useState(true)
    const [songs, setSongs] = useState(null)
    const [oldSongs, setOldSongs] = useState(null)
    const timeOutRef = useRef(null)

    // Fetch API
    useEffect(() => {
        if (authStatus === "authenticated" && !songs) {
            dispatch(fetchAllArtistSongs({ jwtToken: session?.user?.jwtToken, id: id }));
        }
    }, [authStatus, session, dispatch]);

    // Handle slice status
    useEffect(() => {
        if (songStatus === "succeeded") {
            setSongs(AllArtistSongs);
            setOldSongs(AllArtistSongs);
            setLoading(false);
        }
    }, [songStatus, AllArtistSongs]);

    if (loading) {
        return (
            <Layout>
                <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <Audio />
                </div>
            </Layout>
        );
    }

    if (songStatus === "failed") {
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
                    (item?.title.toLowerCase().includes(searchValue)) ||
                    (item?.album_name.toLowerCase().includes(searchValue)) ||
                    (item?.lyrics.toLowerCase().includes(searchValue))
                );
                setSongs(filteredData);
            }
        }, 500);
    };

    return (
        <Layout>
            {songs && <div className="container mt-4 mb-5">

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
                        <h4 className="fw-bold">Artist Songs</h4>
                    </div>

                    {songs.length > 0 ? songs.map((song, i) => (
                        <div key={i} className="col-md-6 col-lg-4 mb-4">
                            <div
                                className="card shadow-sm h-100 transition-all"
                                style={{
                                    transition: 'transform 0.3s, boxShadow 0.3s',
                                    transform: 'translateY(0)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 0.5rem 1.5rem rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            >
                                {/* Song Cover Image */}
                                <img
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${song.cover_image}`}
                                    className="card-img-top"
                                    alt={song.title}
                                    style={{ height: "180px", objectFit: "cover" }}
                                />

                                <div className="card-body d-flex flex-column">
                                    {/* Song Title */}
                                    <h6 className="card-title fw-bold text-truncate">{song.title}</h6>

                                    {/* Artist */}
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="badge bg-success bg-opacity-10 text-success me-2">
                                            <i className="fas fa-user me-1 small"></i>
                                        </span>
                                        <small className="text-muted text-truncate">
                                            {song.all_artist_name || song.artist_name}
                                        </small>
                                    </div>

                                    {/* Genre */}
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="badge bg-info bg-opacity-10 text-info me-2">
                                            <i className="fas fa-music me-1 small"></i>
                                        </span>
                                        <small className="text-muted">{song.genre}</small>
                                    </div>

                                    {/* Created / Release Date */}
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="badge bg-warning bg-opacity-10 text-warning me-2">
                                            <i className="fas fa-calendar me-1 small"></i>
                                        </span>
                                        <small className="text-muted">
                                            Released: {new Date(song.release_date).toLocaleDateString()}
                                        </small>
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="mt-auto pt-2 d-flex justify-content-between">
                                        <Link
                                            style={{ zIndex: "2" }}
                                            className="btn btn-outline-primary btn-sm"
                                            href={`/user/playSong2/${song.id}`}
                                        >
                                            <i className="fas fa-play me-1"></i> Play
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-12 text-center py-4">
                            <i className="fas fa-music text-muted fs-1 mb-3"></i>
                            <p className="text-muted fs-5">No Song Available</p>
                        </div>
                    )}
                </div>
            </div>}
        </Layout>
    );
}
