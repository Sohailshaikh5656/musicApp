"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
const MainCards = () =>{
    const cardClass = (extra="") => `adminForm p-3 ${extra}`
    const [onlineCount, setOnlineCount] = useState(12)
    // Dummy summary stats
    const stats = {
        users: 6789,
        songs: 12345,
        artists: 234,
        categories: 12,
        playlists: 98,
        visitorsToday: 432,
    }
    return (
        <>
        {/* Top: Main cards */}
            <div className="row g-3 mb-4">
                    <div className="col-lg-3 col-md-6">
                      <div className={cardClass("h-100")} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setShowSection("users")}>
                        <img src="https://img.icons8.com/3d-fluency/94/user-male-circle.png" alt="users" width="56" height="56" />
                        <div>
                          <div className="text-secondary small">Total Users</div>
                          <div className="fw-bold fs-4">{stats.users.toLocaleString()}</div>
                          <div className="small text-muted">+{Math.floor(Math.random()*300)} new this month</div>
                        </div>
                        <div style={{marginLeft:"auto"}}>
                          <span className="badge bg-success">Online {onlineCount}</span>
                        </div>
                      </div>
                    </div>
            
                    <div className="col-lg-3 col-md-6">
                      <div className={cardClass("h-100")} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setShowSection("songs")}>
                        <img src="https://img.icons8.com/3d-fluency/94/musical-notes.png" alt="songs" width="56" height="56" />
                        <div>
                          <div className="text-secondary small">Total Songs</div>
                          <div className="fw-bold fs-4">{stats.songs.toLocaleString()}</div>
                          <div className="small text-muted">+{Math.floor(Math.random()*1500)} uploads this month</div>
                        </div>
                        <div style={{marginLeft:"auto"}}>
                          <span className="badge bg-primary">Top genre: Pop</span>
                        </div>
                      </div>
                    </div>
            
                    <div className="col-lg-2 col-md-6">
                      <div className={cardClass("h-100")} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setShowSection("artists")}>
                        <img src="https://img.icons8.com/3d-fluency/94/micro.png" alt="artists" width="56" height="56" />
                        <div>
                          <div className="text-secondary small">Total Artists</div>
                          <div className="fw-bold fs-4">{stats.artists}</div>
                          <div className="small text-muted">+{Math.floor(Math.random()*20)} new</div>
                        </div>
                      </div>
                    </div>
            
                    <div className="col-lg-2 col-md-6">
                      <div className={cardClass("h-100")} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setShowSection("categories")}>
                        <img src="https://img.icons8.com/3d-fluency/94/folder-invoices.png" alt="categories" width="56" height="56" />
                        <div>
                          <div className="text-secondary small">Categories</div>
                          <div className="fw-bold fs-4">{stats.categories}</div>
                          <div className="small text-muted">Top: Pop</div>
                        </div>
                      </div>
                    </div>
            
                    <div className="col-lg-2 col-md-6">
                      <div className={cardClass("h-100")} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setShowSection("playlists")}>
                        <img src="https://img.icons8.com/3d-fluency/94/playlist.png" alt="playlists" width="56" height="56" />
                        <div>
                          <div className="text-secondary small">Playlists</div>
                          <div className="fw-bold fs-4">{stats.playlists}</div>
                          <div className="small text-muted">Most liked: Chill Vibes</div>
                        </div>
                      </div>
                    </div>
                  </div>
        </>
    )
}

export default MainCards