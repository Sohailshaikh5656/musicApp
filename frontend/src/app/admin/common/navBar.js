"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signOut } from "next-auth/react"
import Image from "next/image"

const NavBar = () => {
    const router = useRouter()
    const [showNotif, setShowNotif] = useState(false)
    const [showProfile, setShowProfile] = useState(false)

    const logout = async () => {
        try {
            document.cookie = 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            await fetch('/api/logout');
            signOut({ callbackUrl: '/admin/login' })
            router.push('/admin/login');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="col-lg-12 col-sm-12 col-md-12 navbar p-2 d-flex justify-content-end align-items-center gap-4">

            {/* Notification Bell */}
            <div className="position-relative">
                <i 
                    className="bi bi-bell-fill text-white fs-5" 
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowNotif(!showNotif)}
                ></i>
                {showNotif && (
                    <div className="dropdown-menu dropdown-menu-end show mt-2 p-2" style={{ minWidth: "250px" }}>
                        <p className="mb-1 fw-bold">Notifications</p>
                        <div className="border-bottom py-1">New user registered 🎉</div>
                        <div className="border-bottom py-1">5 Songs added 🎶</div>
                        <div className="py-1">System update available ⚡</div>
                    </div>
                )}
            </div>

            {/* Profile Dropdown */}
            <div className="position-relative">
                <div 
                    className="d-flex align-items-center gap-2 text-white"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowProfile(!showProfile)}
                >
                    <Image 
                        src="/assets/admin/images/avatar.png" 
                        alt="Admin" 
                        width={35} 
                        height={35} 
                        className="rounded-circle border"
                    />
                    <span>Admin</span>
                </div>
                {showProfile && (
                    <div className="dropdown-menu dropdown-menu-end show mt-2 p-2" style={{ minWidth: "200px" }}>
                        <a className="dropdown-item" href="#">My Profile</a>
                        <a className="dropdown-item" href="#">Settings</a>
                        <button className="dropdown-item text-danger" onClick={logout}>Logout</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NavBar
