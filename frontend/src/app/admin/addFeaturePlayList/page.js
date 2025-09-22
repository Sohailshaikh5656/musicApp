"use client"
import { addFeaturePlayList } from "@/app/utils/adminApi"
import { useEffect, useState } from "react"
import { Formik, useFormik } from "formik"
import * as Yup from "yup"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Layout from "../common/layout"
import { Audio } from "react-loader-spinner"
import { uploadImage } from "@/app/utils/apiHandler"
import { ToastContainer, toast } from "react-toastify"
import { getCategory } from "@/app/utils/adminApi"
getCategory

const AddFeaturedPlayListPage = () =>{
    const [file, setFile] = useState()
    const [btn, setBtn] = useState(false)
    const {data:session} = useSession()
    const [category, setCategory] = useState()
    

    const fetchCategory = async()=>{
        let res = await getCategory({jwtToken : session?.user?.jwtToken})
        if(res.code == 1){
            setCategory(res.data)
        }
    }
    useEffect(()=>{
        if(session?.user?.jwtToken && !category){
            fetchCategory()
        }
    },[session?.user?.jwtToken])
    const initalState = {
        name : "",
        description : "",
        image : "",
        category_id : ""
    }
    const validationSchema = Yup.object({
        name : Yup.string().min(3).required(),
        description : Yup.string().required(),
        image : Yup.string().required(),
        category_id : Yup.string().required("Category is required").min(1, "Category cannot be empty")
    })

    const formik = useFormik({
        initialValues : initalState,
        validationSchema : validationSchema,
        onSubmit : async(values,{resetForm})=>{
            try{
                setBtn(true)
                if(!file){
                    notify("Please Upload Image !")
                    return;
                }
                const playListData = {
                    name : values.name,
                    description : values.description,
                    image : values.image,
                    category_id : values.category_id
               }
                try{
                    const formData = new FormData()
                    formData.append("profile_img",file)
                    let res = await uploadImage(formData)
                    if(res.code == 1){
                        playListData.image = res.data // Changed == to = for assignment
                    }
                }catch(error){
                    console.error("Error in Upload Image !",error)
                }
                playListData.jwtToken = session?.user?.jwtToken
                console.log("playListData #####################",playListData)
                let response = await addFeaturePlayList(playListData)
                if(response.code == 1){
                    setFile(null)
                    notify("New PlayList Created !")
                }else{
                    notify(`Error : ${response.data}`)
                }

            }catch(error){
                notify(`Error : ${error}`)
            }finally{
                setBtn(false)
                resetForm()
            }
        }
    })
    const handlePre = (e)=>{
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            formik.setFieldValue('image', file.name);
        }
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


    return (
        <>
            <Layout>
            <ToastContainer/>
                <div className="container">
                    <div className="row mt-5">
                        <div className="col-6 mx-auto p-4 adminForm">
                            <form method="post" noValidate onSubmit={formik.handleSubmit}>
                                <div className="row mx-auto">
                                    <h2 className="text-secondary d-flex align-items-center gap-2">
                                        <i className="bi bi-music-note-list fs-3"></i>
                                        Create New Featured PlayList
                                    </h2>
                                </div>

                                <div className="row mt-3">
                                    <input className="form-control p-2" name="name" placeholder="Enter Name of PlayList ... " value={formik.values.name} onBlur={formik.handleBlur} onChange={formik.handleChange} />
                                    {formik.errors.name && formik.touched.name && <div className="text-danger">{formik.errors.name}</div>}
                                </div>
                                <div className="row mt-3">
                                    <textarea className="form-control p-2" name="description" placeholder="Enter Description of PlayList ... " value={formik.values.description} onBlur={formik.handleBlur} onChange={formik.handleChange}></textarea>
                                    {formik.errors.description && formik.touched.description && <div className="text-danger">{formik.errors.description}</div>}
                                </div>
                                <div className="row mt-3">
                                    <select 
                                        className="form-select" 
                                        name="category_id" 
                                        value={formik.values.category_id} 
                                        onChange={formik.handleChange} 
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value={""}>-- Select Category --</option>
                                        {category && category.map((item, index) => (
                                            <option key={index} value={item.id} style={{textTransform:"capitalize"}}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    {formik.errors.category && formik.touched.category && <div className="text-danger">{formik.errors.category}</div>}
                                </div>
                                <div className="row mt-3">
                                    <a className="btn btn-warning text-white p-3" onClick={()=>{
                                        document.getElementById("image").click()
                                    }}><i className="bi bi-image me-2"></i>Upload Image</a>
                                    {formik.errors.image && formik.touched.image && <div className="text-danger">{formik.errors.image}</div>}
                                </div>
                                <div className="row mt-3">
                                    {file && (
                                        <div className="preview-image-container d-flex justify-content-center align-item-center">
                                            <img 
                                                src={URL.createObjectURL(file)} 
                                                alt="Preview" 
                                                className="preview-image"
                                                style={{
                                                    maxWidth: '200px',
                                                    maxHeight: '200px',
                                                    borderRadius: '8px',
                                                    marginTop: '10px'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="row mt-3" style={{display:"none"}}>
                                    <input type="file" id="image" name="image" onBlur={formik.handleBlur} onChange={(e)=>{
                                        formik.handleChange;
                                        handlePre(e)
                                    }} />
                                </div>
                                <div className="row mt-3 p-2">
                                <button type="submit" className="btn btn-primary w-100 p-3" disabled={btn} style={{opacity: btn ? 0.5 : 1}}>{btn ? <>
                                            <div className="d-flex justify-content-center align-items-center" style={{height: '100%'}}>
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
                                        </>:"Add PlayList"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default AddFeaturedPlayListPage