"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { ToastContainer, toast } from "react-toastify"
import Layout from "../../common/layout"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { getAllFeaturedPlayListSong } from "@/app/utils/apiHandler"
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaHeart, FaRegHeart, FaRandom, FaVolumeUp, FaVolumeMute, FaMusic, FaShare, FaComment, FaEllipsisH } from "react-icons/fa"
import { GiMicrophone } from "react-icons/gi"
import { IoMdShare } from "react-icons/io"
import { BsGraphUp } from "react-icons/bs"
import { postComments } from "@/app/utils/apiHandler"
import { likeStateManage } from "@/app/utils/apiHandler"
import { playCountUpdate } from "@/app/utils/apiHandler"
import { getComments, getUserSong } from "@/app/utils/apiHandler"

const FeaturedPlayList = () => {
    const params = useParams()
    const audioRef = useRef(null)
    const id = params.id;
    const router = useRouter()
    const { data: session } = useSession()
    const [songs, setSongs] = useState([])
    const [noSong, setNoSong] = useState(false)
    const [playList, setPlayList] = useState(null)

    const [currentSong, setCurrentSong] = useState(null)
    const [nextSongs, setNextSongs] = useState([])
    const [recommendedSongs, setRecommendedSongs] = useState([])
    const [playing, setPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(80)
    const [isMuted, setIsMuted] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const [showLyrics, setShowLyrics] = useState(false)
    const [loading, setLoading] = useState(true)
    const [musicNotes, setMusicNotes] = useState([])
    const [showComments, setShowComments] = useState(false)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [showShareOptions, setShowShareOptions] = useState(false)
    const [playCount, setPlayCount] = useState(0)
    const [volumePercentage, setVolumePercentage] = useState("80%")
    const [playCounted, setPlayCounted] = useState(false)

    const generateUniqueKey = (id) => {
        return `${id}_${Math.random().toString(36).substring(2, 9)}`
    }

    const play = async (data) => {
        try {
            const res = await playCountUpdate(data)
            if (res.code != 1) {
                console.log("ERROR : ", res.data)
            }
        } catch (error) {
            console.error("ERROR : ", error)
        }
    }

    const fetchPlayList = async () => {
        try {
            setLoading(true)
            let res = await getAllFeaturedPlayListSong({ jwtToken: session?.user?.jwtToken, id: id })
            if (res.code == 1) {
                // Update to handle the correct API response structure
                setSongs(res.data.songs || [])
                setPlayList(res.data)
                
                if (res.data.songs && res.data.songs.length > 0) {
                    setCurrentSong(res.data.songs[0])
                    setIsFavorite(res.data.songs[0].LIKESTATUS == "LIKED" ? true : false)
                    getAllComments({ jwtToken: session?.user?.jwtToken, id: res.data.songs[0].id })
                    setNextSongs(res.data.songs.slice(1))
                    setPlayCount(Math.floor(Math.random() * 10000) + 1000)
                }
            } else if (res.code == 2) {
                setNoSong(true)
                if (res.data.songs == "No Song Found ! An Empty Play List") {
                    delete res.data.songs
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
    }

    useEffect(() => {
        if (session?.user?.jwtToken) {
            fetchPlayList()
        }
    }, [session?.user?.jwtToken])

    const addNewCommentToSong = async (data) => {
        const res = await postComments(data)
        if (res.code == 1) {
            toast.success("Comment Saved Successfully!")
        } else {
            toast.error("Error saving comment")
        }
    }

    const getAllComments = async (data) => {
        try {
            const res = await getComments(data)
            if (res.code == 1) {
                setComments(res.data)
                console.log("Comment Data", res.data)
            }
        } catch (error) {
            console.error("Error : ", error)
        }
    }

    // Audio controls (same as before)
    const togglePlay = useCallback(() => {
        if (!audioRef.current) return

        if (playing) {
            audioRef.current.pause()
            setPlaying(false)
        } else {
            audioRef.current.play()
                .then(() => {
                    setPlaying(true)
                    if (!playCounted && currentSong) {
                        setPlayCounted(true)
                        play({ jwtToken: session?.user?.jwtToken, id: currentSong.id })
                    }
                })
                .catch(err => console.warn("Play error:", err))
        }
    }, [playing, currentSong, playCounted])

    const handleProgressChange = useCallback((e) => {
        if (!audioRef.current) return
        const seekTime = Number(e.target.value)
        audioRef.current.currentTime = seekTime
        setProgress(seekTime)
    }, [])

    const handleVolumeChange = useCallback((e) => {
        const newVolume = e.target.value
        setVolume(newVolume)
        setVolumePercentage(`${newVolume}%`)
        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100
        }
        setIsMuted(newVolume === 0)
    }, [])

    const toggleMute = useCallback(() => {
        if (!audioRef.current) return
        if (isMuted) {
            audioRef.current.volume = volume / 100
            setVolumePercentage(`${volume}%`)
        } else {
            audioRef.current.volume = 0
            setVolumePercentage("0%")
        }
        setIsMuted(!isMuted)
    }, [isMuted, volume])

    const formatTime = useCallback((time) => {
        if (isNaN(time)) return "0:00"
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60).toString().padStart(2, '0')
        return `${minutes}:${seconds}`
    }, [])

    // Song navigation
    const playNextSong = useCallback(() => {
        if (nextSongs.length > 0) {
            const newNextSongs = [...nextSongs]
            const nextSong = newNextSongs.shift()
            setCurrentSong(nextSong)
            setPlayCounted(false)
            getAllComments({ jwtToken: session?.user?.jwtToken, id: nextSong.id })
            setNextSongs(newNextSongs)
            setProgress(0)
            if (playing) {
                setTimeout(() => {
                    audioRef.current?.play()
                        .then(() => {
                            setPlaying(true)
                            play({ jwtToken: session?.user?.jwtToken, id: nextSong.id })
                        })
                        .catch(err => console.warn("Auto-play error:", err))
                }, 100)
            }
        }
    }, [nextSongs, playing])

    const playPrevSong = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0
            setProgress(0)
            if (playing) {
                audioRef.current.play().catch(err => console.warn("Play error:", err))
            }
        }
    }, [playing])

    const playSelectedSong = useCallback((song) => {
        setCurrentSong(song)
        setPlayCounted(false)
        getAllComments({ jwtToken: session?.user?.jwtToken, id: song.id })
        setProgress(0)
        if (playing) {
            setTimeout(() => {
                audioRef.current?.play()
                    .then(() => {
                        setPlaying(true)
                        play({ jwtToken: session?.user?.jwtToken, id: song.id })
                    })
                    .catch(err => console.warn("Auto-play error:", err))
            }, 100)
        }
    }, [playing])

    // Comment handling
    const handleAddComment = useCallback(() => {
        if (newComment.trim() === "") return

        const addNewComments = {
            song_id: currentSong.id,
            message: newComment,
            jwtToken: session?.user?.jwtToken
        }

        addNewCommentToSong(addNewComments)
        getAllComments({ jwtToken: session?.user?.jwtToken, id: currentSong.id })
        setNewComment("")
    }, [newComment, currentSong])

    // Share options
    const shareOptions = [
        { name: "Copy Link", icon: <FaRegHeart /> },
        { name: "Share to Facebook", icon: <FaRegHeart /> },
        { name: "Share to Twitter", icon: <FaRegHeart /> },
        { name: "Share to Instagram", icon: <FaRegHeart /> }
    ]

    const updateProgress = useCallback(() => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime)
        }
    }, [])

    const updateDuration = useCallback(() => {
        if (audioRef.current) {
            const audioDuration = audioRef.current.duration
            if (!isNaN(audioDuration)) {
                setDuration(audioDuration)
            }
        }
    }, [])

    // Music notes animation
    useEffect(() => {
        if (!playing) {
            setMusicNotes([])
            return
        }

        const noteColors = ['#1db954', '#ff5e5e', '#5e9cff', '#ffcc5e', '#c56eff']

        const interval = setInterval(() => {
            if (playing) {
                setMusicNotes(prevNotes => [
                    ...prevNotes.slice(-8),
                    {
                        id: Date.now(),
                        left: `${Math.random() * 80 + 10}%`,
                        opacity: Math.random() * 0.7 + 0.3,
                        speed: Math.random() * 2 + 1,
                        color: noteColors[Math.floor(Math.random() * noteColors.length)],
                        size: Math.random() * 0.8 + 0.7
                    }
                ])
            }
        }, 500)

        return () => clearInterval(interval)
    }, [playing])

    // Setup audio event listeners
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        audio.addEventListener('timeupdate', updateProgress)
        audio.addEventListener('durationchange', updateDuration)
        audio.addEventListener('ended', playNextSong)

        return () => {
            audio.removeEventListener('timeupdate', updateProgress)
            audio.removeEventListener('durationchange', updateDuration)
            audio.removeEventListener('ended', playNextSong)
        }
    }, [playNextSong, updateProgress, updateDuration])

    // Auto-play when song changes
    useEffect(() => {
        if (!audioRef.current || !currentSong?.song) return

        // Reset progress when song changes
        setProgress(0)

        // Try to auto-play if it was playing before
        if (playing) {
            const playPromise = audioRef.current.play()
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setPlaying(true)
                    })
                    .catch(() => setPlaying(false))
            }
        }
    }, [currentSong])

    const favrouteToggle = async () => {
        try {
            const res = await likeStateManage({ jwtToken: session?.user?.jwtToken, song_id: currentSong.id, state: isFavorite ? "unlike" : "like" })
            if (res.code == 1) {
                setIsFavorite(!isFavorite)
            }
        } catch (error) {
            console.error("Error : ", error)
        }
    }

    if (loading) {
        return (
            <Layout>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <ToastContainer />
            
            {/* Playlist Header Section - Redesigned with Bootstrap */}
            <div className="container-fluid py-4 mb-4 bg-light rounded">
                {playList && (
                    <div className="row align-items-center">
                        <div className="col-md-4 text-center mb-3 mb-md-0">
                            <img
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${playList.image}`}
                                alt={playList.name}
                                className="img-fluid rounded shadow"
                                style={{ maxHeight: '300px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.currentTarget.src = "https://placehold.co/400x400?text=🎵";
                                }}
                            />
                        </div>
                        
                        <div className="col-md-8">
                            <div className="ps-md-4">
                                <p className="text-uppercase small mb-1 text-muted">Featured Playlist</p>
                                <h1 className="display-5 fw-bold mb-2">{playList.name}</h1>
                                
                                {playList.description && (
                                    <p className="lead mb-3">{playList.description}</p>
                                )}
                                
                                <div className="d-flex flex-wrap align-items-center text-muted mb-3">
                                    <span className="me-3">
                                        <FaMusic className="me-1" /> 
                                        {songs.length} {songs.length === 1 ? 'Song' : 'Songs'}
                                    </span>
                                    <span className="me-3">
                                        <BsGraphUp className="me-1" /> 
                                        {playList.category_name}
                                    </span>
                                    <span>
                                        Created: {new Date(playList.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <div className="d-flex flex-wrap gap-2 mt-4">
                                    <button 
                                        className="btn btn-primary btn-lg rounded-pill px-4"
                                        onClick={() => songs.length > 0 && playSelectedSong(songs[0])}
                                    >
                                        <FaPlay className="me-2" /> Play All
                                    </button>
                                    
                                    <button className="btn btn-outline-secondary btn-lg rounded-pill px-4">
                                        <FaHeart className="me-2" /> Save
                                    </button>
                                    
                                    <button className="btn btn-outline-secondary btn-lg rounded-pill px-3">
                                        <IoMdShare className="me-2" /> Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {noSong && (
                <div className="text-center p-8">
                    <h1 className="mb-4">There are No Songs in This Playlist</h1>
                    <p className="text-gray-600">This playlist is currently empty.</p>
                </div>
            )}

            {!currentSong && songs.length > 0 && (
                <div className="text-center p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select a Song</h2>
                    <p className="text-gray-600 mb-6">Click on a song from the list to start playing</p>
                    <div className="flex justify-center">
                        <FaMusic className="text-6xl text-gray-400 animate-bounce" />
                    </div>
                </div>
            )}

            {songs.length > 0 && (
                <div className="music-player-container">
                    {/* Song List */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header bg-white">
                                    <h5 className="mb-0">Songs in this Playlist</h5>
                                </div>
                                <div className="card-body p-0">
                                    {songs.map((song, index) => (
                                        <div
                                            key={song.id + '-' + index}
                                            className={`d-flex justify-content-between align-items-center p-3 border-bottom ${currentSong?.id === song.id ? 'bg-light' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => playSelectedSong(song)}
                                        >
                                            <div className="d-flex align-items-center">
                                                <div className="position-relative me-3">
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${song.cover_image}`}
                                                        alt={song.title}
                                                        width="50"
                                                        height="50"
                                                        className="rounded"
                                                        onError={(e) => {
                                                            e.target.src = '/default-album.png'
                                                        }}
                                                    />
                                                    {currentSong?.id === song.id && playing && (
                                                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{background: 'rgba(0,0,0,0.3)', borderRadius: '4px'}}>
                                                            <FaMusic className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h6 className="mb-0">{song.title}</h6>
                                                    <small className="text-muted">{song.all_artist_name || song.artist_name}</small>
                                                </div>
                                            </div>
                                            <div className="text-muted">
                                                {formatTime(song.duration)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Player - Only show if a song is selected */}
                    {currentSong && (
                        <>
                            <div className="row">
                                <div className="col-lg-8 mb-4">
                                    <div className="now-playing-card">
                                        <div className="album-art-container">
                                            <div className="cd-disk">
                                                <div className="cd-center"></div>
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentSong.cover_image}`}
                                                    className={`album-art ${playing ? 'rotating' : ''}`}
                                                    alt="Album Art"
                                                    onError={(e) => {
                                                        e.target.src = '/default-album.png'
                                                    }}
                                                />
                                            </div>

                                            <div className="music-notes-container">
                                                {musicNotes.map(note => (
                                                    <div
                                                        key={note.id}
                                                        className="music-note"
                                                        style={{
                                                            left: note.left,
                                                            opacity: note.opacity,
                                                            color: note.color,
                                                            fontSize: `${note.size}rem`,
                                                            animation: `floatUp ${note.speed}s linear forwards`
                                                        }}
                                                    >
                                                        <FaMusic />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="song-info-section">
                                            <h1 className="song-title">
                                                {currentSong.title}
                                            </h1>
                                            <h2 className="artist-name">{currentSong.all_artist_name || currentSong.artist_name}</h2>

                                            <div className="song-stats">
                                                <span className="stat-item">
                                                    <BsGraphUp className="stat-icon" /> {currentSong.play_count} plays
                                                </span>
                                                <span className="stat-item">
                                                    <FaHeart className="stat-icon" /> {currentSong.total_likes} likes
                                                </span>
                                            </div>

                                            {showLyrics && (
                                                <div className="lyrics-container">
                                                    <h5>Lyrics</h5>
                                                    {currentSong.lyrics?.split('\n').map((line, index) => (
                                                        <p key={index} className="lyric-line">{line}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="player-controls">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div className="d-flex align-items-center">
                                                    <button
                                                        className="btn btn-icon mx-1"
                                                        onClick={favrouteToggle}
                                                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                                    >
                                                        {isFavorite ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                                                    </button>
                                                    <button className="btn btn-icon mx-1" aria-label="Shuffle">
                                                        <FaRandom />
                                                    </button>
                                                    <button
                                                        className="btn btn-icon mx-1"
                                                        onClick={() => setShowShareOptions(!showShareOptions)}
                                                        aria-label="Share options"
                                                    >
                                                        <IoMdShare />
                                                    </button>
                                                    {showShareOptions && (
                                                        <div className="share-dropdown">
                                                            {shareOptions.map((option, index) => (
                                                                <button key={index} className="share-option">
                                                                    {option.icon} {option.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <button className="btn btn-icon" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
                                                        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                                                    </button>
                                                    <div className="volume-control-container">
                                                        <input
                                                            type="range"
                                                            className="volume-slider"
                                                            min="0"
                                                            max="100"
                                                            value={isMuted ? 0 : volume}
                                                            onChange={handleVolumeChange}
                                                            aria-label="Volume control"
                                                        />
                                                        <div className="volume-percentage">{volumePercentage}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="progress-container">
                                                <input
                                                    type="range"
                                                    className="progress-bar"
                                                    min="0"
                                                    max={duration || 0}
                                                    value={progress}
                                                    onChange={handleProgressChange}
                                                    aria-label="Song progress"
                                                />

                                                <div className="d-flex justify-content-between mt-1">
                                                    <span className="time-text">{formatTime(progress)}</span>
                                                    <span className="time-text">{formatTime(duration)}</span>
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-center align-items-center my-3">
                                                <button className="btn-control mx-2" onClick={playPrevSong} aria-label="Previous song">
                                                    <FaStepBackward />
                                                </button>
                                                <button className="btn-play mx-3" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
                                                    {playing ? <FaPause /> : <FaPlay />}
                                                </button>
                                                <button className="btn-control mx-2" onClick={playNextSong} aria-label="Next song">
                                                    <FaStepForward />
                                                </button>
                                            </div>

                                            <div className="d-flex justify-content-center">
                                                <button
                                                    className={`btn-lyrics ${showLyrics ? 'active' : ''}`}
                                                    onClick={() => setShowLyrics(!showLyrics)}
                                                    aria-label={showLyrics ? "Hide lyrics" : "Show lyrics"}
                                                >
                                                    <GiMicrophone /> {showLyrics ? 'Hide Lyrics' : 'Show Lyrics'}
                                                </button>
                                                <button
                                                    className={`btn-comments ${showComments ? 'active' : ''}`}
                                                    onClick={() => setShowComments(!showComments)}
                                                    aria-label={showComments ? "Hide comments" : "Show comments"}
                                                >
                                                    <FaComment /> {showComments ? 'Hide Comments' : 'Show Comments'}
                                                </button>
                                            </div>
                                        </div>

                                        {showComments && (
                                            <div className="comments-section">
                                                <h5 className="comments-title">Comments ({comments.length})</h5>
                                                <div className="add-comment">
                                                    <input
                                                        type="text"
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        placeholder="Add a comment..."
                                                        className="comment-input"
                                                    />
                                                    <button
                                                        className="btn-post-comment"
                                                        onClick={handleAddComment}
                                                        disabled={!newComment.trim()}
                                                    >
                                                        Post
                                                    </button>
                                                </div>
                                                <div className="comments-list">
                                                    {comments.map(comment => (
                                                        <div key={comment.id} className="comment-item">
                                                            <div className="comment-container">
                                                                <div className="comment-section">
                                                                    <div className="comment-avatar" style={{
                                                                        backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                                                                        width: '32px',
                                                                        height: '32px',
                                                                        borderRadius: '50%',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        color: '#fff',
                                                                        fontWeight: 'bold',
                                                                        fontSize: '14px',
                                                                        marginRight: '8px'
                                                                    }}>
                                                                        {comment.username?.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div className="comment-user">{comment.username}</div>
                                                                    <div className="comment-past">{comment.comment_time}</div>
                                                                </div>
                                                            </div>
                                                            <div className="comment-text">{comment.message}</div>
                                                            <div className="comment-time">{comment.created_at}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-4 mb-4">
                                    <div className="up-next-card">
                                        <h5 className="section-title">Up Next</h5>
                                        <div className="queue-list">
                                            {nextSongs.map((song, index) => (
                                                <div
                                                    key={generateUniqueKey(song.id + index)}
                                                    className={`queue-item ${currentSong.id === song.id ? 'active' : ''}`}
                                                    onClick={() => playSelectedSong(song)}
                                                >
                                                    <div className="queue-item-img">
                                                        <img
                                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${song.cover_image}`}
                                                            alt={song.title}
                                                            onError={(e) => {
                                                                e.target.src = '/default-album.png'
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="queue-item-info">
                                                        <h6>{song.title}</h6>
                                                        <p className="text-muted">{song.all_artist_name || song.artist_name}</p>
                                                    </div>
                                                    <span className="queue-item-duration">{formatTime(song.duration)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Audio Element */}
                            <audio
                                ref={audioRef}
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentSong.song}`}
                                onTimeUpdate={updateProgress}
                                onDurationChange={updateDuration}
                            />
                        </>
                    )}
                </div>
            )}
            
            
        </Layout>
    )
}

export default FeaturedPlayList