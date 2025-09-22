"use client"
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDiscover } from "@/store/slice/userSlicer";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "next/navigation";
import Layout from "../common/layout";
import { Audio } from "react-loader-spinner";
import Link from "next/link";
import { FaEye, FaHeart, FaRegComment, FaShareAlt, FaPlay, FaMusic, FaPodcast } from "react-icons/fa";
import { useRouter } from "next/navigation"
import { BiCategory } from "react-icons/bi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import DiscoverRecommended from "./recommended";
import DiscoverPodCast from "./latestPodCast";
import HeroSection from "./heroSection";
import LatestSongs from "./latestSongs";


export default function Discover() {
    const dispatch = useDispatch()
    const { data: session, status: authStatus } = useSession()

    const { Discover, status: discoverStatus, error } = useSelector(
        (state) => state.userAllSlicer
    );

    const [loading, setLoading] = useState(true)
    const [latestSongs, setLatestSongs] = useState(null)
    const [recommended, setRecommended] = useState(null)
    const [latestPodCast, setLatestPodCast] = useState(null)
    const timeOutRef = useRef(null)
    const router = useRouter()
    // Fetch API
    useEffect(() => {
        if (authStatus === "authenticated" && (!recommended && !latestPodCast && !latestSongs)) {
            dispatch(fetchDiscover({ jwtToken: session?.user?.jwtToken }));
        }
    }, [authStatus, Discover, session, dispatch]);

    // Handle slice status
    useEffect(() => {
        if (discoverStatus === "succeeded") {
            setLatestSongs(Discover?.latest);
            setRecommended(Discover?.recommended);
            setLatestPodCast(Discover?.latestPodcast);
            setLoading(false);
        }
    }, [discoverStatus, Discover]);

    if (loading) {
        return (
            <Layout>
                <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <Audio />
                </div>
            </Layout>
        );
    }

    if (discoverStatus === "failed") {
        return (
            <Layout>
                <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <h3 className="text-danger">Error: {error}</h3>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Hero Carousel */}
            <HeroSection />

            <div className="container mt-5">
                {/* Latest Songs Section */}
                <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold"><FaMusic className="me-2 text-primary" />Latest Songs</h2>
                    </div>
                    <div className="row">
                        {latestSongs && latestSongs.length > 0 ? (
                            <LatestSongs latestSongs={latestSongs} />
                        ) : (
                            <div className="col-12">
                                <div className="alert alert-info">No latest songs available</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recommended Section */}
                {recommended && recommended.length > 0 && (
                    <DiscoverRecommended recommended={recommended} />
                )}

                {/* Podcasts Section */}
                <div className="mb-5 position-relative">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold"><FaPodcast className="me-2 text-primary" />Latest Podcasts</h2>
                    </div>
                    
                    {latestPodCast && latestPodCast.length>0 && <DiscoverPodCast latestPodCast = {latestPodCast} />}
                </div>
            </div>

            <style jsx>{`
                .carousel-image {
                    filter: brightness(0.7);
                }
                .carousel-caption {
                    background-color: rgba(0,0,0,0.5);
                    border-radius: 10px;
                    padding: 20px;
                }
                .music-card, .podcast-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .music-card:hover, .podcast-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
                }
                .gradient-overlay {
                    background: linear-gradient(transparent, rgba(0,0,0,0.7));
                }
                .play-btn {
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .recommended-swiper-button-prev,
                .recommended-swiper-button-next,
                .podcast-swiper-button-prev,
                .podcast-swiper-button-next {
                    width: 48px;
                    height: 48px;
                    z-index: 10;
                    cursor: pointer;
                }
                .recommended-swiper-button-prev span,
                .recommended-swiper-button-next span,
                .podcast-swiper-button-prev span,
                .podcast-swiper-button-next span {
                    width: 40px;
                    height: 40px;
                    transition: all 0.3s ease;
                }
                .recommended-swiper-button-prev:hover span,
                .recommended-swiper-button-next:hover span,
                .podcast-swiper-button-prev:hover span,
                .podcast-swiper-button-next:hover span {
                    transform: scale(1.1);
                    background: rgba(13, 110, 253, 1) !important;
                }
                .recommended-swiper-pagination :global(.swiper-pagination-bullet),
                .podcast-swiper-pagination :global(.swiper-pagination-bullet) {
                    width: 10px;
                    height: 10px;
                    background: #dee2e6;
                    opacity: 1;
                }
                .recommended-swiper-pagination :global(.swiper-pagination-bullet-active),
                .podcast-swiper-pagination :global(.swiper-pagination-bullet-active) {
                    background: #0d6efd;
                    width: 30px;
                    border-radius: 5px;
                }
            `}</style>
        </Layout>
    );
}