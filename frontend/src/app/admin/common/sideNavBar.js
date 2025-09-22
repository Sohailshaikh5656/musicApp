"use client"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

// React 3D / colorful icons
import { MdSpaceDashboard } from "react-icons/md"
import { FaUsers, FaUserSlash, FaUserCheck } from "react-icons/fa"
import { GiMusicalNotes } from "react-icons/gi"
import { RiPlayListFill, RiLogoutBoxRFill } from "react-icons/ri"
import { FaMusic, FaGuitar } from "react-icons/fa6"
import { AiFillStar } from "react-icons/ai"
import { BiSolidCategory } from "react-icons/bi"
import { FaFileWord } from "react-icons/fa"
import { RiMic2Fill } from "react-icons/ri"
import { FaBookOpen } from "react-icons/fa"

const SideNavBar = () => {
    const router = useRouter()
    const pathname = usePathname()

    const logout = async () => {
        try {
            document.cookie = 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            await fetch('/api/logout');
            router.push('/admin/login');
        } catch (error) {
            console.error(error);
        }
    }

    const isActive = (urls = []) => {
        return urls.some(url => pathname.startsWith(url));
    };

    useEffect(() => {
        const subMenus = document.querySelectorAll(".collapse");
        subMenus.forEach(menu => {
            if (pathname.includes(menu.id.replace("SubMenu", "").toLowerCase())) {
                menu.classList.add("show");
            }
        });
    }, [pathname]);

    return (
        <div className="col-lg-2 col-sm-3 col-md-3 col-3 header d-flex flex-column justify-content-between min-vh-100 sidebar-custom">
            <div>
                {/* Profile Section */}
                <div className="row">
                    <div className="col-12 mx-auto">
                        <div className="d-flex align-items-center mb-4 p-2 rounded profile-section">
                            <img
                                src="/assets/admin/images/logo.png"
                                alt="Music Admin"
                                className="rounded-circle profile-img"
                                height={60}
                                width={60}
                            />
                            <div className="d-flex flex-column profile-text">
                                <span className="fw-bold">Sohail Shaikh</span>
                                <small className="text-muted">Administrator</small>
                            </div>
                        </div>

                        {/* Nav Items */}
                        <nav style={{ paddingTop: "-30px", marginTop: "-60px" }}>
                            <ul className="list-unstyled nav-items">
                                <li>
                                    <Link href="/admin/dashboard" className="text-decoration-none nav-link-custom">
                                        <MdSpaceDashboard size={22} color="#ff6f61" />
                                        <span className="nav-text">&nbsp;&nbsp;Dashboard</span>
                                    </Link>
                                </li>

                                {/* Users */}
                                <li className="sub-nav-bg">
                                    <a data-bs-toggle="collapse" href="#userSubMenu"
                                        aria-expanded={isActive(["/admin/allUser"])}
                                        aria-controls="userSubMenu"
                                        className="text-decoration-none nav-link-custom">
                                        <FaUsers size={22} color="#2196f3" />
                                        <span className="nav-text">&nbsp;&nbsp;Users</span>
                                    </a>
                                    <ul className={`collapse list-unstyled ps-4 ${isActive(["/admin/allUser"]) ? "show" : ""}`} id="userSubMenu">
                                        <li><Link href="/admin/allUser"><FaUsers size={18} color="#4caf50" /> <span className="nav-text">&nbsp;&nbsp;All Users</span></Link></li>
                                        <li><a href="#"><FaUserSlash size={18} color="#f44336" /> <span className="nav-text">&nbsp;&nbsp;Blocked Users</span></a></li>
                                        <li><a href="#"><FaUserCheck size={18} color="#00bcd4" /> <span className="nav-text">&nbsp;&nbsp;Unblocked Users</span></a></li>
                                        <li><a href="#"><RiPlayListFill size={18} color="#ff9800" /> <span className="nav-text">&nbsp;&nbsp;Playlists</span></a></li>
                                    </ul>
                                </li>

                                {/* Songs */}
                                <li className="sub-nav-bg">
                                    <a data-bs-toggle="collapse" href="#songSubMenu"
                                        aria-expanded={isActive(["/admin/addSong", "/admin/allSong"])}
                                        aria-controls="songSubMenu"
                                        className="text-decoration-none nav-link-custom">
                                        <GiMusicalNotes size={22} color="#9c27b0" />
                                        <span className="nav-text">&nbsp;&nbsp;Songs</span>
                                    </a>
                                    <ul className={`collapse list-unstyled ps-4 ${isActive(["/admin/addSong", "/admin/allSong"]) ? "show" : ""}`} id="songSubMenu">
                                        <li><Link href={"/admin/addSong"}><FaMusic size={18} color="#e91e63" /> <span className="nav-text">&nbsp;&nbsp;Add Song</span></Link></li>
                                        <li><Link href={'/admin/allSong'}><FaMusic size={18} color="#3f51b5" /> <span className="nav-text">&nbsp;&nbsp;All Songs</span></Link></li>
                                    </ul>
                                </li>

                                {/* Artists */}
                                <li className="sub-nav-bg">
                                    <a data-bs-toggle="collapse" href="#artist"
                                        aria-expanded={isActive(["/admin/artist", "/admin/allArtist"])}
                                        aria-controls="artist"
                                        className="text-decoration-none nav-link-custom">
                                        <FaGuitar size={22} color="#673ab7" />
                                        <span className="nav-text">&nbsp;&nbsp;Artists</span>
                                    </a>
                                    <ul className={`collapse list-unstyled ps-4 ${isActive(["/admin/artist", "/admin/allArtist"]) ? "show" : ""}`} id="artist">
                                        <li><Link href={"/admin/artist"}><FaGuitar size={18} color="#009688" /> <span className="nav-text">&nbsp;&nbsp;Add Artist</span></Link></li>
                                        <li><Link href={"/admin/allArtist"}><FaGuitar size={18} color="#ff5722" /> <span className="nav-text">&nbsp;&nbsp;All Artist</span></Link></li>
                                    </ul>
                                </li>

                                {/* Category */}
                                <li className="sub-nav-bg">
                                    <a data-bs-toggle="collapse" href="#category"
                                        aria-expanded={isActive(["/admin/addCategory", "/admin/allCategory"])}
                                        aria-controls="category"
                                        className="text-decoration-none nav-link-custom">
                                        <BiSolidCategory size={22} color="#795548" />
                                        <span className="nav-text">&nbsp;&nbsp;Category</span>
                                    </a>
                                    <ul className={`collapse list-unstyled ps-4 ${isActive(["/admin/addCategory", "/admin/allCategory"]) ? "show" : ""}`} id="category">
                                        <li><Link href={"/admin/addCategory"}><BiSolidCategory size={18} color="#607d8b" /> <span className="nav-text">&nbsp;&nbsp;Add Category</span></Link></li>
                                        <li><Link href={"/admin/allCategory"}><BiSolidCategory size={18} color="#8bc34a" /> <span className="nav-text">&nbsp;&nbsp;All Category</span></Link></li>
                                    </ul>
                                </li>

                                {/* Featured Playlist */}
                                <li className="sub-nav-bg">
                                    <a data-bs-toggle="collapse" href="#featuredPlaylist"
                                        aria-expanded={isActive(["/admin/addFeaturedPlaylist", "/admin/featuredSongs", "/admin/allFeaturedPlaylist"])}
                                        aria-controls="featuredPlaylist"
                                        className="text-decoration-none nav-link-custom">
                                        <AiFillStar size={22} color="#ffc107" />
                                        <span className="nav-text">&nbsp;&nbsp;Featured Playlist</span>
                                    </a>
                                    <ul className={`collapse list-unstyled ps-4 ${isActive(["/admin/addFeaturedPlaylist", "/admin/featuredSongs", "/admin/allFeaturedPlaylist"]) ? "show" : ""}`} id="featuredPlaylist">
                                        <li><Link href={"/admin/addFeaturePlaylist"}><AiFillStar size={18} color="#9c27b0" /> <span className="nav-text">&nbsp;&nbsp;Add Featured Playlist</span></Link></li>
                                        <li><Link href={"/admin/addSongToFeaturePlayList"}><GiMusicalNotes size={18} color="#00bcd4" /> <span className="nav-text">&nbsp;&nbsp;Add Songs</span></Link></li>
                                        <li><Link href={"/admin/allFeaturePlayList"}><RiPlayListFill size={18} color="#ff5722" /> <span className="nav-text">&nbsp;&nbsp;All Featured Playlists</span></Link></li>
                                    </ul>
                                </li>
                                {/* Podcast */}
                                <li className="sub-nav-bg">
                                    <a data-bs-toggle="collapse" href="#podCast"
                                        aria-expanded={isActive(["/admin/addPodcast", "/admin/allPodcast"])}
                                        aria-controls="podCast"
                                        className="text-decoration-none nav-link-custom">
                                        <RiMic2Fill size={22} color="#ff5722" />
                                        <span className="nav-text">&nbsp;&nbsp;Podcast</span>
                                    </a>
                                    <ul className={`collapse list-unstyled ps-4 ${isActive(["/admin/addPodcast", "/admin/allPodcast"]) ? "show" : ""}`} id="podCast">
                                        <li>
                                            <Link href={"/admin/addPodcast"}>
                                                <RiMic2Fill size={18} color="#9c27b0" />
                                                <span className="nav-text">&nbsp;&nbsp;Add Podcast</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={"/admin/allPodcast"}>
                                                <RiMic2Fill size={18} color="#00bcd4" />
                                                <span className="nav-text">&nbsp;&nbsp;All Podcast</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                                {/* Story */}
                                <li className="sub-nav-bg">
                                    <a data-bs-toggle="collapse" href="#story"
                                        aria-expanded={isActive(["/admin/addStory", "/admin/allStory"])}
                                        aria-controls="story"
                                        className="text-decoration-none nav-link-custom">
                                        <FaBookOpen size={22} color="#4caf50" />
                                        <span className="nav-text">&nbsp;&nbsp;Story</span>
                                    </a>
                                    <ul className={`collapse list-unstyled ps-4 ${isActive(["/admin/addStory", "/admin/allStory"]) ? "show" : ""}`} id="story">
                                        <li>
                                            <Link href={"/admin/addStory"}>
                                                <FaBookOpen size={18} color="#ff9800" />
                                                <span className="nav-text">&nbsp;&nbsp;Add Story</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={"/admin/allStory"}>
                                                <FaBookOpen size={18} color="#3f51b5" />
                                                <span className="nav-text">&nbsp;&nbsp;All Stories</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>


                                {/* Docx */}
                                <li>
                                    <Link href={"/admin/docx"} className="text-decoration-none nav-link-custom">
                                        <FaFileWord size={22} color="#0078d4" />
                                        <span className="nav-text">&nbsp;&nbsp;Docx</span>
                                    </Link>
                                </li>

                                <li>
                                    <span><MdSpaceDashboard size={22} color="#607d8b" /> <span className="nav-text">&nbsp;&nbsp;Activity logs</span></span>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Logout at Bottom */}
            <div className="mb-3">
                <a onClick={logout} className="no-style-link nav-link-custom" style={{ cursor: "pointer" }}>
                    <RiLogoutBoxRFill size={22} color="#f44336" />
                    <span className="nav-text">&nbsp;&nbsp;Logout</span>
                </a>
            </div>
        </div>
    )
}

export default SideNavBar
