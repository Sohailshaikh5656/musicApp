"use client"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Layout from "../../common/layout"
import { getUserSong } from "@/app/utils/userApi"
import MusicPlayer from "../../musicPlayerComponents/musicPlayer"
import { Audio } from "react-loader-spinner"


const PlaySongFunction = () => {
    const { data: session } = useSession()
    const params = useParams()
    const [songs, setSongs] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchSongs = async() => {
        try {
            setLoading(true)
            const res = await getUserSong({
                jwtToken: session?.user?.jwtToken,
                id: params.id
            })

            if (res.code == 1) {
                setSongs(res.data)
            }
        } catch (error) {
            console.error("Error fetching songs:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (session?.user?.jwtToken && !songs) {
            fetchSongs();
        }
    }, [session?.user?.jwtToken]);

    if (loading) {
        return (
            <Layout>
                <div className="container d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
                   <Audio/>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
           {songs ? <MusicPlayer data={songs} /> : <p>No songs found</p>}
        </Layout>
    )
}

export default PlaySongFunction


