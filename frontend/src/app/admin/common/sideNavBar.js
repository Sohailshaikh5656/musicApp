"use client"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

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

    // Function to check if submenu should stay open
    const isActive = (urls = []) => {
        return urls.some(url => pathname.startsWith(url));
    };

    useEffect(() => {
        // Open submenus if current URL matches
        const subMenus = document.querySelectorAll(".collapse");
        subMenus.forEach(menu => {
            if (pathname.includes(menu.id.replace("SubMenu", "").toLowerCase())) {
                menu.classList.add("show");
            }
        });
    }, [pathname]);

    return (
        <div className="col-lg-2 col-sm-3 col-md-3 col-3 header d-flex flex-column justify-content-between min-vh-100">
            <div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 mx-auto">
                        <div className="d-flex align-items-center mb-3">
                            <a>
                                <img src="/assets/admin/images/logo.png" alt="No image" className="side-nav-image" />
                            </a>
                            <span className="side-name">Sohail Shaikh</span>
                        </div>
                        <nav>
                            <ul>
                                <li><i className="bi bi-speedometer"></i>&nbsp;&nbsp;Dashboard</li>

                                {/* Users */}
                                <li className="sub-nav-bg">
                                    <a data-bs-toggle="collapse" href="#userSubMenu"
                                        aria-expanded={isActive(["/admin/allUser"])}
                                        aria-controls="userSubMenu"
                                        className="text-decoration-none">
                                        <i className="bi bi-people-fill"></i>&nbsp;&nbsp;Users
                                    </a>
                                    <ul className={`collapse list-unstyled ps-4 ${isActive(["/admin/allUser"]) ? "show" : ""}`} id="userSubMenu">
                                        <li><Link href="/admin/allUser" className="text-decoration-none"><i className="bi bi-person-circle"></i>&nbsp;&nbsp;All Users</Link></li>
                                        <li><a href="#" className="text-decoration-none"><i className="bi bi-slash-circle"></i>&nbsp;&nbsp;Blocked Users</a></li>
                                        <li><a href="#" className="text-decoration-none"><i className="bi bi-person-check-fill"></i>&nbsp;&nbsp;Unblocked Users</a></li>
                                        <li><a href="#" className="text-decoration-none"><i className="bi bi-music-note-list"></i>&nbsp;&nbsp;Playlists</a></li>
                                    </ul>
                                </li>

                                {/* Songs */}
                                <li className="sub-nav-bg">
                                    <a data-bs-toggle="collapse" href="#songSubMenu"
                                        aria-expanded={isActive(["/admin/addSong", "/admin/allSong"])}
                                        aria-controls="songSubMenu"
                                        className="text-decoration-none">
                                        <i className="bi bi-file-music-fill"></i>&nbsp;&nbsp;Songs
                                    </a>
                                    <ul className={`collapse list-unstyled ps-4 ${isActive(["/admin/addSong", "/admin/allSong"]) ? "show" : ""}`} id="songSubMenu">
                                        <li><Link href={"/admin/addSong"} className="text-decoration-none"><i className="bi bi-file-earmark-plus-fill"></i>&nbsp;&nbsp;Add Song</Link></li>
                                        <li><Link href={'/admin/allSong'} className="text-decoration-none"><i className="bi bi-file-earmark-music-fill"></i>&nbsp;&nbsp;All Songs</Link></li>
                                    </ul>
                                </li>

                                {/* Artists */}
                                <li className="sub-nav-bg">
                                    <a data-bs-toggle="collapse" href="#artist"
                                        aria-expanded={isActive(["/admin/artist", "/admin/allArtist"])}
                                        aria-controls="artist"
                                        className="text-decoration-none">
                                        <i className="bi bi-brush-fill"></i>&nbsp;&nbsp;Artists
                                    </a>
                                    <ul className={`collapse list-unstyled ps-4 ${isActive(["/admin/artist", "/admin/allArtist"]) ? "show" : ""}`} id="artist">
                                        <li><Link href={"/admin/artist"} className="text-decoration-none"><i className="bi bi-file-earmark-plus-fill"></i>&nbsp;&nbsp;Add Artist</Link></li>
                                        <li><Link href={"/admin/allArtist"} className="text-decoration-none"><i className="bi bi-brush"></i>&nbsp;&nbsp;All Artist</Link></li>
                                    </ul>
                                </li>

                                {/* Category */}
                                <li className="sub-nav-bg">
                                    <a data-bs-toggle="collapse" href="#category"
                                        aria-expanded={isActive(["/admin/addCategory", "/admin/allCategory"])}
                                        aria-controls="category"
                                        className="text-decoration-none">
                                        <i className="bi bi-tag-fill"></i>&nbsp;&nbsp;Category
                                    </a>
                                    <ul className={`collapse list-unstyled ps-4 ${isActive(["/admin/addCategory", "/admin/allCategory"]) ? "show" : ""}`} id="category">
                                        <li><Link href={"/admin/addCategory"} className="text-decoration-none"><i className="bi bi-file-earmark-plus-fill"></i>&nbsp;&nbsp;Add Category</Link></li>
                                        <li><Link href={"/admin/allCategory"} className="text-decoration-none"><i className="bi bi-bookmark-plus"></i>&nbsp;&nbsp;All Category</Link></li>
                                    </ul>
                                </li>

                                {/* Featured Playlist */}
                                <li className="sub-nav-bg">
                                    <a data-bs-toggle="collapse" href="#featuredPlaylist"
                                        aria-expanded={isActive(["/admin/addFeaturedPlaylist", "/admin/featuredSongs", "/admin/allFeaturedPlaylist"])}
                                        aria-controls="featuredPlaylist"
                                        className="text-decoration-none">
                                        <i className="bi bi-star-fill"></i>&nbsp;&nbsp;Featured Playlist
                                    </a>
                                    <ul className={`collapse list-unstyled ps-4 ${isActive(["/admin/addFeaturedPlaylist", "/admin/featuredSongs", "/admin/allFeaturedPlaylist"]) ? "show" : ""}`} id="featuredPlaylist">
                                        <li><Link href={"/admin/addFeaturePlaylist"} className="text-decoration-none"><i className="bi bi-plus-circle"></i>&nbsp;&nbsp;Add Featured Playlist</Link></li>
                                        <li><Link href={"/admin/addSongToFeaturePlayList"} className="text-decoration-none"><i className="bi bi-music-note-beamed"></i>&nbsp;&nbsp;Add Songs</Link></li>
                                        <li><Link href={"/admin/allFeaturedPlaylist"} className="text-decoration-none"><i className="bi bi-collection-play-fill"></i>&nbsp;&nbsp;All Featured Playlists</Link></li>
                                    </ul>
                                </li>

                                {/* Docx */}
                                <li>
                                    <Link href={"/admin/docx"} className="text-decoration-none">
                                        <i className="bi bi-file-earmark-text-fill"></i>&nbsp;&nbsp;Docx
                                    </Link>
                                </li>

                                <li><i className="bi bi-arrows-angle-contract"></i>&nbsp;&nbsp;Activity logs</li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Logout at Bottom */}
            <div className="mb-3">
                <a onClick={logout} className="no-style-link">
                    <li><i className="bi bi-door-closed-fill"></i>&nbsp;&nbsp;Logout</li>
                </a>
            </div>
        </div>
    )
}

export default SideNavBar
