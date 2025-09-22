"use client"
import { useFormik } from "formik";
import { useState, useEffect } from "react"
import { newPlayList, getAllPlayList } from "@/app/utils/apiHandler";
import { uploadImage } from "@/app/utils/apiHandler";
import { useSession } from "next-auth/react";
import * as Yup from 'yup'
import { ToastContainer, toast } from "react-toastify"
import { useRouter } from "next/navigation";
const UserPlayList = () => {
    const [playlists, setPlaylists] = useState();
    
    const [showModal, setShowModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [btn, setBtn] = useState(false)
    const {data:session} = useSession()
    const [dialog, setDialog] = useState()
    const[DialogBool, setDialogBool] = useState(false)
    const router = useRouter()

    const fetchPlayList = async() =>{
        try{
            const res = await getAllPlayList({jwtToken : session?.user?.jwtToken})
            if(res.code == 1){
                setPlaylists(res.data)
            }else if(res.code == 2){
                notify("No Play List Found")
            }else{
                console.error(`Error : ${res}`)
            }
        }catch(error){
            notify(`ERROR : ${error}`)
        }
    }

    const initalStatePlayList = {
        name : "",
        image : "",
    }
    const validationSchemaPlayList = Yup.object({
        name : Yup.string().min(3).required(),
        image : Yup.string().optional()
    })

    const playListFormik = useFormik({
        initialValues : initalStatePlayList,
        validationSchema : validationSchemaPlayList,
        onSubmit : async(values,{resetForm})=>{
            try{
                setBtn(true)
                if(selectedFile){
                    const formData = new FormData()
                    formData.append("profile_img", selectedFile); // Fixed: using selectedFile instead of songFile
                    const fileResponse = await uploadImage(formData);
                    console.log("File Upload : ",fileResponse)
                    if(fileResponse.code == 1){
                        values.image = fileResponse.data
                    }
                }
                const playListData = {
                    name : values.name,
                    image : values.image || "",
                    jwtToken : session?.user?.jwtToken
                }
                const res = await newPlayList(playListData)
                if(res.code != 1){
                    notify(`Something Went Wrong ${res.data}`)
                    return; // Added return to prevent further execution on error
                }
                notify("Play List Created")
                // Update local state with new playlist
            }catch(error){
                notify(`ERROR : ${error}`)
            }finally{
                setBtn(false)
                setSelectedFile(null);
                setFilePreview(null);
                setShowModal(false);
                resetForm()
            }
        }
    })

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setPlaylists(null);
    //     }, 100);
    //     return () => clearTimeout(timer);
    // }, []);

    useEffect(()=>{
        if(session?.user?.jwtToken && !playlists){
            fetchPlayList()
        }
    },[session?.user?.jwtToken])

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
                playListFormik.setFieldValue('image', reader.result); // Update formik value
            };
            reader.readAsDataURL(file);
        }
    };

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
    const editPlayList=(data)=>{
        
    }


    return (
        <>
        <ToastContainer />
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-gradient-primary text-white">
                                <h5 className="modal-title">Create New Playlist</h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white" 
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={playListFormik.handleSubmit} noValidate method="post">
                                    <div className="mb-3">
                                        <label htmlFor="playlistName" className="form-label">Playlist Name</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            className="form-control" 
                                            id="playlistName"
                                            value={playListFormik.values.name}
                                            onChange={playListFormik.handleChange}
                                            placeholder="Enter playlist name"
                                            onBlur={playListFormik.handleBlur}
                                        />
                                        {playListFormik.errors.name && playListFormik.touched.name && <div className="text-danger">{playListFormik.errors.name}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="playlistImage" className="form-label">Cover Image (optional)</label>
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            id="playlistImage" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        {filePreview && (
                                            <div className="mt-3 text-center">
                                                <img 
                                                    src={filePreview} 
                                                    alt="Preview" 
                                                    className="img-thumbnail mt-2" 
                                                    style={{maxHeight: '150px'}}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary" 
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            disabled={btn}
                                        >
                                            {btn ? "Creating Playlist..." :"Create Playlist"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container py-4">
                {(!playlists || playlists.length === 0) ? (
                    <div className="row justify-content-center" onClick={() => setShowModal(true)}>
                    <div className="col-md-10 col-lg-8">
                      <div className="card border-0 shadow rounded-5 overflow-hidden bg-light">
                        <div className="card-body p-5">
                          <div className="row align-items-center">
                            <div className="col-md-6 text-center mb-4 mb-md-0">
                              <div className="position-relative">
                                <div className="bg-white rounded-4 p-4 p-md-5 d-flex align-items-center justify-content-center shadow-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#8B5CF6" viewBox="0 0 16 16" className="opacity-75">
                                    <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"/>
                                    <path fillRule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"/>
                                    <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"/>
                                  </svg>
                                </div>
                                <div className="position-absolute top-0 start-100 translate-middle">
                                  <div className="bg-primary rounded-circle p-2 shadow">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16">
                                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 text-center text-md-start">
                              <h3 className="fw-bold mb-3 text-dark">Your Playlist Collection is Empty</h3>
                              <p className="text-muted mb-4">Start building your music library by creating your first playlist. Organize your favorite songs however you like.</p>
                              <button 
                                className="btn btn-primary btn-lg w-100 py-3 rounded-4 fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
                                style={{ 
                                  background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', 
                                  border: 'none',
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                </svg>
                                Create Your First Playlist
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="h3 fw-bold mb-0 text-gradient">My Playlists</h2>
                            <button
                                className="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-4"
                                onClick={() => setShowModal(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                </svg>
                                New Playlist
                            </button>
                        </div>

                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                            {playlists.map((playlist, index) => (
                                <div key={index} className="col">
                                    <div className="card h-100 shadow-sm border-0 overflow-hidden transition-all hover-shadow">
                                        <div className="position-relative overflow-hidden">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${playlist.image}`}
                                                alt={playlist.title}
                                                className="card-img-top object-fit-cover"
                                                style={{ height: "200px" }}
                                            />
                                            <div className="position-absolute top-0 end-0 m-2 d-flex gap-2" style={{ zIndex: 1 }}>
                                                <button
                                                    className="btn btn-sm btn-light rounded-circle shadow-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        router.push(`/user/editPlayList/${playlist.id}`)
                                                    }}
                                                    title="Edit playlist"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0d6efd" viewBox="0 0 16 16">
                                                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                                    </svg>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-light rounded-circle shadow-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        deletePlaylist(index);
                                                    }}
                                                    title="Delete playlist"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#dc3545" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white overlay-gradient">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="badge bg-dark bg-opacity-50">
                                                        {playlist.songs} {playlist.songs === 1 || playlist.songs === 0 ? 'song' : 'songs'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title fw-bold text-truncate">{playlist.name}</h5>
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <a 
                                                    className="btn btn-outline-danger btn-sm rounded-pill"
                                                    onClick={(e) => {
                                                        router.push(`/user/playList/${playlist.id}`);
                                                    }}
                                                    style={{ position: 'relative', zIndex: 2 }} // Added z-index to make button clickable above hover effects
                                                >
                                                    Play
                                                </a>
                                                <div className="text-muted small">
                                                    {playlist.created_at}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                .text-gradient {
                    background: linear-gradient(135deg, #8B5CF6, #3B82F6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .bg-gradient-primary {
                    background: linear-gradient(135deg, #8B5CF6, #3B82F6) !important;
                }
                .hover-shadow:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
                    transition: all 0.3s ease;
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
                .overlay-gradient {
                    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
                }
                .object-fit-cover {
                    object-fit: cover;
                    width: 100%;
                }
            `}</style>
        </>
    )
}

export default UserPlayList