"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Update login status whenever session changes
        if (session?.user && session?.user?.role === "user") {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [session]);

    const handleLogout = async () => {
        try {
            await fetch('/api/logout'); // server-side clears the cookie
            setIsLoggedIn(false);
            signOut({ callbackUrl: '/user/signin' });
        } catch (error) {
            console.error(error);
        }
    };
    const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL

    return (
        <nav className="navbar navbar-expand-lg navbar-dark sticky-top gradient-transition">
            <div className="container">
                <Link className="navbar-brand fw-bold neon-text" href="/">
                    <i className="fas fa-music me-2"></i>VibeStream
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" href={baseUrl}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href={`${baseUrl}/user/discover`}>Discover</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href={`${baseUrl}/user/genere`}>Genres</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link"  href={`${baseUrl}/user/allArtist`}>Artists</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">More</a>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link className="dropdown-item"  href={`${baseUrl}/user/featurePlayList`}>Playlists</Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item"  href={`${baseUrl}/user/allPodCast`}>Podcasts</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    {isLoggedIn ? (
                        <div className="d-flex">
                            <button className="btn btn-outline-light me-2" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="d-flex">
                            <Link href="/user/signup" className="btn btn-outline-light me-2">
                                Sign Up
                            </Link>
                            <Link href="/user/signin" className="btn btn-light">
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;