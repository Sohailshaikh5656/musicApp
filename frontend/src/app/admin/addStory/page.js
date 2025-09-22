"use client"
import { useFormik } from "formik"
import *as Yup from 'yup'
import { useState, useEffect } from "react"
import Layout from "../common/layout"
import { Audio } from "react-loader-spinner"
import { useSession } from 'next-auth/react'
import { ToastContainer, toast } from "react-toastify"
import { addStory } from "@/app/utils/adminApi"

const AddStory = () => {
    const [btn , setBtn] = useState(false)
    const { data: session } = useSession()
    const initialState = {
        title: "",
        description: "",
        star_name : "",
    }
    const validationSechma = Yup.object({
        title: Yup.string().min(3, "Title must be at least 3 characters").required("Title is required"),
        description: Yup.string().min(64, "Description must be at least 64 characters").required("Description is required"),
        star_name: Yup.string().min(3, "Name must be at least3 characters").required("Name is required"),
    })

    const formik = useFormik({
        initialValues: initialState,
        validationSchema: validationSechma,
        onSubmit: async (values, { resetForm }) => {
            try{
                setBtn(true)
                const storyData = {
                    title : values.title,
                    description:values.description,
                    star_name : values.star_name
                }

                storyData.jwtToken = session?.user?.jwtToken
                const response = await addStory(storyData);
                
                if(response?.code == 1){
                    notify("🎉 Story added successfully!")
                    resetForm()
                } else {
                    notify("❌ Oops! Something went wrong. Please try again.")
                    //  notify(response?.data)
                }
            } catch (error) {
                notify("Error: " + error.message)
            } finally {
                setBtn(false)
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

    return (
        <Layout>
            <ToastContainer />
            <div className="container">
                <div className="row">
                    <form noValidate onSubmit={formik.handleSubmit}>
                        <div className="col-6 mx-auto mt-4 adminForm p-5">
                            <div className="row mt-3">
                                <h1 className="text-secondary d-flex align-items-center gap-2">
                                    <i className="bi bi-plus-circle-fill"></i>
                                    Add Song Stories
                                </h1>
                            </div>
                            <div className="row mt-3">
                                <input type="text" name="title" className="form-control" placeholder="Enter Title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                {formik.errors.title && formik.touched.title && <div className="text-danger">{formik.errors.title}</div>}
                            </div>
                            <div className="row mt-3">
                                <input type="text" name="star_name" className="form-control" placeholder="Enter Name" value={formik.values.star_name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                {formik.errors.star_name && formik.touched.star_name && <div className="text-danger">{formik.errors.star_name}</div>}
                            </div>
                            <div className="row mt-3">
                                <textarea type="text" name="description" className="form-control" placeholder="Enter Description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} ></textarea>
                                {formik.errors.description && formik.touched.description && <div className="text-danger">{formik.errors.description}</div>}
                            </div>
                            <div className="row mt-4">
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
                                    ) : "Add Song Story"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default AddStory