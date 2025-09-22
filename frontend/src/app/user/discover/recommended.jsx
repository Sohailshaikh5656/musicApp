"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation"
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { BiCategory } from "react-icons/bi";
import { FaEye, FaHeart, FaRegComment, FaShareAlt, FaPlay, FaMusic, FaPodcast } from "react-icons/fa";
export default function DiscoverRecommended({recommended}){
    const router = useRouter()
    return (
        <>
            {recommended && recommended.length > 0 && (
                    <div className="mb-5 position-relative">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="fw-bold"><BiCategory className="me-2 text-primary" />Recommended For You</h2>
                        </div>
                        
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={25}
                            slidesPerView={3}
                            navigation={{
                                nextEl: '.recommended-swiper-button-next',
                                prevEl: '.recommended-swiper-button-prev',
                            }}
                            pagination={{ 
                                clickable: true,
                                el: '.recommended-swiper-pagination',
                            }}
                            autoplay={{ delay: 5000, disableOnInteraction: false }}
                            loop={true}
                            breakpoints={{
                                320: { slidesPerView: 1, spaceBetween: 15 },
                                640: { slidesPerView: 2, spaceBetween: 20 },
                                1024: { slidesPerView: 3, spaceBetween: 25 }
                            }}
                        >
                            {recommended.map((song, index) => (
                                <SwiperSlide key={index}>
                                    <div className="card shadow-sm border-0 h-100 music-card" onClick={()=>{
                                        router.push(`/user/playSong2/${song.id}`)
                                    }}>
                                        <div className="position-relative">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${song.cover_image}` || "/placeholder.jpg"}
                                                alt={song.title}
                                                className="card-img-top"
                                                style={{ height: "200px", objectFit: "cover" }}
                                            />
                                            <div className="position-absolute top-0 end-0 m-3">
                                                <span className="badge bg-primary bg-opacity-90 px-2 py-1">
                                                    <FaMusic className="me-1" /> Song
                                                </span>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">{song.title}</h5>
                                            <p className="card-text text-muted">{song.artist_name}</p>
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <div>
                                                    <span className="badge bg-light text-dark me-2">
                                                        <FaHeart className="text-danger me-1" /> {song?.total_likes || "245"}
                                                    </span>
                                                    <span className="badge bg-light text-dark">
                                                        <FaEye className="text-primary me-1" /> {song?.play_count || "1.5K"}
                                                    </span>
                                                </div>
                                                <small className="text-muted">{song.duration || "3:45"}</small>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        
                        {/* Custom Navigation Buttons */}
                        <div className="recommended-swiper-button-prev position-absolute top-50 start-0 translate-middle-y">
                            <span className="bg-primary bg-opacity-90 rounded-circle shadow-sm d-flex align-items-center justify-content-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </div>
                        <div className="recommended-swiper-button-next position-absolute top-50 end-0 translate-middle-y">
                            <span className="bg-primary bg-opacity-90 rounded-circle shadow-sm d-flex align-items-center justify-content-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </div>
                        
                        {/* Custom Pagination */}
                        <div className="recommended-swiper-pagination text-center mt-4"></div>
                    </div>
                )}
        </>
    )
}