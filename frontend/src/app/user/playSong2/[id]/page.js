"use client"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import { useSession } from "next-auth/react"
import { getComments, getUserSong } from "@/app/utils/apiHandler"
import Layout from "../../common/layout"
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaHeart, FaRegHeart, FaRandom, FaVolumeUp, FaVolumeMute, FaMusic, FaShare, FaComment, FaEllipsisH } from "react-icons/fa"
import { GiMicrophone } from "react-icons/gi"
import { IoMdShare } from "react-icons/io"
import { BsGraphUp } from "react-icons/bs"
import { postComments } from "@/app/utils/apiHandler"
import { likeStateManage } from "@/app/utils/apiHandler"
import { playCountUpdate } from "@/app/utils/apiHandler"

const PlaySongFunction = () => {
    const { data: session } = useSession()
    const params = useParams()
    const router = useRouter()
    const audioRef = useRef(null)

    // State management
    const [songs, setSongs] = useState([])
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

    // Generate unique key for list items
    const generateUniqueKey = (id) => {
        return `${id}_${Math.random().toString(36).substring(2, 9)}`
    }
    const play = async(data)=>{
        try{
            const res = await playCountUpdate(data)
            if(res.code != 1){
                console.log("ERROR : ",res.data)
            }
        }catch(error){
            console.error("ERROR : ",error)
        }
    }

    // Fetch songs when session or id changes
    const fetchSongs = useCallback(async () => {
        try {
            setLoading(true)
            const res = await getUserSong({
                jwtToken: session?.user?.jwtToken,
                id: params.id
            })

            if (res.code == 1) {
                setSongs(res.data)
                setCurrentSong(res.data[0])
                setIsFavorite(res.data[0].LIKESTATUS=="LIKED"?true:false)
                getAllComments({ jwtToken: session?.user?.jwtToken, id: res.data[0].id })
                setNextSongs(res.data.slice(1, 11))
                setRecommendedSongs(res.data.slice(11))
                setPlayCount(Math.floor(Math.random() * 10000) + 1000) // Random play count
            }
        } catch (error) {
            console.error("Error fetching songs:", error)
        } finally {
            setLoading(false)
        }
    }, [session?.user?.jwtToken, params.id])

    const addNewCommentToSong = async (data) => {
        const res = await postComments(data)
        if (res.code == 1) {
            alert("Comment Saved Succeffully !")
        } else {
            alert("error : ", res.data)
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

    // Generate dummy comments for demo
    const generateDummyComments = () => {
        getAllComments()
        const names = ["Alex", "Jamie", "Taylor", "Jordan", "Casey", "Riley", "Morgan"]
        const comments = [
            "Love this track!",
            "The lyrics are so meaningful",
            "Can't stop listening",
            "This brings back memories",
            "The artist never disappoints",
            "Absolute banger!",
            "On repeat all day"
        ]

        return Array(5).fill().map((_, i) => ({
            id: i,
            user: names[Math.floor(Math.random() * names.length)],
            text: comments[Math.floor(Math.random() * comments.length)],
            time: `${Math.floor(Math.random() * 60)} minutes ago`
        }))
    }

    useEffect(() => {
        if (session?.user?.jwtToken) {
            fetchSongs()
        }
    }, [fetchSongs, session?.user?.jwtToken])

    // Audio controls
    const togglePlay = useCallback(() => {
        if(!playCounted && currentSong){
            setPlayCounted(!playCounted)
            play({jwtToken:session?.user?.jwtToken,id:currentSong.id})
        }
        if (!audioRef.current) return

        if (playing) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
                .then(() => {
                    setPlaying(true)
                    // Increment play count when song starts playing
                    setPlayCount(prev => prev + 1)
                })
                .catch(err => console.warn("Play error:", err))
        }
        setPlaying(!playing)
    }, [playing])

    const handleProgressChange = useCallback((e) => {
        if (!audioRef.current) return
        const seekTime = Number(e.target.value)   // already in seconds
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
            play({ jwtToken: session?.user?.jwtToken, id: nextSong.id })
            getAllComments({ jwtToken: session?.user?.jwtToken, id: nextSong.id })
            setNextSongs(newNextSongs)
            setProgress(0)
            if (playing) {
                setTimeout(() => {
                    audioRef.current?.play()
                        .then(() => setPlayCount(prev => prev + 1))
                        .catch(err => console.warn("Auto-play error:", err))
                }, 100)
            }
        }
    }, [nextSongs, playing])

    const playPrevSong = useCallback(() => {
        // Simple implementation - just restart current song
        if (audioRef.current) {
            audioRef.current.currentTime = 0
            setProgress(0)
            if (playing) {
                audioRef.current.play().catch(err => console.warn("Play error:", err))
            }
        }
    }, [playing])

    const playSelectedSong = useCallback((song) => {
        router.push(`/user/playSong2/${song.id}`)
    }, [router])

    // Comment handling
    const handleAddComment = useCallback(() => {
        if (newComment.trim() === "") return

        const newCommentObj = {
            id: comments.length + 1,
            user: "You",
            text: newComment,
            time: "Just now"
        }

        const addNewComents = {
            song_id: currentSong.id,
            message: newComment,
            jwtToken: session?.user?.jwtToken
        }

        addNewCommentToSong(addNewComents)
        getAllComments({jwtToken:session?.user?.jwtToken,id:currentSong.id})
        setNewComment("")
    }, [comments, newComment])

    // Share options
    const shareOptions = [
        { name: "Copy Link", icon: <FaRegHeart /> },
        { name: "Share to Facebook", icon: <FaRegHeart /> },
        { name: "Share to Twitter", icon: <FaRegHeart /> },
        { name: "Share to Instagram", icon: <FaRegHeart /> }
    ]

    const updateProgress = useCallback(() => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime)  // seconds
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
        if (!audioRef.current || !currentSong?.song_file) return

        // Reset progress when song changes
        setProgress(0)

        // Try to auto-play
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    setPlaying(true)
                    setPlayCount(prev => prev + 1)
                })
                .catch(() => setPlaying(false))
        }
    }, [currentSong])

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

    if (!currentSong) {
        return (
            <Layout>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <div className="alert alert-info">No song selected</div>
                </div>
            </Layout>
        )
    }
    const favrouteToggle = async() =>{
        try{
            const res = await likeStateManage({jwtToken:session?.user?.jwtToken,song_id : currentSong.id, state : isFavorite?"unlike":"like"})
            if(res.code==1){
                setIsFavorite(!isFavorite)
            }
        }catch(error){
            console.error("Error : ",error)
        }
    }
    

    return (
        <Layout>
            <div className="music-player-container">
                {/* Main Player Section */}
                <div className="row">
                    <div className="col-lg-8 mb-4">
                        <div className="now-playing-card">
                            <div className="album-art-container">
                                {/* Enhanced CD Disk Design with music notes */}
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

                                {/* Enhanced Music Notes Animation */}
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

                            {/* Song Info Section with better typography */}
                            <div className="song-info-section">
                                <h1 className="song-title" onClick={() => router.push(`/song-details/${currentSong.id}`)}>
                                    {currentSong.title}
                                </h1>
                                <h2 className="artist-name">{currentSong.all_artist_name || currentSong.artist_name}</h2>

                                {/* Play count and social stats */}
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
                                            onClick={() => {favrouteToggle()}}
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

                                <div className="progress-container" >
                                    <input
                                        type="range"
                                        className="progress-bar"
                                        min="0"
                                        max={duration || 0}      // total seconds
                                        value={progress}         // current seconds
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

                            {/* Comments Section */}
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

                    {/* Up Next Section */}
                    <div className="col-lg-4 mb-4">
                        <div className="up-next-card">
                            <h5 className="section-title">Up Next</h5>
                            <div className="queue-list">
                                {nextSongs.map((song) => (
                                    <div
                                        key={generateUniqueKey(song.id)}
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
                                            <p className="text-muted">{song.artist_name}</p>
                                        </div>
                                        <span className="queue-item-duration">{formatTime(song.duration)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Section */}
                {recommendedSongs.length > 0 && (
                    <section className="recommended-section">
                        <h5 className="section-title">Recommended for You</h5>
                        <div className="recommended-grid">
                            {recommendedSongs.map((song) => (
                                <div
                                    key={generateUniqueKey(song.id)}
                                    className="recommended-card"
                                    onClick={() => playSelectedSong(song)}
                                >
                                    <div className="recommended-img-container">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${song.cover_image}`}
                                            className="recommended-img"
                                            alt={song.title}
                                            onError={(e) => {
                                                e.target.src = '/default-album.png'
                                            }}
                                        />
                                        <div className="recommended-overlay">
                                            <button className="btn-play-sm">
                                                <FaPlay />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="recommended-info">
                                        <h6>{song.title}</h6>
                                        <p className="text-muted">{song.artist_name}</p>
                                        <div className="recommended-stats">
                                            <span><FaPlay /> {Math.floor(Math.random() * 1000).toLocaleString()}</span>
                                            <span><FaHeart /> {Math.floor(Math.random() * 500).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Mini Player */}
                <div className="mini-player">
                    <div className="d-flex align-items-center">
                        <div className="cd-disk-mini">
                            <div className="cd-center-mini"></div>
                            <img
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentSong.cover_image}`}
                                className={`mini-album-art ${playing ? 'rotating' : ''}`}
                                alt={currentSong.title}
                                onError={(e) => {
                                    e.target.src = '/default-album.png'
                                }}
                            />
                        </div>
                        <div className="mini-player-info">
                            <p className="mb-0">{currentSong.title}</p>
                            <small className="text-muted">{currentSong.artist_name}</small>
                        </div>
                    </div>
                    <div className="mini-player-controls">
                        <button className="btn-control-mini" onClick={playPrevSong} aria-label="Previous song">
                            <FaStepBackward />
                        </button>
                        <button className="btn-play-mini" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
                            {playing ? <FaPause /> : <FaPlay />}
                        </button>
                        <button className="btn-control-mini" onClick={playNextSong} aria-label="Next song">
                            <FaStepForward />
                        </button>
                        <button
                            className={`btn-lyrics-mini ${showLyrics ? 'active' : ''}`}
                            onClick={() => setShowLyrics(!showLyrics)}
                            aria-label={showLyrics ? "Hide lyrics" : "Show lyrics"}
                        >
                            <GiMicrophone />
                        </button>
                    </div>
                </div>

                {/* Hidden Audio Element */}
                <audio
                    ref={audioRef}
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentSong.song}`}
                    onDurationChange={updateDuration}
                />
            </div>
        </Layout>
    )
}

export default PlaySongFunction