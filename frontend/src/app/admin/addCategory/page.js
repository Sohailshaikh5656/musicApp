"use client"
import { useFormik } from "formik"
import *as Yup from 'yup'
import { useState, useEffect } from "react"
import Layout from "../common/layout"
import { Audio } from "react-loader-spinner"
import { uploadImage } from "@/app/utils/apiHandler"
import { useSession } from 'next-auth/react'
import { ToastContainer, toast } from "react-toastify"
import { addCategory } from "@/app/utils/adminApi"

const AddCategory = () => {
    const [btn , setBtn] = useState(false)
    const { data: session } = useSession()
    const [file, setFile] = useState(null)
    const initialState = {
        name: "",
        image: "",
    }
    const validationSechma = Yup.object({
        name: Yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
        image: Yup.string().required("Image is required")
    })

    const formik = useFormik({
        initialValues: initialState,
        validationSchema: validationSechma,
        onSubmit: async (values, { resetForm }) => {
            try{
                setBtn(true)
                const categoryData = {
                    name: values.name,
                    image: ""
                }
                
                if (file) {
                    let formData = new FormData();
                    formData.append("profile_img", file);
                    
                    let fileResponse = await uploadImage(formData);
                    if(fileResponse.code == 1){
                        categoryData.image = fileResponse.data;
                    } else {
                        throw new Error("Failed to upload image");
                    }
                }

                categoryData.jwtToken = session?.user?.jwtToken
                const response = await addCategory(categoryData);
                
                if(response?.code == 1){
                    notify("🎉 Category added successfully!")
                    resetForm()
                    setFile(null)
                    document.getElementById('imagePreview').innerHTML = ''
                    document.getElementById("imageBtn").innerHTML = '<i className="bi bi-file-earmark-image-fill text-success me-2"></i>Upload Image';
                } else if(response?.code == 0 || response.keyword == "Category Already Exists"){
                    notify("⚠️ Category already exists!")
                } else {
                    notify("❌ Oops! Something went wrong. Please try again.")
                }
            } catch (error) {
                notify("Error: " + error.message)
            } finally {
                setBtn(false)
            }
        }
    })

    const uploadImageEnable = () => {
        document.getElementById("categoryImage").click();
    }

    const handleImagePreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file)
            const reader = new FileReader();
            document.getElementById("imageBtn").innerText = file.name;
            reader.onload = function (e) {
                const imagePreview = document.getElementById('imagePreview');
                imagePreview.innerHTML = '';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Category Preview';
                img.style.maxWidth = '200px';
                img.style.height = 'auto';
                img.style.marginTop = '10px';
                img.style.borderRadius = '8px';
                img.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                img.style.display = "block";
                img.style.marginLeft = "auto";
                img.style.marginRight = "auto";

                imagePreview.appendChild(img);
                formik.setFieldValue('image', e.target.result);
            };
            reader.readAsDataURL(file);
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
        <Layout>
            <ToastContainer />
            <div className="container">
                <div className="row">
                    <form noValidate onSubmit={formik.handleSubmit}>
                        <div className="col-6 mx-auto mt-4 adminForm p-5">
                            <div className="row mt-3">
                                <h1 className="text-secondary d-flex align-items-center gap-2">
                                    <i className="bi bi-plus-circle-fill"></i>
                                    Add Category
                                </h1>
                            </div>
                            <div className="row mt-3">
                                <input type="text" name="name" className="form-control" placeholder="Enter category Name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                {formik.errors.name && formik.touched.name && <div className="text-danger">{formik.errors.name}</div>}
                            </div>
                            <div className="row mt-2">
                                <button
                                    className="btn btn-warning text-white" id="imageBtn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        uploadImageEnable();
                                    }}
                                >
                                    <i className="bi bi-file-earmark-image-fill text-success me-2"></i>Upload Image
                                </button>
                                {formik.errors.image && formik.touched.image && (
                                    <div className="text-danger">
                                        {formik.errors.image}
                                    </div>
                                )}
                            </div>
                            <div className="" id="imagePreview"></div>
                            <div className="row mt-2" style={{ display: 'none' }}>
                                <input
                                    type="file"
                                    name="image"
                                    id="categoryImage"
                                    onChange={(e) => { formik.handleChange(e); handleImagePreview(e) }}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className="row mt-2">
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
                                    ) : "Add Category"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default AddCategory