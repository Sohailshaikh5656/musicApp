"use client"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useEffect, useState } from "react"
import Layout from "../../common/layout"
import { Audio } from "react-loader-spinner"
import { uploadImage } from '@/app/utils/apiHandler'
import { useSession } from 'next-auth/react'
import { ToastContainer, toast } from "react-toastify"
import { getAllPodCast } from "@/app/utils/adminApi"
import { useParams, useRouter } from "next/navigation"
import Loader from "../../common/loader"


const EditPodCast = () => {
    const [btn, setBtn] = useState(false)
    const { data: session } = useSession()
    const [videoFile, setVideoFile] = useState(null)
    const [thumbFile, setThumbFile] = useState(null)
    const [podCast, setPodCast] = useState(null)
    const params = useParams()
    const id = params.id

    const initialState = {
        title: "",
        taken_by: "",
        description: "",
        duration: "",
        video: "",
        thumbnail: ""
    }

    const validationSchema = Yup.object({
        title: Yup.string().min(3, "Title must be at least 3 characters").required("Title is required"),
        taken_by: Yup.string().min(3, "Name must be at least 3 Characters").required("Name is required"),
        description: Yup.string().min(8, "Description must be at least 8 Characters").required("Description is required"),
        duration: Yup.number().required("Duration is required"),
        video: Yup.string().required("Video is required"),
        thumbnail: Yup.string().required("Thumbnail is required")
    })

    const formik = useFormik({
        initialValues: initialState,
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                setBtn(true)

                let podCastData = {
                    title: values.title,
                    taken_by: values.taken_by,
                    description: values.description,
                    duration: values.duration,
                    video: values.video,
                    thumbnail: values.thumbnail
                }

                // Upload video
                if (videoFile) {
                    let formData = new FormData()
                    formData.append("profile_img", videoFile)
                    let res = await uploadImage(formData)
                    if (res.code == 1) {
                        podCastData.video = res.data
                    } else {
                        throw new Error("Video upload failed")
                    }
                }

                // Upload thumbnail
                if (thumbFile) {
                    let formData = new FormData()
                    formData.append("profile_img", thumbFile)
                    let res = await uploadImage(formData)
                    if (res.code == 1) {
                        podCastData.thumbnail = res.data
                    } else {
                        throw new Error("Thumbnail upload failed")
                    }
                }

                console.log("Data : ==============",podCastData)

                podCastData.jwtToken = session?.user?.jwtToken
                const response = await addPodCast(podCastData)
                console.log("Response : ========",response)

                if (response?.code == 1) {
                    notify("🎉 Podcast added successfully!")
                    resetForm()
                    setVideoFile(null)
                    setThumbFile(null)
                    document.getElementById("videoPreview").innerHTML = ""
                    document.getElementById("thumbnailPreview").innerHTML = ""
                } else {
                    notify("❌ Oops! Something went wrong.")
                }
            } catch (error) {
                notify("Error: " + error.message)
            } finally {
                setBtn(false)
            }
        }
    })

    const fetchData = async()=>{
        try{
            const res = await getAllPodCast({jwtToken:session?.user?.jwtToken, id : id})
            console.log("DATA : ===================",res)
            if(res?.code == 1){
                console.log("DATA : ===================",res)
                formik.setValues({
                    title : res.data.title,
                    taken_by : res.data.taken_by,
                    description : res.data.description,
                    duration : res.data.duration,
                    video : res.data.video,
                    thumbnail : res.data.thumbnail
                })
                setPodCast(res.data)
            }else{
                notify(res.data)
            }
        }catch(error){
            notify(error)
        }
    }

    useEffect(()=>{
        if(session?.user?.jwtToken && !podCast){
            fetchData()
        }
    },[session?.user?.jwtToken])

    // ================= PREVIEW HANDLERS =================
    const handleVideoPreview = (e) => {
        const file = e.target.files[0]
        if (file) {
            setVideoFile(file)
            const url = URL.createObjectURL(file)
            const preview = document.getElementById("videoPreview")
            preview.innerHTML = `
                <video width="320" height="240" controls 
                    style="border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.3)">
                    <source src="${url}" type="${file.type}">
                    Your browser does not support the video tag.
                </video>
            `
            formik.setFieldValue("video", file.name)
        }
    }

    const handleThumbnailPreview = (e) => {
        const file = e.target.files[0]
        if (file) {
            setThumbFile(file)
            const reader = new FileReader()
            reader.onload = function (ev) {
                const preview = document.getElementById("thumbnailPreview")
                preview.innerHTML = `
                    <img src="${ev.target.result}" alt="Thumbnail Preview"
                        style="max-width:200px; height:auto; border-radius:8px; 
                        box-shadow:0 4px 10px rgba(0,0,0,0.3)" />
                `
                formik.setFieldValue("thumbnail", file.name)
            }
            reader.readAsDataURL(file)
        }
    }

    // ================= TOAST =================
    const notify = (msg) => {
        toast(msg, { position: "top-right", autoClose: 3000 })
    }
    if(!podCast){
        return <Loader></Loader>
    }
    return (
        <Layout>
            <ToastContainer />
            <div className="container">
                <div className="row">
                    <form noValidate onSubmit={formik.handleSubmit}>
                        <div className="col-sm-6 col-md-7 col-lg-7 col-xl-7 mx-auto mt-4 adminForm p-5">
                            <h1 className="text-secondary d-flex align-items-center gap-2">
                                <i className="bi bi-plus-circle-fill"></i>
                                Add New Podcast
                            </h1>

                            {/* Title */}
                            <div className="row mt-3">
                                <input type="text" name="title" className="form-control"
                                    placeholder="Enter Title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                                {formik.errors.title && formik.touched.title &&
                                    <div className="text-danger">{formik.errors.title}</div>}
                            </div>

                            {/* Taken By */}
                            <div className="row mt-3">
                                <input type="text" name="taken_by" className="form-control"
                                    placeholder="Taken By"
                                    value={formik.values.taken_by}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                                {formik.errors.taken_by && formik.touched.taken_by &&
                                    <div className="text-danger">{formik.errors.taken_by}</div>}
                            </div>

                            {/* Description */}
                            <div className="row mt-3">
                                <textarea name="description" className="form-control"
                                    placeholder="Enter Description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}></textarea>
                                {formik.errors.description && formik.touched.description &&
                                    <div className="text-danger">{formik.errors.description}</div>}
                            </div>

                            {/* Duration */}
                            <div className="row mt-3">
                                <input type="number" name="duration" className="form-control"
                                    placeholder="Enter Duration in Seconds"
                                    value={formik.values.duration}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                                {formik.errors.duration && formik.touched.duration &&
                                    <div className="text-danger">{formik.errors.duration}</div>}
                            </div>

                            {/* Video Upload */}
                            <div className="mb-3 mt-3">
                                <label className="form-label fw-bold">Upload New Podcast Video</label>
                                <div
                                    className="border border-2 rounded-3 p-4 text-center bg-dark bg-opacity-75 text-white"
                                    style={{ cursor: "pointer", borderStyle: "dashed" }}
                                    onClick={() => document.getElementById("podcastVideo").click()}
                                >
                                    <i className="bi bi-camera-reels-fill text-warning display-4"></i>
                                    <p className="mt-2 mb-0">Click or Drag & Drop to Upload Video</p>
                                </div>
                                <input type="file" id="podcastVideo" accept="video/*"
                                    className="d-none"
                                    onChange={handleVideoPreview} />
                            </div>

                            {/* Old Vedio */}
                            {podCast?.video && <>
                                <label className="form-label fw-bold text-secondary">Previous PodCast</label>
                                <div id="videoPreview" className="mt-3 text-center">
                                 <video
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${podCast?.video}`}
                                    alt="video"
                                    className="h4 text-secondary"
                                    controls
                                    style={{ maxWidth: '250px', height: 'auto', borderRadius:"4%" }}
                                    />
                            </div>
                            </>}
                            {formik.errors.video && formik.touched.video &&
                                <div className="text-danger">{formik.errors.video}</div>}

                            {/* Thumbnail Upload */}
                            <div className="mb-3 mt-4">
                                <label className="form-label fw-bold">Upload New Thumbnail</label>
                                <div
                                    className="border border-2 rounded-3 p-4 text-center bg-dark bg-opacity-75 text-white"
                                    style={{ cursor: "pointer", borderStyle: "dashed" }}
                                    onClick={() => document.getElementById("thumbnailImage").click()}
                                >
                                    <i className="bi bi-file-earmark-image-fill text-warning display-4"></i>
                                    <p className="mt-2 mb-0">Click or Drag & Drop to Upload Thumbnail</p>
                                </div>
                                <input type="file" id="thumbnailImage" accept="image/*"
                                    className="d-none"
                                    onChange={handleThumbnailPreview} />
                            </div>

                            {/* Old Image */}
                            {podCast?.thumbnail && <>
                            <label className="form-label fw-bold text-secondary">Previous Thumbnail</label>
                            <div id="thumbnailPreview" className="mt-3 text-center">
                                <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${podCast?.thumbnail}`} alt="Thumbnail Preview"
                                    style={{maxWidth:"200px",height:"auto", borderRadius:"8px" 
                                    ,boxShadow:"0 4px 10px rgba(0,0,0,0.3)"}} />
                            </div>
                            </>}
                            {formik.errors.thumbnail && formik.touched.thumbnail &&
                                <div className="text-danger">{formik.errors.thumbnail}</div>}

                            {/* Submit Button */}
                            <div className="row mt-3">
                                <button type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={btn}
                                    style={{ opacity: btn ? 0.5 : 1 }}>
                                    {btn ? (
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                                            <Audio height="30" width="60" color="#fff" ariaLabel="audio-loading" visible={true} />
                                        </div>
                                    ) : "Add Podcast"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default EditPodCast
