'use client';
import Navbar from "../../common/navbar";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useRef, useState, useEffect } from 'react';
import { useSession,signOut, signIn } from "next-auth/react"
const SongCardPlayer = () => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const {data:session} = useSession();
    let auth = {
        isAuth : false,
        name : null,
        email : null,
        image : null
    }
    if(session?.user){
        console.log("Session : ",session?.user)
        auth = {
            isAuth : true,
            name : session.user.username,
            email : session.user.email,
            image : session.user.image
        }
    }
  const song = {
    title: 'My Awesome Song',
    file: '/assets/user/audio/Labon Ko - Bhool Bhulaiyaa 320 Kbps.mp3',
    cover: '/assets/user/images/song.jpg'
  };

  useEffect(() => {
    const audio = audioRef.current;

    // Force mute to allow autoplay
    audio.muted = true;

    audio
      .play()
      .then(() => {
        setPlaying(true);
        console.log("Muted autoplay successful");
      })
      .catch((err) => {
        console.warn("Muted autoplay blocked:", err.message);
      });

    // Listen for user interaction to unmute + continue playback
    const unmuteAndPlay = () => {
      audio.muted = false;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(err => console.warn("Play failed:", err));
      window.removeEventListener('click', unmuteAndPlay);
      window.removeEventListener('keydown', unmuteAndPlay);
    };

    window.addEventListener('click', unmuteAndPlay);
    window.addEventListener('keydown', unmuteAndPlay);

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => {
      window.removeEventListener('click', unmuteAndPlay);
      window.removeEventListener('keydown', unmuteAndPlay);
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.warn("Play error:", err.message));
    }
    setPlaying(!playing);
  };

  const seek = (e) => {
    const value = (e.target.value / 100) * duration;
    audioRef.current.currentTime = value;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const forward10 = () => {
    audioRef.current.currentTime += 10;
  };

  const back10 = () => {
    audioRef.current.currentTime -= 10;
  };

  return (
    <>
    {auth.email}
      <Navbar />
      <div style={styles.card} className="bg-dark">
        <audio ref={audioRef} src={song.file} />
        <img src={song.cover} alt="Cover" style={styles.cover} />
        <h3 style={styles.title}>{song.title}</h3>
        <input
          type="range"
          min="0"
          max="100"
          value={duration ? (progress / duration) * 100 : 0}
          onChange={seek}
          style={styles.slider}
        />
        <div style={styles.timeRow}>
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div style={styles.controls}>
          <div onDoubleClick={back10} title="Back 10s"><i className="bi bi-skip-backward-fill"></i></div>
          <div onClick={togglePlay} title="Play / Pause" style={{ fontSize: 30 }}>
            {playing ? <i className="bi bi-pause-circle-fill"></i> : <i className="bi bi-play-circle-fill"></i>}
          </div>
          <div onDoubleClick={forward10} title="Forward 10s"><i className="bi bi-skip-forward-fill"></i></div>
        </div>
        <small style={{ color: '#ccc' }}>Double tap ▶️ to toggle play/pause</small>
      </div>
    </>
  );
};

const styles = {
  card: {
    width: '350px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.15)',
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'sans-serif',
  },
  cover: {
    width: '100%',
    height: '200px',
    borderRadius: '12px',
    objectFit: 'cover',
    marginBottom: '15px',
  },
  title: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  slider: {
    width: '100%',
  },
  timeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    margin: '5px 0 10px',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    fontSize: '25px',
    cursor: 'pointer',
    margin: '10px 0',
  },
};

export default SongCardPlayer;
