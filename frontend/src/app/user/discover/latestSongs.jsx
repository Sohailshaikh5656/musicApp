"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation"
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { BiCategory } from "react-icons/bi";
import { FaEye, FaHeart, FaRegComment, FaShareAlt, FaPlay, FaMusic, FaPodcast } from "react-icons/fa";
const LatestSongs = ({latestSongs}) => {
    return (
        latestSongs.slice(0, 3).map((song, index) => (
            <div key={index} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm music-card">
                    <div className="position-relative">
                        <img
                            src={song.cover_image || "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"}
                            className="card-img-top"
                            alt={song.title}
                            style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="position-absolute bottom-0 start-0 end-0 p-3 gradient-overlay d-flex justify-content-center">
                            <button className="btn btn-primary rounded-circle p-2 play-btn">
                                <FaPlay />
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">{song.title}</h5>
                        <p className="card-text text-muted">{song.artist || "Unknown Artist"}</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">{song.duration || "3:45"}</small>
                            <div>
                                <button className="btn btn-sm btn-outline-primary me-2">
                                    <FaPlay />
                                </button>
                                <button className="btn btn-sm btn-outline-danger">
                                    <FaHeart />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))
    )
}

export default LatestSongs