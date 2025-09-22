"use client"
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getAllPlayList, getPlayListSongs, updatePlaylist, removeSongFromPlayList } from '@/app/utils/userApi';
import { useFormik } from 'formik';
import * as Yup from "yup"
import { ToastContainer, toast } from 'react-toastify';
import { Audio } from 'react-loader-spinner';
import { uploadImage } from '@/app/utils/apiHandler';


const EditPlaylistPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const { data: session } = useSession();
    const [playlist, setPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [imagePreview, setImagePreview] = useState();
    const [imagePreviewBool, setImagePreviewBool] = useState(false);
    const initialValues = {
        title: '',
        image: ''
    };

    const validationSchema = Yup.object({
        title: Yup.string()
            .required('Playlist name is required')
            .min(3, 'Playlist name must be at least 3 characters')
            .max(50, 'Playlist name must be at most 50 characters'),
        image: Yup.string()
            .required('Image is required')
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values,{resetForm}) => {
            try {
                if(imagePreview){
                    const formData = new FormData()
                    formData.append("profile_img",imagePreview)
                    const imageResponse = await uploadImage(formData)
                    if(imageResponse.code == 1){
                        values.image = imageResponse.data
                    }else{
                        notify("failed to upload image !")
                    }
                }
                const updateData = {
                    title : values.title,
                    image : values.image,
                    id : id,
                    jwtToken : session?.user?.jwtToken
                }

                console.log("Data Going to Update : ",updateData)

                const res = await updatePlaylist(updateData)
                if(res.code == 1){
                    notify("Play List Updated !")
                    setTimeout(()=>{
                        const baseUrl = process.env.NEXTAUTH_URL || '/';
                        router.push(baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`);
                    },3000)
                }
            } catch (error) {
                console.error('Error updating playlist:', error);
            }
        }
    });
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

    useEffect(() => {
        const fetchPlaylistData = async () => {
            if (!session?.user?.jwtToken) return;
            
            try {
                const playlistData = await getAllPlayList({id:id, jwtToken: session.user.jwtToken});
                if(playlistData.code == 1){
                    setPlaylist(playlistData.data);
                    formik.setValues({
                        title: playlistData.data.title,
                        image: playlistData.data.image
                    });
                    
                }

                const songsData = await getPlayListSongs({id:id, jwtToken: session.user.jwtToken});
                if(songsData.code == 1){
                    setSongs(songsData.data.songs);
                }
            } catch (error) {
                console.error('Error fetching playlist data:', error);
            }
        };

        fetchPlaylistData();
    }, [id, session?.user?.jwtToken]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                formik.setFieldValue('image', reader.result);
                setImagePreviewBool(true) 
            };
            reader.readAsDataURL(file);
        }
    };

    if (!playlist) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Audio
                    height="80"
                    width="80"
                    color="#0d6efd"
                    ariaLabel="audio-loading"
                    wrapperStyle={{}}
                    wrapperClass="wrapper-class"
                    visible={true}
                />
            </div>
        );
    }

    const removeSong = async (song_id)=>{
        const res = await removeSongFromPlayList({jwtToken:session?.user?.jwtToken, song_id : song_id, playlist_id : id})
        if(res.code  == 1){
            const filterData = songs.filter((item)=>item.id != song_id)
            setSongs(filterData)
            notify("Song removed from playlist successfully")
        }else{
            notify("Failed to remove song from playlist")
        }
    }

    return (
        <div className="container py-5">
            <ToastContainer />
            <div className="row">
                <div className="col-md-8">
                    <h1 className="mb-4 text-gradient">Edit Playlist</h1>
                    <form onSubmit={formik.handleSubmit} noValidate className="mb-5">
                        <div className="mb-4">
                            <label htmlFor="name" className="form-label fw-bold">Playlist Name</label>
                            <input
                                type="text"
                                className={`form-control rounded-pill py-2 px-3 ${formik.errors.title && formik.touched.title ? 'is-invalid' : ''}`}
                                id="name"
                                name="title"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.title}
                                placeholder='Enter Play List Name or Title...'
                            />
                            {formik.errors.title && formik.touched.title && (
                                <div className='invalid-feedback'>{formik.errors.title}</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <h6 className="fw-bold mb-3">Current Playlist Cover</h6>
                            <div className="card border-0 shadow-sm">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${playlist.image}`}
                                    alt="Current Playlist Cover"
                                    className="img-fluid rounded"
                                    style={{ height: '250px', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="imageUpload" className="form-label fw-bold">Upload New Cover Image</label>
                            <input
                                type="file"
                                className={`form-control rounded-pill ${formik.errors.image && formik.touched.image ? 'is-invalid' : ''}`}
                                id="imageUpload"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.image && formik.touched.image && (
                                <div className='invalid-feedback'>{formik.errors.image}</div>
                            )}
                        </div>
                        {imagePreviewBool && imagePreviewBool!=null ? (
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3">New Cover Preview</h6>
                                <div className="card border-0 shadow-sm">
                                    <img
                                        src={imagePreview}
                                        alt="New Playlist Cover Preview"
                                        className="img-fluid rounded"
                                        style={{ height: '250px', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        ) : null}
                        <div className="d-flex gap-3">
                            <button 
                                type="submit" 
                                className="btn btn-primary rounded-pill px-4 py-2 fw-bold"
                                style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-bold"
                                onClick={() => router.push('/user')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <div className="col-md-4">
                    <h2 className="mb-4 text-gradient">Songs in Playlist</h2>
                    {songs && songs.length > 0 ? (
                        <div className="list-group">
                            {songs.map((song, index) => (
                                <div key={index} className="list-group-item border-0 shadow-sm mb-3 rounded-3 p-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${song.cover_image}`}
                                            alt={song.title}
                                            className="rounded"
                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                        />
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 fw-bold">{song.title}</h6>
                                            <small className="text-muted">{song.artist_name}</small>
                                            <div className="d-flex gap-2 mt-1">
                                                <small className="text-muted">{song.duration}</small>
                                                <small className="text-muted">•</small>
                                                <small className="text-muted">{song.genre}</small>
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-sm btn-outline-danger rounded-pill"
                                            onClick={() => {
                                                removeSong(song.id)
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-music-note-list text-muted mb-3" viewBox="0 0 16 16">
                                <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2z"/>
                                <path fillRule="evenodd" d="M12 3v10h-1V3h1z"/>
                                <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1V2.82z"/>
                                <path fillRule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                            <p className="text-muted">This playlist is currently empty. Add some songs to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditPlaylistPage;
