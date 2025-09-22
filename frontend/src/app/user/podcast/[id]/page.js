"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getAllPodCast } from "@/app/utils/userApi";
import { ToastContainer, toast } from "react-toastify";
import Layout from "../../common/layout";
import {
    BsHandThumbsUp,
    BsChatDots,
    BsShare,
    BsCast,
    BsEye,
    BsPlayFill,
    BsPauseFill,
    BsVolumeUp,
    BsVolumeMute,
    BsFullscreen,
    BsFullscreenExit,
    BsGearFill,
    BsSkipBackward,
    BsSkipForward,
    BsArrowClockwise,
    BsCheck
} from "react-icons/bs";

export default function PodcastPlayer() {
    const { data: session } = useSession();
    const params = useParams();
    const router = useRouter();
    const id = params.id;
    const [currentPodcast, setCurrentPodcast] = useState();
    const [recommended, setRecommended] = useState([]);
    const [showmore, setShowMore] = useState(true);
    const [loading, setLoading] = useState(true);

    // Video player states
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [hoverTime, setHoverTime] = useState({ show: false, time: 0, position: 0 });
    const [buffering, setBuffering] = useState(false);
    const [error, setError] = useState(null);
    const [videoQualities, setVideoQualities] = useState([]);
    const [selectedQuality, setSelectedQuality] = useState('auto');
    const [showQualityMenu, setShowQualityMenu] = useState(false);

    const notify = (msg) => {
        toast(msg, { position: "top-right", autoClose: 2000 });
    };

    // Generate quality options based on available video sources
    const generateQualityOptions = (podcast) => {
        if (!podcast) return [];

        const qualities = [{ label: 'Auto', value: 'auto' }];

        // Check if different quality versions exist (this would come from your API)
        // For now, we'll simulate multiple quality options
        if (podcast.video) {
            qualities.push(
                { label: '1080p', value: '1080' },
                { label: '720p', value: '720' },
                { label: '480p', value: '480' },
                { label: '360p', value: '360' },
                { label: '240p', value: '240' }
            );
        }

        return qualities;
    };

    // Get video source based on selected quality
    const getVideoSource = (podcast, quality) => {
        if (!podcast || !podcast.video) return '';

        // In a real app, you'd have different URLs for different qualities
        // For now, we'll use the same URL but append a quality parameter
        const baseUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}${podcast.video}`;

        if (quality === 'auto') return baseUrl;

        // This would be replaced with actual quality-specific URLs in production
        return `${baseUrl}?quality=${quality}`;
    };

    // 🔹 Fetch current podcast
    const fetchCurrentPodcast = async () => {
        try {
            setLoading(true);
            const response = await getAllPodCast({
                jwtToken: session?.user?.jwtToken,
                id: id,
            });

            if (response.code == 1) {
                const podcastData = Array.isArray(response.data) ? response.data[0] : response.data;
                setCurrentPodcast(podcastData);

                // Generate quality options
                const qualities = generateQualityOptions(podcastData);
                setVideoQualities(qualities);

                setError(null);
            } else {
                notify(response?.data || "Something went wrong");
                setError("Failed to load podcast");
            }
        } catch (error) {
            notify(error.message);
            setError("Failed to load podcast");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Fetch recommended
    const fetchRecommended = async () => {
        try {
            const response = await getAllPodCast({
                jwtToken: session?.user?.jwtToken,
                id: id,
                recommended: 1,
            });
            if (response.code == 1) {
                setRecommended(response.data);
            } else {
                notify(response?.data || "Something went wrong");
            }
        } catch (error) {
            notify(error.message);
        }
    };

    useEffect(() => {
        if (session?.user?.jwtToken) {
            fetchCurrentPodcast();
            fetchRecommended();
        }
    }, [session?.user?.jwtToken, id]);

    // Hide controls after inactivity
    useEffect(() => {
        let timeoutId;
        const resetTimer = () => {
            clearTimeout(timeoutId);
            setShowControls(true);
            timeoutId = setTimeout(() => {
                if (playing) setShowControls(false);
            }, 3000);
        };

        if (containerRef.current) {
            containerRef.current.addEventListener("mousemove", resetTimer);
        }

        return () => {
            clearTimeout(timeoutId);
            if (containerRef.current) {
                containerRef.current.removeEventListener("mousemove", resetTimer);
            }
        };
    }, [playing]);

    // Video event handlers
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            setDuration(video.duration || 0);
            setError(null);
            setBuffering(false);
        };

        const handleWaiting = () => {
            setBuffering(true);
        };

        const handlePlaying = () => {
            setBuffering(false);
        };

        const handleError = () => {
            setError("Failed to load video. The format may not be supported.");
            setBuffering(false);
            setPlaying(false);
        };

        const handleCanPlay = () => {
            setBuffering(false);
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("waiting", handleWaiting);
        video.addEventListener("playing", handlePlaying);
        video.addEventListener("error", handleError);
        video.addEventListener("canplay", handleCanPlay);

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("waiting", handleWaiting);
            video.removeEventListener("playing", handlePlaying);
            video.removeEventListener("error", handleError);
            video.removeEventListener("canplay", handleCanPlay);
        };
    }, [currentPodcast, selectedQuality]);

    // Handle fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    // Toggle Play / Pause
    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.error) {
            retryVideoLoad();
            return;
        }

        if (playing) {
            video.pause();
        } else {
            video.play().catch(err => {
                setError("Failed to play video: " + err.message);
                setPlaying(false);
            });
        }
        setPlaying(!playing);
    };

    // Update progress and current time
    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video || !video.duration) return;
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
    };

    // Seek video
    const handleSeek = (e) => {
        const video = videoRef.current;
        if (!video || !video.duration) return;
        const time = (e.target.value / 100) * video.duration;
        video.currentTime = time;
        setProgress(e.target.value);
    };

    // Click to seek on progress bar
    const handleProgressBarClick = (e) => {
        const progressBar = e.currentTarget;
        if (!progressBar || !videoRef.current || !videoRef.current.duration) return;

        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const time = percent * videoRef.current.duration;

        videoRef.current.currentTime = time;
        setProgress(percent * 100);
    };

    // Preview on hover
    const handleProgressHover = (e) => {
        const progressBar = e.currentTarget;
        if (!progressBar || !videoRef.current || !videoRef.current.duration) return;

        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const time = percent * videoRef.current.duration;

        setHoverTime({
            show: true,
            time: time,
            position: e.clientX - rect.left
        });
    };

    // Toggle mute
    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !muted;
        setMuted(!muted);
    };

    // Change volume
    const handleVolumeChange = (e) => {
        const video = videoRef.current;
        if (!video) return;
        const newVolume = parseFloat(e.target.value);
        video.volume = newVolume;
        setVolume(newVolume);
        setMuted(newVolume === 0);
    };

    // Skip forward/backward
    const skip = (seconds) => {
        const video = videoRef.current;
        if (!video || !video.duration) return;
        video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + seconds));
        notify(seconds > 0 ? "⏩ +10s" : "⏪ -10s");
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;

        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // Double click to skip (YouTube style)
    const handleDoubleClick = (e) => {
        const video = videoRef.current;
        if (!video || !video.duration) return;
        const rect = video.getBoundingClientRect();
        const clickX = e.clientX - rect.left;

        if (clickX < rect.width / 2) {
            skip(-10);
        } else {
            skip(10);
        }
    };

    // Change playback rate
    const changePlaybackRate = (rate) => {
        const video = videoRef.current;
        if (!video) return;
        video.playbackRate = rate;
        setPlaybackRate(rate);
        setShowSettings(false);
    };

    // Change video quality
    const changeVideoQuality = (quality) => {
        setSelectedQuality(quality);
        setShowQualityMenu(false);
        setShowSettings(false);

        // Reload the video with the new quality
        setTimeout(() => {
            retryVideoLoad();
        }, 100);
    };

    // Format time (seconds to MM:SS)
    const formatTime = (timeInSeconds) => {
        if (isNaN(timeInSeconds)) return "0:00";
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Retry loading the video
    const retryVideoLoad = () => {
        const video = videoRef.current;
        if (!video) return;

        setError(null);
        setBuffering(true);
        video.load();

        // Try to play after a short delay
        setTimeout(() => {
            video.play().catch(err => {
                setError("Still unable to play video: " + err.message);
                setBuffering(false);
            });
        }, 500);
    };

    // Reload the page if video fails to load
    const reloadPage = () => {
        router.refresh();
    };

    // 🔹 Custom cast button
    const handleCast = () => {
        notify("Casting to device... (demo)");
    };

    if (loading) {
        return (
            <Layout>

                <div className="d-flex justify-content-center align-items-center min-vh-100">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error && !currentPodcast) {
        return (
            <Layout>
                <div className="d-flex justify-content-center align-items-center min-vh-100 flex-column">
                    <div className="alert alert-danger mb-3">Failed to load podcast: {error}</div>
                    <button className="btn btn-primary" onClick={reloadPage}>
                        <BsArrowClockwise className="me-2" />
                        Try Again
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="podcast-theme">
                <ToastContainer />
                <div className="container-fluid pt-4">
                    <div className="row">
                        {/* 🎥 Video Player Section */}
                        <div className="col-lg-8 col-md-12 mb-4">
                            <div className="rounded-4 shadow-lg bg-white position-relative">
                                {/* Video Container with Controls */}
                                <div
                                    ref={containerRef}
                                    className="video-container position-relative"
                                >
                                    {/* Cast Button Overlay */}
                                    <div
                                        className="cast-overlay"
                                        role="button"
                                        onClick={handleCast}
                                    >
                                        <BsCast size={22} />
                                    </div>

                                    <div className="ratio ratio-16x9">
                                        <video
                                            ref={videoRef}
                                            key={`${currentPodcast.id}-${selectedQuality}`}
                                            src={getVideoSource(currentPodcast, selectedQuality)}
                                            poster={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentPodcast.thumbnail}`}
                                            className="w-100 rounded-top-4"
                                            onTimeUpdate={handleTimeUpdate}
                                            onEnded={() => setPlaying(false)}
                                            onDoubleClick={handleDoubleClick}
                                            preload="auto"
                                        />
                                    </div>

                                    {/* Error message */}
                                    {error && (
                                        <div className="video-error-overlay">
                                            <div className="error-content">
                                                <p>{error}</p>
                                                <button onClick={retryVideoLoad} className="retry-btn me-2">
                                                    <BsArrowClockwise /> Retry
                                                </button>
                                                <button onClick={reloadPage} className="retry-btn">
                                                    Reload Page
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Buffering indicator */}
                                    {buffering && (
                                        <div className="buffering-overlay">
                                            <div className="spinner"></div>
                                            <p>Buffering...</p>
                                        </div>
                                    )}

                                    {/* Custom Video Controls - Only on the video area */}
                                    <div className={`controls-overlay ${showControls ? 'visible' : 'hidden'}`}>
                                        {/* Center play button */}
                                        <div className="center-controls">

                                            <button className="skip-btn" onClick={() => skip(-10)}>
                                                <BsSkipBackward size={32} />
                                                <span>10</span>
                                            </button>
                                            <button className="play-pause-btn large" onClick={togglePlay}>
                                                {playing ? <BsPauseFill size={48} /> : <BsPlayFill size={48} />}
                                            </button>
                                            <button className="skip-btn" onClick={() => skip(10)}>
                                                <BsSkipForward size={32} />
                                                <span>10</span>
                                            </button>
                                        </div>

                                        {/* Bottom controls bar */}
                                        <div className="bottom-controls">
                                            {/* Progress bar */}
                                            <div
                                                className="progress-container"
                                                onClick={handleProgressBarClick}
                                                onMouseMove={handleProgressHover}
                                                onMouseLeave={() => setHoverTime({ ...hoverTime, show: false })}
                                            >
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-filled"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={progress || 0}
                                                    onChange={handleSeek}
                                                    className="progress-slider"
                                                />
                                            </div>

                                            {/* Preview on hover */}
                                            {hoverTime.show && (
                                                <div className="preview-time" style={{ left: `${hoverTime.position}px` }}>
                                                    {formatTime(hoverTime.time)}
                                                </div>
                                            )}

                                            <div className="control-buttons">
                                                <div className="left-controls">
                                                    <button className="play-pause-btn" onClick={togglePlay}>
                                                        {playing ? <BsPauseFill size={24} /> : <BsPlayFill size={24} />}
                                                    </button>

                                                    <div className="volume-control">
                                                        <button className="volume-btn" onClick={toggleMute}>
                                                            {muted || volume === 0 ? <BsVolumeMute size={20} /> :
                                                                volume < 0.5 ? <BsVolumeUp size={20} /> : <BsVolumeUp size={20} />}
                                                        </button>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="1"
                                                            step="0.01"
                                                            value={volume}
                                                            onChange={handleVolumeChange}
                                                            className="volume-slider"
                                                        />
                                                    </div>

                                                    <div className="time-display">
                                                        {formatTime(currentTime)} / {formatTime(duration)}
                                                    </div>
                                                </div>

                                                <div className="right-controls">
                                                    <div className="settings-menu">
                                                        <button
                                                            className="settings-btn"
                                                            onClick={() => setShowSettings(!showSettings)}
                                                        >
                                                            <BsGearFill size={20} />
                                                        </button>

                                                        {showSettings && (
                                                            <div className="settings-dropdown">
                                                                <div className="settings-section">
                                                                    <label>Playback Speed</label>
                                                                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                                                        <button
                                                                            key={rate}
                                                                            className={playbackRate === rate ? 'active' : ''}
                                                                            onClick={() => changePlaybackRate(rate)}
                                                                        >
                                                                            {rate}x
                                                                        </button>
                                                                    ))}
                                                                </div>

                                                                <div className="settings-section">
                                                                    <label>Quality</label>
                                                                    {videoQualities.map(quality => (
                                                                        <button
                                                                            key={quality.value}
                                                                            className={selectedQuality === quality.value ? 'active' : ''}
                                                                            onClick={() => changeVideoQuality(quality.value)}
                                                                        >
                                                                            {quality.label}
                                                                            {selectedQuality === quality.value && <BsCheck className="ms-2" />}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button className="fullscreen-btn" onClick={toggleFullscreen}>
                                                        {fullscreen ? <BsFullscreenExit size={20} /> : <BsFullscreen size={20} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Title & Description - Outside the video container */}
                                <div className="p-3">
                                    <h5 className="fw-bold text-dark">{currentPodcast.title}</h5>
                                    <small className="text-muted">
                                        Uploaded on:{" "}
                                        {new Date(currentPodcast.created_at).toLocaleDateString()}
                                    </small>

                                    <p className="text-muted mt-2">
                                        {showmore ? (
                                            <>
                                                {currentPodcast.description.slice(0, 70)}
                                                {currentPodcast.description.length > 70 ? " ..." : ""}
                                                &nbsp;
                                                <a
                                                    className="text-primary"
                                                    role="button"
                                                    onClick={() => setShowMore(false)}
                                                >
                                                    show more
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                {currentPodcast.description}{" "}
                                                <a
                                                    className="text-primary"
                                                    role="button"
                                                    onClick={() => setShowMore(true)}
                                                >
                                                    hide
                                                </a>
                                            </>
                                        )}
                                    </p>

                                    {/* 📊 Stats & Actions */}
                                    <div className="d-flex align-items-center gap-4 mt-3 text-secondary">
                                        <span className="d-flex align-items-center gap-1">
                                            <BsEye /> {Math.floor(Math.random() * 10000)} views
                                        </span>
                                        <span className="d-flex align-items-center gap-1">
                                            <BsHandThumbsUp /> {Math.floor(Math.random() * 500)} likes
                                        </span>
                                        <span className="d-flex align-items-center gap-1">
                                            <BsChatDots /> {Math.floor(Math.random() * 200)} comments
                                        </span>
                                        <span className="d-flex align-items-center gap-1">
                                            <BsShare /> Share
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 🎧 Recommended Podcasts Section */}
                        <div className="col-lg-4 col-md-12 p-3 rounded-4 bg-white">
                            <h5 className="fw-bold text-secondary mb-3">Recommended Podcasts</h5>
                            <div className="list-group border-0">
                                {recommended.map((item, index) => (
                                    <div
                                        key={index}
                                        className="list-group-item border-0 p-2 d-flex align-items-start mb-3 recommended-section"
                                        role="button"
                                        onClick={() => {
                                            setCurrentPodcast(item);
                                            setPlaying(false);
                                            // Generate quality options for the new video
                                            const qualities = generateQualityOptions(item);
                                            setVideoQualities(qualities);
                                            setSelectedQuality('auto');

                                            setTimeout(() => {
                                                const video = videoRef.current;
                                                if (video) {
                                                    video.play().catch(err => {
                                                        setError("Failed to play video: " + err.message);
                                                    });
                                                }
                                            }, 100);
                                        }}
                                    >
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.thumbnail}`}
                                            alt="thumbnail"
                                            className="rounded me-3"
                                            style={{ width: "100px", height: "70px", objectFit: "cover" }}
                                            loading="lazy"
                                        />
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold text-white">{item.title}</h6>
                                            <small className="text-light">
                                                {Math.floor(item.duration / 60)} min •{" "}
                                                {Math.floor(Math.random() * 10000)} views
                                            </small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🎨 Custom CSS */}
                <style jsx>{`
        .podcast-theme {
          background: #f5f5f5;
          min-height: 100vh;
          padding-bottom: 40px;
        }

        .video-container {
          position: relative;
          overflow: hidden;
        }

        .cast-overlay {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          padding: 8px 10px;
          border-radius: 8px;
          cursor: pointer;
          z-index: 10;
          transition: 0.3s;
        }
        .cast-overlay:hover {
          background: rgba(0, 0, 0, 0.8);
        }

        .recommended-section {
          background: linear-gradient(135deg, #b8b5beff, #a5a6acff, #f6f9fcff);
        }

        .rec-card {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          transition: all 0.3s ease;
          color: #000;
        }
        .rec-card:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.03);
        }

        /* Custom Video Player Styles */
        .controls-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
          opacity: 1;
          transition: opacity 0.3s ease;
          z-index: 5;
        }
        
        .controls-overlay.hidden {
          opacity: 0;
          pointer-events: none;
        }
        
        .center-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          flex: 1;
        }
        
        .bottom-controls {
          padding: 16px;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
        }
        
        .control-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }
        
        .left-controls, .right-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .controls-overlay button {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .controls-overlay button:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .play-pause-btn.large {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 70px;
          height: 70px;
        }
        
        .skip-btn {
          flex-direction: column;
          font-size: 12px;
          opacity: 0.8;
          color: white;
        }
        
        .skip-btn:hover {
          opacity: 1;
        }
        
        .progress-container {
          position: relative;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          cursor: pointer;
        }
        
        .progress-bar {
          height: 100%;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 2px;
          width: 100%;
        }
        
        .progress-filled {
          height: 100%;
          background: #ff0000;
          border-radius: 2px;
          width: 0%;
        }
        
        .progress-slider {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 10;
        }
        
        .volume-control {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .volume-slider {
          width: 80px;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.3);
          outline: none;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        .volume-control:hover .volume-slider {
          opacity: 1;
        }
        
        .time-display {
          color: white;
          font-size: 14px;
          font-family: Arial, sans-serif;
        }
        
        .settings-menu {
          position: relative;
        }
        
        .settings-dropdown {
          position: absolute;
          bottom: 40px;
          right: 0;
          background: rgba(28, 28, 28, 0.9);
          border-radius: 8px;
          padding: 12px;
          width: 160px;
          z-index: 100;
        }
        
        .settings-section {
          margin-bottom: 12px;
        }
        
        .settings-section label {
          display: block;
          color: white;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .settings-section button {
          width: 100%;
          text-align: left;
          justify-content: flex-start;
          padding: 8px 12px;
          margin-bottom: 4px;
          border-radius: 4px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .settings-section button.active {
          background: rgba(255, 0, 0, 0.7);
        }
        
        .preview-time {
          position: absolute;
          bottom: 25px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
          transform: translateX(-50%);
        }
        
        /* Buffering indicator */
        .buffering-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 15;
          color: white;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 16px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Error overlay */
        .video-error-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 20;
          color: white;
        }
        
        .error-content {
          text-align: center;
          padding: 20px;
          max-width: 80%;
        }
        
        .retry-btn {
          background: #4361ee;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin-top: 15px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 8px 5px 0;
        }
        
        .retry-btn:hover {
          background: #3a0ca3;
        }
        
        @media (max-width: 768px) {
          .center-controls {
            gap: 20px;
          }
          
          .play-pause-btn.large {
            width: 60px;
            height: 60px;
          }
          
          .skip-btn {
            font-size: 10px;
          }
          
          .time-display {
            font-size: 12px;
          }
        }
      `}</style>
            </div>
        </Layout>
    );
} 