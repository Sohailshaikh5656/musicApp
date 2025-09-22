"use client"
import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Layout from "@/app/admin/common/layout"
import { ToastContainer, toast } from 'react-toastify';
import { getUserPlayListSongs, deletePlayListSong } from "@/app/utils/adminApi"
const SinglePlayList = () => {
    const { data: session } = useSession()
    const searchRef = useRef(null)
    const params = useParams()
    const id = params.id
    const router = useRouter()
    const [playList, setPlayList] = useState();
    const [oldPlayList, setOldPlayList] = useState();
    const [emptyPlayList, setEmptyPlayList] = useState(false)
    const [isPlayList, setIsPlayList] = useState()

    const getSinglePlayList = async () => {
        try {
            const res = await getUserPlayListSongs({ jwtToken: session?.user?.jwtToken, id: id })
            if (res.code == 1) {
                if (res?.songs) {
                    console.log("This is At Client Side :  ", res.songs)
                    setPlayList(res.songs)
                    setOldPlayList(res.songs)
                }
                if (res?.data) {
                    setIsPlayList(res.data)
                }
            } else if (res.code == 2) {
                console.log("An Empty PlayList : ");
                setEmptyPlayList(true)
            } else {
                console.log("Error : ", res)
            }
        } catch (error) {
            console.error("Error : ", error)
        }
    }

    const deleteMethod = async(song_id) => {
        const res = await deletePlayListSong({jwtToken:session?.user?.jwtToken, id:id, song_id : song_id})
        if(res.code == 1){
            notify("Song Deletedn Form the PlayList !")
        }else{
            notify("Error in Deleting Song from the PlayList ")
        }
    }

    useEffect(() => {
        if (session?.user?.jwtToken && !playList) {
            getSinglePlayList()
        }
    }, [session?.user?.jwtToken])

    const handleSearch = (searchValue) =>{
        searchValue = searchValue.toLowerCase().trim()
        if(searchRef.current){
            clearTimeout(searchRef.current)
        }
        searchRef.current = setTimeout(()=>{
            if(searchValue == ""){
                setPlayList(oldPlayList)
            }else{
                const filterData = oldPlayList.filter((item)=>
                (item.id.toString().includes(searchValue))||
                (item.title.toLowerCase().includes(searchValue)) ||
                (item.artist_name.toLowerCase().includes(searchValue)) ||
                (item.album_name.toLowerCase().includes(searchValue))
                )

                setPlayList(filterData)
            }
        },1500)
    }

    const notify = (msg) => {
        toast(msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

    const handleDelete = (id) =>{
        const filterData = oldPlayList.filter((item)=>item.id != id)
        setOldPlayList(filterData)
        setPlayList(filterData)
        deleteMethod(id)
    }

    return (
        <Layout>
            <ToastContainer />
            {isPlayList && (
                <div className="container" >
                    <div className="row mt-3 p-3 align-items-center admin-playList-section">

                        {/* Left side (image + title) */}
                        <div className="col-12 col-md-6 d-flex align-items-center mb-2 mb-md-0">
                            <img
                                className="me-2"
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${isPlayList.image}`}
                            />
                            <div className="text-secondary fs-3 p-2 title-text">{isPlayList.title}</div>
                        </div>

                        {/* Right side (created_at) */}
                        <div className="col-12 col-md-6 text-md-end text-secondary">
                            {isPlayList.created_at}
                        </div>
                    </div>
                </div>
            )}

            {emptyPlayList && <>
                {isPlayList && <>Play List Name : {isPlayList.title}</>}
                <h1 className="text-center">Play List is Empty No Song There !</h1>
            </>}
            {playList && playList?.length >0 && <>
                <section>
                    <div className="container mt-4">
                        <div className="row mt-2 p-4 bg-white">
                            <input className="form-control" placeholder="Enter song title, artist name, or song Id to search..."
                                style={{height:"50px", borderRadius:"20px"}}
                                rel={searchRef}
                                onChange={(e)=>handleSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </section>
            </>}
            {playList && playList?.length > 0 && (
                <div className="container mt-4">
                    <div className="row">
                        {playList.slice(0, 6).map((item, index) => (
                            <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                                <div className="song-card shadow-sm rounded h-100">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.cover_image}`}
                                        alt={item.title}
                                        className="img-fluid rounded mb-3"
                                        style={{ height: "200px", objectFit: "cover", width: "100%" }}
                                    />
                                    <h5 className="text-secondary">{item.title}</h5>
                                    <p className="text-muted mb-1"><strong>Artist:</strong> {item.artist_name}</p>
                                    <p className="text-muted mb-1"><strong>Album:</strong> {item.album_name}</p>
                                    <p className="text-muted mb-1"><strong>Language:</strong> {item.language}</p>
                                    <small className="text-secondary">
                                        Released: {new Date(item.release_date).toLocaleDateString()}
                                    </small>
                                    <div className="d-flex align-items-center mt-2">
                                        <a className="btn btn-danger text-white" onClick={()=>{
                                            const valid = confirm("Are you Sure ?")
                                            if(valid){
                                                handleDelete(item.id)
                                            }
                                        }}>Remove</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </Layout>
    )
}

export default SinglePlayList