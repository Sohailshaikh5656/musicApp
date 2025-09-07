
"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {useSession, signOut } from 'next-auth/react';
import { classNames } from 'primereact/utils';
const Navbar = () =>{
    
    const route = useRouter()
    const {data:session} = useSession();
    const [Login, setIsLogin] = useState(false);

    useEffect(() => {
        // Update login status whenever session changes
        console.log("This is  : ",session?.user)
        if (session?.user && session?.user?.role == "user") {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    }, [session]);

    const style = {
        color: 'white',
        textDecoration: 'none',
        fontSize: '1.2rem',
        hover: {
            color: 'red'
        }
    };
      
      
      const logout = async () => {
        try {
          await fetch('/api/logout'); // server-side clears the cookie
            setIsLogin(false);
          signOut({ callbackUrl: '/user/signin' })
        } catch (error) {
          console.error(error);
        }
      }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark sticky-top gradient-transition">
            <div className="container">
                <a className="navbar-brand fw-bold neon-text" href="#">
                    <i className="fas fa-music me-2"></i>VibeStream
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><a className="nav-link active" href="#">Home</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Discover</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Genres</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Artists</a></li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">More</a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Playlists</a></li>
                                <li><a className="dropdown-item" href="#">Podcasts</a></li>
                            </ul>
                        </li>
                    </ul>
                    {Login ? (
                        <div className="d-flex">
                            <button className="btn btn-outline-light me-2" onClick={logout}>
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
    )
}

export default Navbar;