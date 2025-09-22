"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation"
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { BiCategory } from "react-icons/bi";
import { FaEye, FaHeart, FaRegComment, FaShareAlt, FaPlay, FaMusic, FaPodcast } from "react-icons/fa";
export default function DiscoverPodCast({latestPodCast}){
    const router = useRouter()
    return (
        <>
            {latestPodCast && latestPodCast.length > 0 ? (
                        <div className="position-relative">
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={25}
                                slidesPerView={3}
                                navigation={{
                                    nextEl: '.podcast-swiper-button-next',
                                    prevEl: '.podcast-swiper-button-prev',
                                }}
                                pagination={{ 
                                    clickable: true,
                                    el: '.podcast-swiper-pagination',
                                }}
                                autoplay={{ delay: 5000, disableOnInteraction: false }}
                                loop={true}
                                breakpoints={{
                                    320: { slidesPerView: 1, spaceBetween: 15 },
                                    640: { slidesPerView: 2, spaceBetween: 20 },
                                    1024: { slidesPerView: 3, spaceBetween: 25 }
                                }}
                            >
                                {latestPodCast.map((podcast, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="card h-100 shadow-sm border-0 podcast-card" onClick={()=>router.push(`/user/podcast/${podcast.id}`)}>
                                            <div className="position-relative">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${podcast.thumbnail}` || "https://images.unsplash.com/photo-1581368135153-a506cf13531c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"}
                                                    className="card-img-top"
                                                    alt={podcast.title}
                                                    style={{ height: "200px", objectFit: "cover" }}
                                                />
                                                <div className="position-absolute top-0 end-0 m-3">
                                                    <span className="badge bg-primary bg-opacity-90 px-2 py-1">
                                                        <FaPodcast className="me-1" /> Podcast
                                                    </span>
                                                </div>
                                                <div className="position-absolute bottom-0 start-0 end-0 p-3 gradient-overlay d-flex justify-content-center">
                                                    <button className="btn btn-primary rounded-circle p-2 play-btn">
                                                        <FaPlay />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <h5 className="card-title">{podcast.title}</h5>
                                                <p className="card-text text-muted">{podcast.taken_by || "Unknown Host"}</p>
                                                
                                                <div className="d-flex justify-content-between align-items-center mt-3">
                                                    <div>
                                                        <span className="badge bg-light text-dark me-2">
                                                            <FaHeart className="text-danger me-1" /> {podcast.total_likes || "124"}
                                                        </span>
                                                        <span className="badge bg-light text-dark">
                                                            <FaRegComment className="text-primary me-1" /> {podcast.total_comments || "28"}
                                                        </span>
                                                    </div>
                                                    {/* <small className="text-muted">{podcast.total_views || "12"} Views</small> */}
                                                </div>
                                                
                                                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                                    <div className="d-flex align-items-center">
                                                        <span className="text-warning me-1">
                                                            <FaEye className="me-1" /> {podcast.total_views || "1.2K"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <button className="btn btn-sm btn-outline-secondary rounded-circle">
                                                            <FaShareAlt />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            
                            {/* Custom Navigation Buttons */}
                            <div className="podcast-swiper-button-prev position-absolute top-50 start-0 translate-middle-y">
                                <span className="bg-primary bg-opacity-90 rounded-circle shadow-sm d-flex align-items-center justify-content-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </div>
                            <div className="podcast-swiper-button-next position-absolute top-50 end-0 translate-middle-y">
                                <span className="bg-primary bg-opacity-90 rounded-circle shadow-sm d-flex align-items-center justify-content-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </div>
                            
                            {/* Custom Pagination */}
                            <div className="podcast-swiper-pagination text-center mt-4"></div>
                        </div>
                    ) : (
                        <div className="col-12">
                            <div className="alert alert-info">No podcasts available</div>
                        </div>
                    )}
        </>
    )
}