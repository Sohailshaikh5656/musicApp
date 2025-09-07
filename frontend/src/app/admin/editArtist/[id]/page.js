"use client"
import { getArtist, updateArtist } from "@/app/utils/apiHandler";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Loader from "../../common/loader";
import Layout from "../../common/layout";
import * as Yup from 'yup';
import { Audio } from 'react-loader-spinner';
import { uploadImage } from "@/app/utils/apiHandler";
import { ToastContainer, toast } from "react-toastify";

export default function EditUser() {
    const params = useParams()
    const id = params.id
    const router = useRouter()
    const { data: session } = useSession()
    const [artist, setArtist] = useState(null);
    const [btn, setBtn] = useState(false)
    const [initialLoad, setInitialLoad] = useState(true)
    const [image, setImage] = useState()

    const iniitallState = {
        name: "",
        bio: "",
        profile_picture: "",
        is_active: "",
    }

    const validationSchema = Yup.object({
        name: Yup.string().min(3).required(),
        bio: Yup.string().min(16).required(),
    })

    const formik = useFormik({
        initialValues: iniitallState,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setBtn(true)
                if(image){
                    let formData = new FormData()
                    formData.append("profile_img",values.profile_picture);
                    const fileResponse = await uploadImage(formData)
                    console.log("Response At Page Side : ",fileResponse)
                    if(fileResponse.code == 1){
                        const artistData = {
                            id : artist.id,
                            name : values.name,
                            bio : values.bio,
                            profile_picture : fileResponse.data,
                            jwtToken : session?.user?.jwtToken
                        }
                        const response = await updateArtist(artistData)
                        if(response.code ==  1){
                            notify("🎉 Artist Updated Successfully! 🎉")
                            setTimeout(() => {
                                router.push("/admin/allArtist")
                               }, 2000);
                        }else{
                            notify("Error in Updaing Data : ",response)
                        }
                    }else{
                        notify("Error uploading image. Please try again.")
                    }
                }else{
                    const artistData = {
                        id : artist.id,
                        name : values.name,
                        bio : values.bio,
                        jwtToken : session?.user?.jwtToken
                    }
                    const response = await updateArtist(artistData)
                    if(response.code ==  1){
                        notify("🎉 Artist Updated Successfully! 🎉")
                       setTimeout(() => {
                        router.push("/admin/allArtist")
                       }, 2000);
                    }else{
                        notify("Error updating artist information. Please try again.")
                    }
                }
                // console.log(values)
                // const formData = new FormData()
                // formData.append('name', values.name)
                // formData.append('bio', values.bio)
                // formData.append('profile_picture', values.profile_picture)
                // formData.append('id', id)

                // const res = await updateArtist({
                //     jwtToken: session?.user?.jwtToken,
                //     data: formData
                // })

                // if(res.code === 1) {
                //     router.push('/admin/allArtist')
                // } else {
                //     alert('Failed to update artist')
                // }
            } catch (error) {
                console.error('Error updating artist:', error)
            } finally {
                setBtn(false)
            }
        }
    })

    const fetchArtist = async () => {
        try {
            const res = await getArtist({ jwtToken: session?.user?.jwtToken, id: id })
            if (res.code == 1) {
                setArtist(res.data);
                formik.setValues({
                    name: res.data.name,
                    bio: res.data.bio,
                    profile_picture: res.data.profile_picture
                })
            } else {
                console.log("Error in Fetching Data : ", res)
            }
        } catch (error) {
            console.error("Error : ", error)
        } finally {
            setInitialLoad(false)
        }
    }

    useEffect(() => {
        if (session && initialLoad) {
            fetchArtist()
        }
    }, [session])

    const handleNewUpload = (e) => {
        document.getElementById("CurrentText").innerText = "New uploaded Image";
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.getElementById("image");
                img.src = event.target.result;
                formik.setFieldValue("profile_picture", file);
                setImage(true)
            };
            reader.readAsDataURL(file);
        }
    }

    if (!session || initialLoad) {
        return <Loader></Loader>
    }
    const notify = (msg) => {
        toast(msg, {
            position: "top-right",  // Position at top right
            autoClose: 5000,        // Auto close after 5 seconds
            hideProgressBar: false, // Show progress bar
            closeOnClick: true,     // Close on click
            pauseOnHover: true,     // Pause on hover
            draggable: true,        // Allow dragging
            progress: undefined,    // Default progress
            theme: "light",         // Light theme
        });
    }
    return (
        <Layout>
            <ToastContainer />
            {!artist ? <>
                <div className="text-center mt-5">
                    <i className="bi bi-emoji-frown display-1 text-muted"></i>
                    <h3 className="mt-3">No Artist Found</h3>
                    <p className="text-muted">We couldn't find any artist or song composer matching your search.</p>
                </div>
            </> : <>
                <div className="col-8 col-sm-8 col-md-6 col-lg-6 col-xl-6 mx-auto p-5 adminForm mt-4">
                    <div className="row mb-4">
                        <h2 className="text-center" style={{ color: '#ff6b6b' }}>
                            <i className="bi bi-music-note-beamed me-2"></i>
                            <i className="bi bi-pencil-square me-2" style={{ color: '#4ecdc4' }}></i>
                            Edit Artist
                            <i className="bi bi-music-note-beamed ms-2"></i>
                        </h2>
                    </div>
                    <form noValidate onSubmit={formik.handleSubmit}>
                        {/* Form fields remain the same */}
                        <div className="row mt-2">
                            <input type="text" className="form-control" name="name" value={formik.values.name} onBlur={formik.handleBlur} onChange={formik.handleChange} placeholder="Enter Artist or Song Composer Name ..." />
                            {formik.errors.name && formik.touched.name && <div className="text-danger">{formik.errors.name}</div>}
                        </div>
                        <div className="row mt-2">
                            <textarea type="text" rows={3} name="bio" className="form-control" onBlur={formik.handleBlur} onChange={formik.handleChange} placeholder="Enter Artist Bio ..." value={formik.values.bio} />
                            {formik.errors.bio && formik.touched.bio && <div className="text-danger">{formik.errors.bio}</div>}
                        </div>

                        <div className="row mt-2">
                            <small className="text-secondary">Upload new image to update profile picture</small>
                            <button 
                                type="button" 
                                className="btn btn-warning text-white btn-sm animate__animated animate__pulse"
                                onClick={() => {
                                    const fileInput = document.getElementById('profilePictureInput');
                                    fileInput.click();
                                }}
                            >
                                <i className="bi bi-upload me-2"></i>
                                Upload New Image
                            </button>
                            <input
                                id="profilePictureInput"
                                className="form-control mt-2"
                                type="file"
                                name="profile_picture"
                                accept="image/*"
                                style={{display: 'none'}}
                                onChange={(e) => { 
                                formik.setFieldValue("profile_picture", e.currentTarget.files[0]);    
                                handleNewUpload(e) }}
                            />
                            {formik.errors.profile_picture && formik.touched.profile_picture && <div className="text-danger">{formik.errors.profile_picture}</div>}
                        </div>
                        <div className="row mt-3">
                            <h6 className="text-secondary" id="CurrentText">Current Profile Picture:</h6>
                            <div className="col-12 d-flex justify-content-center">
                                {artist?.profile_picture && (
                                    <img id="image"
                                        src={`http://localhost:3300/uploads/${artist.profile_picture}`}
                                        alt="Current Profile"
                                        className="img-fluid rounded-circle artistEditImage"
                                        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                            </div>
                        </div>
                        <div className='mt-4 d-grid'>
                            <button type="submit" className="btn btn-primary w-100" disabled={btn} style={{ opacity: btn ? 0.5 : 1 }}>
                                {btn ? (
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                                        <Audio
                                            height="30"
                                            width="60"
                                            color="#4fa94d"
                                            ariaLabel="audio-loading"
                                            wrapperStyle={{}}
                                            wrapperClass="wrapper-class"
                                            visible={true}
                                        />
                                    </div>
                                ) : "Update Artist"}
                            </button>
                        </div>
                    </form>
                </div>
            </>}
        </Layout>
    )
}