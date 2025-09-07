"use client"
import { useRef, useState } from 'react';
import Layout from "../common/layout"
import * as Yup from "yup"
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { uploadImage, AddArtist } from '@/app/utils/apiHandler';
import { Audio } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";

const NewArtist = () => {
    const [btn, setBtn] = useState(false)
    const { data: session } = useSession()
    const [preview, setPreview] = useState(null);
    const initalState = {
        name: "",
        bio: "",
        profile_picture: ""
    }
    const validateSchema = Yup.object({
        name: Yup.string().min(3).required("Name Required"),
        bio: Yup.string().min(8).required("Bio Required"),
        profile_picture: Yup.mixed().required("Avtar Required")
    })
    const fileInputRef = useRef(null);

    const handleButtonClick = (e) => {
        e.preventDefault(); // Prevent form submission
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null); // Clear preview if no file selected
        }
    };
    const formik = useFormik({
        initialValues: initalState,
        validationSchema: validateSchema,
        onSubmit: async (values, { resetForm }) => {
            setBtn(true)
            try {
                const artistData = {
                    name: values.name,
                    bio: values.bio,
                    profile_picture: values.profile_picture ? values.profile_picture.name : ""
                }
                let formData = new FormData()
                formData.append("profile_img", values.profile_picture);
                let fileResponse = await uploadImage(formData)
                console.log("Response At Page Side : ", fileResponse)
                if (fileResponse.code == 1) {
                    artistData.profile_picture = fileResponse.data;
                    console.log("This is Stored File :", artistData.profile_picture);
                    artistData.jwtToken = session?.user?.jwtToken
                    const response = await AddArtist(artistData);
                    console.log("this is Final Response : ", response)
                    if (response?.code == 1) {
                        notify("Successfully Artist Added !")
                        resetForm()
                        setPreview(null)
                    } else if (response?.code == 0 || response.keyword == "Artist Already Exits") {
                        notify("Artist Already Exits !")
                        resetForm()
                        setPreview(null)
                    } else {
                        notify("Something Went Happend !")
                    }
                } else {
                    notify("Error In File Storing !")
                }
            } catch (error) {
                notify("Something Went Wrong !")
                resetForm()
            } finally {
                setBtn(false)
            }
        }
    })
    // Toast notification function
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
            <div className="col-10 col-sm-10 col-md-7 col-lg-7 mx-auto mt-3 mb-4 adminForm p-5">
                <ToastContainer />
                <form noValidate onSubmit={formik.handleSubmit}>
                    <div className="row mt-4">
                        <h1 className="text-secondary form-label">Add Artist</h1>
                    </div>
                    <div className="row mt-2">
                        <input type="text" className="form-control" name="name" placeholder="Enter Name" value={formik.values.name} onBlur={formik.handleBlur} onChange={formik.handleChange} />
                        {formik.errors.name && formik.touched.name && <div className='text-danger mb-1'>{formik.errors.name}</div>}
                    </div>
                    <div className="row mt-2">
                        <textarea name="bio" className="form-control" rows={5} placeholder="Enter Bio.." value={formik.values.bio} onBlur={formik.handleBlur} onChange={formik.handleChange} ></textarea>
                        {formik.errors.bio && formik.touched.bio && <div className='text-danger mb-1'>{formik.errors.bio}</div>}
                    </div>
                    <div className="row mt-2 d-flex flex-column align-items-center">
                        {/* Hidden file input */}
                        <input
                            type="file"
                            className="form-control d-none"
                            name="profile_picture"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={(event) => {
                                formik.setFieldValue("profile_picture", event.currentTarget.files[0]);
                                handleFileChange(event)
                            }}
                        />

                        {/* Custom button to trigger file input */}
                        <button
                            className="btn btn-warning text-white mb-2"
                            onClick={handleButtonClick}
                            type="button" // Important: prevent form submission
                        >
                            Upload Profile Picture
                        </button>
                        {formik.errors.profile_picture && formik.touched.profile_picture && <div className="text-danger mb-1">{formik.errors.profile_picture}  | Profile Picture Required</div>}

                        {/* Image preview container - only shown when there's a preview */}
                        {preview && (
                            <div className="position-relative" style={{ width: '200px', height: '200px' }}>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="img-fluid rounded-circle position-absolute"
                                    style={{
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        maxHeight: '100%',
                                        maxWidth: '100%'
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="row mt-4">
                        <button type="submit" className="btn btn-primary w-100" disabled={btn} style={{ opacity: btn ? 0.5 : 1 }}>{btn ? <>
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
                        </> : "Add Artist"}</button>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default NewArtist