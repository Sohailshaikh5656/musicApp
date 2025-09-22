"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signOut } from "next-auth/react"

// 3D / colorful icons
import { IoNotifications } from "react-icons/io5"
import { MdSettingsSuggest } from "react-icons/md"
import { FaUserCircle } from "react-icons/fa"
import { RiLogoutBoxRFill } from "react-icons/ri"

const NavBar = () => {
    const router = useRouter()
    const [showNotif, setShowNotif] = useState(false)
    const [showProfile, setShowProfile] = useState(false)

    const logout = async () => {
        try {
            document.cookie =
                "admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
            await fetch("/api/logout")
            signOut({ callbackUrl: "/admin/login" })
            router.push("/admin/login")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div
            className="col-lg-12 col-md-12 col-sm-12 navbar px-3 py-2 d-flex justify-content-between align-items-center shadow-sm"
        >
            {/* Left Section - Logo + Title */}
            <div className="d-flex align-items-center gap-3">
                <img
                   src="https://img.icons8.com/plasticine/100/000000/musical-notes.png"
                    alt="Logo"
                    width={40}
                    height={40}
                />
                <span className="fw-bold text-secondary d-none d-md-inline fs-5">
                    Music Admin
                </span>
            </div>

            {/* Right Section - Icons & Profile */}
            <div className="d-flex align-items-center gap-4">
                {/* Notifications */}
                <div className="position-relative">
                    <IoNotifications
                        size={26}
                        color="var(--bs-secondary)"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowNotif(!showNotif)}
                    />
                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
                        3
                    </span>
                    {showNotif && (
                        <div
                            className="dropdown-menu dropdown-menu-end show mt-2 p-2 shadow"
                            style={{ minWidth: "260px", fontSize: "14px" }}
                        >
                            <p className="mb-1 fw-bold">Notifications</p>
                            <div className="border-bottom py-1">
                                🎉 New user registered
                            </div>
                            <div className="border-bottom py-1">
                                🎶 5 Songs added
                            </div>
                            <div className="py-1">⚡ System update available</div>
                        </div>
                    )}
                </div>

                {/* Settings Icon */}
                <MdSettingsSuggest
                    size={26}
                    color="var(--bs-secondary)"
                    style={{ cursor: "pointer" }}
                />

                {/* Profile */}
                <div className="position-relative">
                    <div
                        className="d-flex align-items-center gap-2 text-secondary"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowProfile(!showProfile)}
                    >
                        <img
                            src="https://randomuser.me/api/portraits/men/75.jpg"
                            alt="Admin"
                            width={38}
                            height={38}
                            className="rounded-circle border border-light"
                        />
                        <span className="fw-bold d-none d-sm-inline">
                            Admin
                        </span>
                    </div>
                    {showProfile && (
                        <div
                            className="dropdown-menu dropdown-menu-end show mt-2 p-2 shadow"
                            style={{ minWidth: "200px", fontSize: "14px" }}
                        >
                            <a className="dropdown-item" href="#">
                                <FaUserCircle /> My Profile
                            </a>
                            <a className="dropdown-item" href="#">
                                <MdSettingsSuggest /> Settings
                            </a>
                            <button
                                className="dropdown-item text-danger"
                                onClick={logout}
                            >
                                <RiLogoutBoxRFill /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NavBar
