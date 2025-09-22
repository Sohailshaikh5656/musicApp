"use client"
import { searchKeyword } from "@/app/utils/apiHandler"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useRef } from "react"
const HeroSection = () => {
    const [searchResult, setSearchResult] = useState(null)
    const router = useRouter()
    const searchValue = useRef(null)
    const [error, setError] = useState(false)
    const {data:session} = useSession()
    const fetchData = async(keyword)=>{
        const res = await searchKeyword({jwtToken:session?.user?.jwtToken, keyword:keyword})
        if(res.code == 1){
            console.log(res.data)
            setSearchResult(res.data)
        }else if(res.code == 2){
            setError(true)
        }else{
            console.error(res)
            alert("Error in Searching !")
        }
    }
    const generateUniqueKey = (id) => {
        return `${id}_${Math.random().toString(36).substring(2, 9)}`
    }
    const handleSearch = (keyword) =>{
        let searchKeyword = keyword.toLowerCase().trim()
        if(searchValue.current){
            clearTimeout(searchValue.current)
        }
        searchValue.current = setTimeout(()=>{
            if(searchKeyword == ""){
                setError(false);
                setSearchResult(null)
                return;
            }
            fetchData(searchKeyword);
        },2000)
       
    }
    return (
        <section className="hero-section text-center">
            <div className="container">
                <h1 className="display-4 fw-bold mb-4">Discover Your Next Favorite Song</h1>
                <p className="lead mb-5">Stream millions of songs, curated playlists, and exclusive content from artists worldwide.</p>
                <input type="text" className="form-control search-input" placeholder="Search for songs, artists, or albums..." ref={searchValue} onChange={(e)=>{handleSearch(e.target.value)}} />
                {searchResult && (
                    <div className="search-results mt-3 mb-3">
                        <ul className="list-group">
                            {searchResult.map((result) => (
                                <li key={generateUniqueKey(result.id)} className="list-group-item d-flex justify-content-between align-items-center" style={{cursor:"pointer"}}>
                                    <div className="d-flex align-items-center" onClick={()=>{router.push(`/user/playSong2/${result.id}`)}}>
                                        <img 
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${result.cover_image}`} 
                                            alt={result.title}
                                            className="me-3"
                                            style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px'}}
                                            onError={(e) => {
                                                e.target.src = '/default-album.png'
                                            }}
                                        />
                                        <div style={{textAlign: 'left'}}>
                                            <h6>{result.title}</h6>
                                            <small className="text-muted">{result.artist_name}</small>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2 align-items-center">
                                        <span className="badge bg-primary rounded-pill px-3 py-1">{result.genere}</span>
                                        <span className="text-danger" title="Likes" style={{padding: '0 8px'}}>
                                            <i className="bi bi-heart-fill me-1"></i>{result?.total_likes || 0}
                                        </span>
                                        <span className="text-success" onClick={(e)=>{e.stopPropagation(); router.push(`/user/showPlaylist/${result.id}`)}} title="Add to Playlist" style={{padding: '0 8px', cursor: 'pointer'}}>
                                            <i className="bi bi-music-note-list me-1"></i>
                                        </span>
                                        <span className="text-info" title="Plays" style={{padding: '0 8px'}}>
                                            <i className="bi bi-play-fill me-1" style={{fontSize: '1.2em'}}></i>{result.play_count || 0}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {error && (
                    <div className="alert alert-warning mt-3" role="alert">
                        No results found for your search.
                    </div>
                )}
                <div>
                    <a href="#" className="btn btn-primary btn-lg me-3">Start Listening Free</a>
                    <a href="#" className="btn btn-outline-light btn-lg">Explore Premium</a>
                </div>
            </div>
        </section>
    )
}
export default HeroSection