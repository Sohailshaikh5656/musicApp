// app/(admin)/dashboard/page.jsx   (example path)
// or pages/admin/dashboard.jsx
"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar, Line, Pie } from "react-chartjs-2"

// register chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function DummyData() {
  // --- UI state
  const [activeRange, setActiveRange] = useState("today") // today | week | month
  const [showSection, setShowSection] = useState(null) // null or 'users'|'songs' etc.
  const [onlineCount, setOnlineCount] = useState(12) // simulated live
  // simulate live fluctuation
  useEffect(() => {
    const t = setInterval(() => {
      setOnlineCount(c => Math.max(1, c + (Math.random() > 0.5 ? 1 : -1)))
    }, 3500)
    return () => clearInterval(t)
  }, [])
    // Dummy summary stats
    const stats = {
        users: 6789,
        songs: 12345,
        artists: 234,
        categories: 12,
        playlists: 98,
        visitorsToday: 432,
    }
  // Recent lists (last 5)
  const recentLogins = [
    { id: 1, name: "Sohel", email: "sohel@example.com", time: "2m ago" },
    { id: 2, name: "Amit", email: "amit@example.com", time: "12m ago" },
    { id: 3, name: "Neha", email: "neha@example.com", time: "35m ago" },
    { id: 4, name: "Riya", email: "riya@example.com", time: "1h ago" },
    { id: 5, name: "Vikram", email: "vikram@example.com", time: "3h ago" },
  ]

  const recentSongs = [
    { id: 1, title: "Melody Love", artist: "Arijit", uploaded: "3h ago", plays: 120 },
    { id: 2, title: "Sunrise Beat", artist: "DJ Neo", uploaded: "7h ago", plays: 95 },
    { id: 3, title: "Raat Ki Rani", artist: "Anya", uploaded: "1d ago", plays: 330 },
    { id: 4, title: "Highway", artist: "Ed Sheeran", uploaded: "2d ago", plays: 215 },
    { id: 5, title: "City Lights", artist: "The Weeknd", uploaded: "3d ago", plays: 410 },
  ]

  const topSongs = [
    { id: 1, title: "City Lights", plays: 410 },
    { id: 2, title: "Raat Ki Rani", plays: 330 },
    { id: 3, title: "Melody Love", plays: 120 },
    { id: 4, title: "Highway", plays: 215 },
    { id: 5, title: "Sunrise Beat", plays: 95 },
  ]

  const topArtists = [
    { id: 1, name: "Arijit Singh", plays: 12000 },
    { id: 2, name: "Taylor Swift", plays: 9800 },
    { id: 3, name: "Drake", plays: 8600 },
    { id: 4, name: "Shreya Ghoshal", plays: 6100 },
    { id: 5, name: "Ed Sheeran", plays: 5800 },
  ]

  const categories = [
    { name: "Pop", value: 40 },
    { name: "Rock", value: 25 },
    { name: "HipHop", value: 15 },
    { name: "Jazz", value: 12 },
    { name: "Classical", value: 8 },
  ]

  // Chart datasets (simple / change by range if needed)
  const loginActivity = useMemo(() => {
    if (activeRange === "today") {
      return {
        labels: ["0am","4am","8am","12pm","4pm","8pm","11pm"],
        datasets: [{ label: "Logins", data: [5,8,12,20,15,10,6], borderColor: "#0d6efd", backgroundColor: "rgba(13,110,253,0.2)", fill:true }],
      }
    } else if (activeRange === "week") {
      return {
        labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
        datasets: [{ label: "Logins", data: [120,180,160,220,200,330,300], borderColor:"#0d6efd", backgroundColor:"rgba(13,110,253,0.15)", fill:true }],
      }
    } else {
      // month
      return {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"],
        datasets: [{ label: "Logins", data: [1200,1500,1400,1850,2000,2300,2400,2600], borderColor:"#0d6efd", backgroundColor:"rgba(13,110,253,0.12)", fill:true }],
      }
    }
  }, [activeRange])

  const songsUploads = useMemo(() => ({
    labels: ["Jan","Feb","Mar","Apr","May","Jun"],
    datasets:[{ label:"Songs Uploaded", data: [120,150,180,200,250,300], backgroundColor:"#198754" }]
  }), [])

  const genrePie = useMemo(() => ({
    labels: categories.map(c=>c.name),
    datasets:[{ data: categories.map(c=>c.value), backgroundColor: ["#0d6efd","#dc3545","#ffc107","#198754","#6f42c1"] }]
  }), [categories])

  // visitors graph
  const visitors = useMemo(()=>({
    labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    datasets:[{ label:"Visitors", data:[120, 180, 170, 200, 240, 300, 280], backgroundColor:"#6f42c1" }]
  }), [])

  // system notifications dummy
  const notifications = [
    { id:1, text:"2 new songs awaiting approval", type:"info" },
    { id:2, text:"Storage used 82% - consider cleaning", type:"warning" },
    { id:3, text:"Server patch available", type:"alert" },
  ]

  // quick actions
  const quickActions = [
    { id:1, label:"Add User", onClick:()=>alert("Add User clicked") },
    { id:2, label:"Upload Song", onClick:()=>alert("Upload Song clicked") },
    { id:3, label:"Approve Songs", onClick:()=>alert("Approve clicked") },
  ]

  // small helper for linear gradient classes
  const cardClass = (extra="") => `adminForm p-3 ${extra}`

  return (
    <div className="p-4">

      {/* ---- Below main cards: Activity Overview + Music Insights + Artists/Categories + Playlists + Visitors + System ---- */}
      {/* Activity Overview */}
      <div className={cardClass("mb-4")}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="m-0">Activity Overview</h5>
          <div className="d-flex align-items-center gap-2">
            <select className="form-select form-select-sm" style={{width:140}} value={activeRange} onChange={(e)=>setActiveRange(e.target.value)}>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button className="btn btn-outline-secondary btn-sm" onClick={()=>setShowSection(null)}>Reset</button>
          </div>
        </div>

        <div className="row g-3">
          {/* Left: recent logins + small stats */}
          <div className="col-lg-4">
            <div className="adminForm p-3 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-secondary small">Currently Online</div>
                  <div className="fw-bold fs-4">{onlineCount}</div>
                </div>
                <div>
                  <button className="btn btn-sm btn-success" onClick={()=>setOnlineCount(c=>c+1)}>+1</button>
                </div>
              </div>
            </div>

            <div className="adminForm p-3">
              <div className="text-secondary small mb-2">Recent Logins (last 5)</div>
              <ul className="list-unstyled mb-0">
                {recentLogins.map(u=>(
                  <li key={u.id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                    <div>
                      <div className="fw-semibold">{u.name}</div>
                      <div className="small text-muted">{u.email}</div>
                    </div>
                    <div className="small text-muted">{u.time}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Middle: login activity graph */}
          <div className="col-lg-5">
            <div className="adminForm p-3 h-100">
              <div className="d-flex justify-content-between mb-2 align-items-center">
                <div className="text-secondary small">Login activity ({activeRange})</div>
                <div className="small text-muted">Total: { loginActivity.datasets[0].data.reduce((a,b)=>a+b,0) }</div>
              </div>
              <Line data={loginActivity} />
            </div>
          </div>

          {/* Right: summary cards */}
          <div className="col-lg-3">
            <div className="adminForm p-3 mb-3 text-center">
              <div className="text-secondary small">New Users Today</div>
              <div className="fw-bold fs-4">{Math.floor(Math.random()*120)}</div>
              <div className="small text-muted">Compared to yesterday</div>
            </div>
            <div className="adminForm p-3 text-center">
              <div className="text-secondary small">Returning Users</div>
              <div className="fw-bold fs-4">{Math.floor(Math.random()*500)}</div>
              <div className="small text-muted">This week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Songs & Music Insights */}
      <div className={cardClass("mb-4")}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="m-0">Songs & Music Insights</h5>
          <div className="text-secondary small">Top & Recent</div>
        </div>

        <div className="row g-3">
          <div className="col-lg-4">
            <div className="adminForm p-3 h-100">
              <div className="text-secondary small mb-2">Most Played Songs (Top 5)</div>
              <ol className="mb-0">
                {topSongs.map(s=>(
                  <li key={s.id} className="py-1 d-flex justify-content-between">
                    <span>{s.title}</span>
                    <span className="text-muted">{s.plays} plays</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="adminForm p-3 mt-3">
              <div className="text-secondary small mb-2">Recently Added Songs</div>
              <ul className="list-unstyled mb-0">
                {recentSongs.map(s=>(
                  <li key={s.id} className="py-2 border-bottom d-flex justify-content-between">
                    <div>
                      <div className="fw-semibold">{s.title}</div>
                      <div className="small text-muted">{s.artist}</div>
                    </div>
                    <div className="small text-muted">{s.uploaded}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="adminForm p-3 h-100">
              <div className="text-secondary small mb-2">Songs uploaded (month-wise)</div>
              <Bar data={songsUploads} />
            </div>
          </div>

          <div className="col-lg-3">
            <div className="adminForm p-3 h-100">
              <div className="text-secondary small mb-2">Genre Distribution</div>
              <Pie data={genrePie} />
            </div>
          </div>
        </div>
      </div>

      {/* Artists & Categories */}
      <div className={cardClass("mb-4")}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="m-0">Artists & Categories</h5>
          <div className="text-secondary small">Top performers & category spread</div>
        </div>
        <div className="row g-3">
          <div className="col-lg-6">
            <div className="adminForm p-3 h-100">
              <div className="text-secondary small mb-2">Top Artists</div>
              <ul className="list-unstyled mb-0">
                {topArtists.map(a=>(
                  <li key={a.id} className="py-2 d-flex justify-content-between border-bottom">
                    <div>{a.name}</div>
                    <div className="small text-muted">{a.plays.toLocaleString()} plays</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="adminForm p-3 h-100">
              <div className="text-secondary small mb-2">Category Popularity</div>
              <Bar data={{
                labels: categories.map(c=>c.name),
                datasets:[{ label:"Songs", data: categories.map(c=>c.value*10), backgroundColor:["#0d6efd","#dc3545","#ffc107","#198754","#6f42c1"] }]
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Playlists */}
      <div className={cardClass("mb-4")}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="m-0">Playlists</h5>
          <div className="text-secondary small">Popularity & recent</div>
        </div>
        <div className="row g-3">
          <div className="col-lg-6">
            <div className="adminForm p-3 h-100">
              <div className="text-secondary small mb-2">Most Liked Playlists</div>
              <ol className="mb-0">
                <li className="py-2 d-flex justify-content-between">Chill Vibes <span className="text-muted">12.3k likes</span></li>
                <li className="py-2 d-flex justify-content-between">Workout Mix <span className="text-muted">9.1k likes</span></li>
                <li className="py-2 d-flex justify-content-between">Retro Hits <span className="text-muted">7.4k likes</span></li>
              </ol>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="adminForm p-3 h-100">
              <div className="text-secondary small mb-2">Playlist growth</div>
              <Line data={{
                labels:["Jan","Feb","Mar","Apr","May","Jun"],
                datasets:[{ label:"Playlists created", data:[5,10,8,12,15,18], borderColor:"#7e57c2", backgroundColor:"rgba(126,87,194,0.12)", fill:true }]
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Visitors / Traffic */}
      <div className={cardClass("mb-4")}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="m-0">Visitors / Traffic</h5>
          <div className="text-secondary small">Today / Weekly</div>
        </div>
        <div className="row g-3">
          <div className="col-lg-8">
            <div className="adminForm p-3 h-100">
              <div className="text-secondary small mb-2">Daily vs Weekly visitors</div>
              <Bar data={visitors} />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="adminForm p-3 h-100 text-center">
              <div className="text-secondary small">Today's Visitors</div>
              <div className="fw-bold fs-3">{stats.visitorsToday}</div>
              <div className="mt-3">
                {/* Dummy world map image */}
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" alt="world map" style={{width:"100%",maxHeight:160,objectFit:"contain",opacity:0.9}} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Notifications / Quick Actions */}
      <div className={cardClass("mb-4")}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="m-0">System / Notifications</h5>
          <div className="text-secondary small">Admin actions</div>
        </div>

        <div className="row g-3">
          <div className="col-lg-6">
            <div className="adminForm p-3">
              <div className="text-secondary small mb-2">Notifications</div>
              <ul className="list-unstyled mb-0">
                {notifications.map(n=>(
                  <li key={n.id} className="py-2 border-bottom d-flex justify-content-between align-items-center">
                    <div>{n.text}</div>
                    <div className="small text-muted">{n.type}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="adminForm p-3 h-100">
              <div className="text-secondary small mb-2">Quick Actions</div>
              <div className="d-flex gap-2 flex-wrap">
                {quickActions.map(a=>(
                  <button key={a.id} className="btn btn-sm btn-outline-primary" onClick={a.onClick}>{a.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* adminForm CSS (glass + subtle inset shadow to look embedded in cloth) */}
      <style jsx>{`
        .adminForm {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow:
            inset 6px 6px 14px rgba(0,0,0,0.12),
            inset -6px -6px 14px rgba(255,255,255,0.03),
            6px 6px 18px rgba(0,0,0,0.06);
          color: #111;
        }

        /* make inner cards equal height in their row */
        .h-100 { height: 100%; }

        /* small responsive tweaks */
        @media (max-width: 767px) {
          .adminForm { padding: 12px; }
        }
      `}</style>
    </div>
  )
}
