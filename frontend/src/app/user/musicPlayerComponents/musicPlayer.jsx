"use client"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useSession } from "next-auth/react"
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaHeart, FaRegHeart, FaRandom, FaVolumeUp, FaVolumeMute, FaMusic, FaShare, FaComment, FaEllipsisH, FaInfoCircle } from "react-icons/fa"
import { GiMicrophone } from "react-icons/gi"
import { IoMdShare } from "react-icons/io"
import { BsGraphUp } from "react-icons/bs"
import { postComments, likeStateManage, playCountUpdate, getComments } from "@/app/utils/userApi"
import { getUserSong } from "@/app/utils/userApi"
import { LineWave, Audio } from "react-loader-spinner"
import { 
  FaUser, FaGlobe, 
  FaCalendarAlt, FaClock, FaHeadphones, FaDrum, 
  FaAlbum, FaDownload, FaExclamationTriangle, 
  FaCopyright, FaAlignLeft 
} from "react-icons/fa";

const MusicPlayer = ({data=[]}) => {
  // Only log when data actually changes
  const prevDataRef = useRef();
  useEffect(() => {
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(data)) {
      console.log("MusicPlayer got data:", data);
      prevDataRef.current = data;
    }
  }, [data]);

  // Memoize the props to prevent unnecessary changes
  const props = useMemo(() => data, [data]);
  
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
  const [showSongDetails, setShowSongDetails] = useState(false)

  // Generate unique key for list items - memoize this function with useMemo
  const generateUniqueKey = useMemo(() => {
    return (id) => `${id}_${Math.random().toString(36).substring(2, 9)}`
  }, [])

  const play = useCallback(async (data) => {
    try {
      const res = await playCountUpdate(data)
      if (res.code != 1) {
        console.log("ERROR : ", res.data)
      }
    } catch (error) {
      console.error("ERROR : ", error)
    }
  }, [])

  // Fetch songs when session or id changes
  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true)
      setSongs(props)
      setCurrentSong(props[0])
      setIsFavorite(props[0]?.LIKESTATUS == "LIKED" ? true : false)
      
      if (session?.user?.jwtToken && props[0]?.id) {
        getAllComments({ jwtToken: session.user.jwtToken, id: props[0].id })
      }
      
      setNextSongs(props.slice(1, 11))
      setRecommendedSongs(props.slice(11))
      setPlayCount(Math.floor(Math.random() * 10000) + 1000)
    } catch (error) {
      console.error("Error fetching songs:", error)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.jwtToken, params.id, props])

  const addNewCommentToSong = useCallback(async (data) => {
    const res = await postComments(data)
    if (res.code == 1) {
      alert("Comment Saved Successfully!")
    } else {
      alert("error : ", res.data)
    }
  }, [])

  const getAllComments = useCallback(async (data) => {
    try {
      const res = await getComments(data)
      if (res.code == 1) {
        setComments(res.data)
      }
    } catch (error) {
      console.error("Error : ", error)
    }
  }, [])

  useEffect(() => {
    if (session?.user?.jwtToken) {
      fetchSongs()
    }
  }, [fetchSongs, session?.user?.jwtToken])

  // Audio controls
  const togglePlay = useCallback(() => {
    if (!playCounted && currentSong) {
      setPlayCounted(true)
      play({ jwtToken: session?.user?.jwtToken, id: currentSong.id })
    }
    
    if (!audioRef.current) return

    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => {
          setPlaying(true)
          setPlayCount(prev => prev + 1)
        })
        .catch(err => console.warn("Play error:", err))
    }
  }, [playing, currentSong, playCounted, session?.user?.jwtToken, play])

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
  }, [nextSongs, playing, session?.user?.jwtToken, play, getAllComments])

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
    router.push(`/user/playSong2/${song.id}`)
  }, [router])

  // Comment handling
  const handleAddComment = useCallback(() => {
    if (newComment.trim() === "") return

    const addNewComents = {
      song_id: currentSong.id,
      message: newComment,
      jwtToken: session?.user?.jwtToken
    }

    addNewCommentToSong(addNewComents)
    getAllComments({ jwtToken: session?.user?.jwtToken, id: currentSong.id })
    setNewComment("")
  }, [newComment, currentSong, session?.user?.jwtToken, addNewCommentToSong, getAllComments])

  const shareOptions = useMemo(() => [
    { name: "Copy Link", icon: <FaRegHeart /> },
    { name: "Share to Facebook", icon: <FaRegHeart /> },
    { name: "Share to Twitter", icon: <FaRegHeart /> },
    { name: "Share to Instagram", icon: <FaRegHeart /> }
  ], [])

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
    if (!audioRef.current || !currentSong?.song_file) return

    setProgress(0)

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

  const favrouteToggle = useCallback(async () => {
    try {
      const res = await likeStateManage({ 
        jwtToken: session?.user?.jwtToken, 
        song_id: currentSong.id, 
        state: isFavorite ? "unlike" : "like" 
      })
      if (res.code == 1) {
        setIsFavorite(!isFavorite)
      }
    } catch (error) {
      console.error("Error : ", error)
    }
  }, [isFavorite, currentSong, session?.user?.jwtToken])

  const handleSuffle = useCallback(() => {
    let arr = [...nextSongs]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setNextSongs(arr)
  }, [nextSongs])

  // Song Details Modal
  const SongDetailsModal = useCallback(() => {
    if (!currentSong || !showSongDetails) return null;

    return (
     const SongDetailsModal = useCallback(() => {
  if (!currentSong || !showSongDetails) return null;

  return (
    <div className="modal-backdrop" onClick={() => setShowSongDetails(false)}>
      <div className="song-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaInfoCircle className="me-2" />
            Song Details
          </h3>
          <button className="close-btn" onClick={() => setShowSongDetails(false)}>×</button>
        </div>
        
        <div className="modal-content">
          {/* Album Cover and Basic Info */}
          <div className="row mb-4">
            <div className="col-md-4 text-center">
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentSong.cover_image}`}
                className="img-fluid rounded"
                alt="Album Cover"
                onError={(e) => {
                  e.target.src = '/default-album.png'
                }}
              />
            </div>
            <div className="col-md-8">
              <h4 className="text-primary">{currentSong.title}</h4>
              <p className="text-muted">
                <FaUser className="me-2" />
                {currentSong.all_artist_name || currentSong.artist_name}
              </p>
              <div className="d-flex flex-wrap gap-2 mt-3">
                <span className="badge bg-info">
                  <FaMusic className="me-1" />
                  {currentSong.genre || "Unknown Genre"}
                </span>
                <span className="badge bg-secondary">
                  <FaGlobe className="me-1" />
                  {currentSong.language}
                </span>
                <span className="badge bg-success">
                  <FaHeart className="me-1" />
                  {currentSong.mood}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="row">
            <div className="col-md-6">
              <div className="detail-item">
                <FaCalendarAlt className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-label">Release Date</span>
                  <span className="detail-value">
                    {new Date(currentSong.release_date).toLocaleDateString() || "Unknown"}
                  </span>
                </div>
              </div>
              
              <div className="detail-item">
                <FaClock className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">
                    {formatTime(currentSong.duration || duration)}
                  </span>
                </div>
              </div>
              
              <div className="detail-item">
                <FaHeadphones className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-label">Play Count</span>
                  <span className="detail-value">{currentSong.play_count || playCount}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <FaHeart className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-label">Likes</span>
                  <span className="detail-value">{currentSong.total_likes || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="detail-item">
                <FaDrum className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-label">BPM</span>
                  <span className="detail-value">{currentSong.BPM || "N/A"}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <FaAlbum className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-label">Album</span>
                  <span className="detail-value">{currentSong.album_name || "Unknown Album"}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <FaDownload className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-label">Downloads</span>
                  <span className="detail-value">{currentSong.download_count || 0}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <FaExclamationTriangle className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-label">Explicit</span>
                  <span className="detail-value">{currentSong.explicit ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {currentSong.bio && (
            <div className="detail-section mt-4">
              <h5>
                <FaUser className="me-2" />
                Artist Bio
              </h5>
              <p className="detail-text">{currentSong.bio}</p>
            </div>
          )}
          
          {currentSong.copyright_info && (
            <div className="detail-section mt-3">
              <h5>
                <FaCopyright className="me-2" />
                Copyright
              </h5>
              <p className="detail-text">{currentSong.copyright_info}</p>
            </div>
          )}
          
          {currentSong.description && (
            <div className="detail-section mt-3">
              <h5>
                <FaAlignLeft className="me-2" />
                Description
              </h5>
              <p className="detail-text">{currentSong.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Add CSS for the modal */}
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .song-details-modal {
          background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
          border-radius: 12px;
          padding: 25px;
          width: 90%;
          max-width: 700px;
          max-height: 80vh;
          overflow-y: auto;
          color: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border: 1px solid #444;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #444;
          padding-bottom: 15px;
        }
        
        .modal-header h3 {
          color: #1db954;
          margin: 0;
          display: flex;
          align-items: center;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .close-btn:hover {
          color: #1db954;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }
        
        .detail-icon {
          font-size: 18px;
          color: #1db954;
          min-width: 30px;
        }
        
        .detail-content {
          margin-left: 12px;
        }
        
        .detail-label {
          display: block;
          font-size: 12px;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          display: block;
          font-weight: 500;
          color: white;
        }
        
        .detail-section {
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }
        
        .detail-section h5 {
          color: #1db954;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .detail-text {
          color: #ddd;
          line-height: 1.6;
          margin: 0;
        }
        
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 10px;
          border-radius: 15px;
        }
      `}</style>
    </div>
  );
}, [currentSong, showSongDetails, duration, formatTime]);
    );
  }, [currentSong, showSongDetails, duration, formatTime]);

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
        <div className="loader">
          <LineWave
            visible={true}
            height="200"
            width="200"
            color="#4fa94d"
            ariaLabel="line-wave-loading"
            wrapperStyle={{}}
            wrapperClass=""
            firstLineColor=""
            middleLineColor=""
            lastLineColor=""
          />
        </div>
      </div>
    )
  }

  if (!currentSong) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="alert alert-info">No song selected</div>
      </div>
    )
  }

  return (
    <div className="music-player-container">
      {/* Song Details Modal */}
      <SongDetailsModal />
      
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
                    onClick={() => { favrouteToggle() }}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                  </button>
                  <a onClick={()=>{
                    handleSuffle()
                  }} className="btn btn-icon mx-1" aria-label="Shuffle">
                    <FaRandom />
                  </a>
                  <button
                    className="btn btn-icon mx-1"
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    aria-label="Share options"
                  >
                    <IoMdShare />
                  </button>
                  <button
                    className="btn btn-icon mx-1"
                    onClick={() => setShowSongDetails(true)}
                    aria-label="Song details"
                  >
                    <FaInfoCircle />
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
            <div className="d-flex p-3 justify-content-between align-items-center">
              <h5 className="section-title">Up Next</h5>
              <a onClick={()=>{
                handleSuffle()
              }} className="btn btn-icon mx-1" aria-label="Shuffle">
                <FaRandom />
              </a>
            </div>
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
        <section className="recommended-section mb-5">
          <h5 className="section-title">Recommended for You</h5>
          <div className="recommended-grid mb-4">
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
                    <span><FaPlay /> {song?.play_count || 0}</span>
                    <span><FaHeart /> {song?.total_likes || 0}</span>
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
      
      {/* Add CSS for the modal */}
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .song-details-modal {
          background-color: #2d2d2d;
          border-radius: 12px;
          padding: 20px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          color: white;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #444;
          padding-bottom: 10px;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }
        
        .detail-row {
          display: flex;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        
        .detail-row.full-width {
          flex-direction: column;
        }
        
        .detail-label {
          font-weight: bold;
          min-width: 120px;
          margin-right: 10px;
          color: #1db954;
        }
        
        .detail-value {
          flex: 1;
        }
        
        .detail-description {
          margin-top: 5px;
          line-height: 1.5;
          color: #ccc;
        }
      `}</style>
    </div>
  )
}

export default MusicPlayer