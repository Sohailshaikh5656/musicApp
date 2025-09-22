"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { updateStory } from "@/app/utils/adminApi"
import { useRouter } from "next/navigation"
import Layout from "../../common/layout"
import Image from "next/image"
import { ToastContainer, toast } from "react-toastify"
import { getAllStory } from "@/app/utils/adminApi"

const EditCategory = () => {
    const params = useParams()
    const id = params.id
    const router = useRouter()
    const [story, setStory] = useState([])
    const {data:session} = useSession()
    const [btn, setBtn] = useState(false)
    const initalState = {
        title : "",
        description : "",
        star_name : "",
    }
    const validationSchemea = Yup.object({
        title : Yup.string().min(3).required(),
        description : Yup.string().min(64).required(),
        star_name : Yup.string("Name Should be String").min(3, "Name should be at least 3 Character Long").required("Name Required !"),
    })

    const formik = useFormik({
        initialValues : initalState,
        validationSchema : validationSchemea,
        onSubmit : async(values,{resetForm})=>{
            try{
                setBtn(true)
                const updateData = {
                    title : values.title,
                    star_name : values.star_name,
                    description : values.description,
                    jwtToken : session?.user?.jwtToken,
                    id : id
                }
                const updateResponse = await updateStory(updateData)
                if(updateResponse.code == 1){
                    notify("Story updated Suceessfully !")
                    resetForm()
                    setTimeout(()=>{
                        router.push("/admin/allStory")
                    },3000)
                }else{
                    notify("Error updating Story. Please try again.")
                    console.log("Update Error:", updateResponse)
                }
            }catch(error){
                notify(`Error : ${error}`)
            }
        }
    })
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
    const fetchStory = async() =>{
        const res = await getAllStory({jwtToken:session?.user?.jwtToken, id : id})
         console.log("Data=========== : ",res)
        if(res.code == 1){
            setStory(res.data)
            formik.setValues({
                title: res.data.title,
                star_name : res.data.star_name,
                description : res.data.description
            });
        }
    }

    useEffect(()=>{
        if(session?.user?.jwtToken && (!story || story.length == 0 )){
            fetchStory()
        }
    },[session])

    return(
        <Layout>
            <ToastContainer />
            {story ? <>
                <div className="container">
                <div className="row mt-4">
                    <div className="col-6 mx-auto mt-3 adminForm p-5">
                        <form noValidate onSubmit={formik.handleSubmit}>
                        <div className="row mt-3">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                            <i className="bi bi-pencil-square me-2"></i>
                            Edit Story
                        </h2>
                        </div>
                            <div className="row mt-3">
                                <input 
                                    className="form-control" 
                                    name="title" 
                                    type="text" 
                                    onBlur={formik.handleBlur} 
                                    onChange={formik.handleChange} 
                                    value={formik.values.title || ''}
                                    placeholder="Enter Title"
                                    style={{padding: '8px', fontSize: '16px'}}
                                />
                                {formik.errors.title && formik.touched.title && <div className="text-danger">{formik.errors.title}</div>}
                            </div>
                            <div className="row mt-3">
                                <input 
                                    className="form-control" 
                                    name="star_name" 
                                    type="text" 
                                    onBlur={formik.handleBlur} 
                                    onChange={formik.handleChange} 
                                    value={formik.values.star_name || ''}
                                    placeholder="Enter Title"
                                    style={{padding: '8px', fontSize: '16px'}}
                                />
                                {formik.errors.star_name && formik.touched.star_name && <div className="text-danger">{formik.errors.star_name}</div>}
                            </div>
                            <div className="row mt-3">
                                <textarea 
                                    className="form-control" 
                                    name="description" 
                                    type="text" 
                                    onBlur={formik.handleBlur} 
                                    onChange={formik.handleChange} 
                                    value={formik.values.description || ''}
                                    placeholder="Enter Title"
                                    style={{padding: '8px', fontSize: '16px'}}
                                    rows={5}
                                ></textarea>
                                {formik.errors.description && formik.touched.description && <div className="text-danger">{formik.errors.description}</div>}
                            </div>
                            
                            <div className="row mt-3">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={btn}
                                >
                                    {btn ? 'Updating...' : 'Update Story'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </>:<>
            <div className="container">
                <div className="row mt-4">
                    <div className="col-6 mx-auto mt-3 adminForm p-4 text-center">
                        <h3 className="text-danger">Error: Category not found</h3>
                        <p>Please check the category ID and try again.</p>
                    </div>
                </div>
            </div>
            </>}
        </Layout>
    )
}

export default EditCategory