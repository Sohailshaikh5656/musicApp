"use client"
import { getAllFeaturedPlayList } from "@/app/utils/apiHandler"
import { useParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import Layout from "../../common/layout"
import PlayListPlayer from "../../musicPlayerComponents/playListPlayer"
import { Audio } from "react-loader-spinner"
import { ToastContainer } from 'react-toastify'

const FeaturePlayList = () => {
    const params = useParams()
    const id = params.id;
    const { data: session } = useSession()
    const [songs, setSongs] = useState([])
    const [noSong, setNoSong] = useState(false)
    const [playList, setPlayList] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchPlayList = useCallback(async () => {
        try {
            setLoading(true)
            const res = await getAllFeaturedPlayList({ jwtToken: session?.user?.jwtToken, id: id })
            if (res.code == 1) {
                setSongs(res.data.song || [])
                setPlayList(res.data)
            } else if (res.code == 2) {
                setNoSong(true)
                if (res.data.song == "No Song Found ! An Empty Play List") {
                    delete res.data.song
                    setPlayList(res.data)
                }
            } else {
                console.log("Error : ", res)
            }
        } catch (error) {
            console.error("Error", error)
        } finally {
            setLoading(false)
        }
    }, [session?.user?.jwtToken, id])

    useEffect(() => {
        if (session?.user?.jwtToken) {
            fetchPlayList()
        }
    }, [session?.user?.jwtToken, fetchPlayList])

    if (loading) {
        return (
            <Layout>
                <div className="container d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
                   <Audio/>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <ToastContainer />
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 relative z-0">
                {playList && (
                    <div className="container">
                        <div className="row mt-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="col-md-4 col-12 relative group">
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"></div>
                                <img
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${playList.image}`}
                                    alt={playList.title}
                                    className="w-full h-64 object-cover rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://placehold.co/300x300?text=🎵";
                                    }}
                                    height={250}
                                    width={250}
                                />
                            </div>
                            <div className="col-md-8 col-12">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors duration-200">
                                    {playList.title}
                                </h1>

                                <p className="text-gray-600 text-lg">
                                    <span className="d-flex align-items-center gap-2">
                                        <i className="bi bi-music-note-beamed fs-5 text-purple-600"></i>
                                        {songs?.length || 0} {songs?.length === 1 ? "Song" : "Songs"}
                                    </span>
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    <span className="d-flex align-items-center gap-2">
                                        <i className="bi bi-calendar3 fs-5 text-purple-600"></i>
                                        Created on{" "}
                                        {new Date(playList.created_at).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {noSong && (
                <div className="text-center p-8 bg-white rounded-xl shadow-md border border-gray-100">
                    <h1 className="mb-4 text-xl font-semibold text-gray-800">There are No Songs in Your Playlist</h1>
                    <p className="text-gray-600">Add some songs to enjoy your playlist!</p>
                </div>
            )}

            {songs.length > 0 ? <PlayListPlayer data={songs} /> : !noSong && <p>No songs found</p>}

            <style jsx>{`
                @keyframes rotating {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .rotating {
                    animation: rotating 10s linear infinite;
                }
                @keyframes floatUp {
                    0% { 
                        transform: translateY(0);
                        opacity: 1;
                    }
                    100% { 
                        transform: translateY(-100px);
                        opacity: 0;
                    }
                }
                .progress-bar::-webkit-slider-thumb {
                    appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: #4f46e5;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                .progress-bar::-moz-range-thumb {
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: #4f46e5;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    border: none;
                }
                .volume-slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 14px;
                    width: 14px;
                    border-radius: 50%;
                    background: #4f46e5;
                    cursor: pointer;
                }
                .volume-slider::-moz-range-thumb {
                    height: 14px;
                    width: 14px;
                    border-radius: 50%;
                    background: #4f46e5;
                    cursor: pointer;
                    border: none;
                }
            `}</style>
        </Layout>
    )
}

export default FeaturePlayList