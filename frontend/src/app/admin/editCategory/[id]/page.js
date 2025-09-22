"use client"
import { useState, useEffect } from "react"
import { uploadImage } from "@/app/utils/apiHandler"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { updateCategory } from "@/app/utils/adminApi"
import { useRouter } from "next/navigation"
import Layout from "../../common/layout"
import Image from "next/image"
import { ToastContainer, toast } from "react-toastify"
import { getCategory } from "@/app/utils/adminApi"

const EditCategory = () => {
    const params = useParams()
    const id = params.id
    const router = useRouter()
    const [category, setCategory] = useState([])
    const {data:session} = useSession()
    const[btn, setBtn] = useState(false)
    const [image, setimage] = useState(false)
    const [file, setFile] = useState()
    const initalState = {
        name : "",
        image : ""
    }
    const validationSchemea = Yup.object({
        name : Yup.string().min(3).required(),
        image : Yup.string().optional()
    })

    const formik = useFormik({
        initialValues : initalState,
        validationSchema : validationSchemea,
        onSubmit : async(values,{resetForm})=>{
            try{
                setBtn(true)
                if(image){
                    let formData = new FormData()
                    formData.append("profile_img", file);
                    let res = await uploadImage(formData)
                    if(res.code==1){
                        const updateData = {
                            name : values.name,
                            image : res.data,
                            jwtToken : session?.user?.jwtToken,
                            id: category.id
                        }
                        const updateResponse = await updateCategory(updateData)
                        if(updateResponse.code == 1){
                            notify("category updated Suceessfully !")
                            setTimeout(()=>{
                                router.push("/admin/allCategory")
                            },3000)
                        }else{
                            notify("Error updating category. Please try again.")
                            console.log("Update Error:", updateResponse)
                        }
                    }else{
                        notify("Error in uploading image. Please try again.")
                        console.log("Image Upload Error:", res)
                    }

                }else{
                    const updateData = {
                        name : values.name,
                        jwtToken : session?.user?.jwtToken,
                        id: category.id
                    }
                    const updateResponse = await updateCategory(updateData)
                    if(updateResponse.code == 1){
                        notify("category updated Suceessfully !")
                        setTimeout(()=>{
                            router.push("/admin/allCategory")
                        },3000)
                    }else{
                        notify("Error updating category. Please try again.")
                        console.log("Update Error:", updateResponse)
                    }
                }
            }catch(error){
                notify(`Error : ${error}`)
            }finally{
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
    const fetchCategory = async() =>{
        const res = await getCategory({jwtToken:session?.user?.jwtToken, id : id})
        if(res.code == 1){
            setCategory(res.data)
            formik.setValues({
                name: res.data.name,
                image: res.data.image
            });
        }
    }

    useEffect(()=>{
        if(session?.user?.jwtToken && (!category || category.length == 0 )){
            fetchCategory()
        }
    },[session])

    const handleImage = (e)=>{
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setimage(true);
            document.getElementById("uploadBtn").innerHTML = `<i class="bi bi-file-earmark-image me-2"></i> ${file.name}`;
            const reader = new FileReader();
            reader.onload = (e) => {
                const oldPreview = document.getElementById('oldPreview');
                const newImage = document.getElementById('newImage');
                
                if (newImage) {
                    newImage.innerHTML = ''; // Clear previous content
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'previewImageContainer';
                    img.width = 300;
                    img.height = 200;
                    img.alt = 'New Category Preview';
                    newImage.appendChild(img);
                    
                    if (oldPreview) {
                        oldPreview.style.display = 'none';
                    }
                    newImage.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        }
    }

    return(
        <Layout>
            <ToastContainer />
            {category && category.image ? <>
                <div className="container">
                <div className="row mt-4">
                    <div className="col-6 mx-auto mt-3 adminForm p-5">
                        <form noValidate onSubmit={formik.handleSubmit}>
                        <div className="row mt-3">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                            <i className="bi bi-pencil-square me-2"></i>
                            Edit Category
                        </h2>
                        </div>
                            <div className="row mt-3">
                                <input 
                                    className="form-control" 
                                    name="name" 
                                    type="text" 
                                    onBlur={formik.handleBlur} 
                                    onChange={formik.handleChange} 
                                    value={formik.values.name || ''}
                                    placeholder="Enter category name"
                                    style={{padding: '8px', fontSize: '16px'}}
                                />
                                {formik.errors.name && formik.touched.name && <div className="text-danger">{formik.errors.name}</div>}
                            </div>
                            <div className="row mt-3 imageContainerPre" id="oldPreview">
                                <img 
                                    className="previewImageContainer" 
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${category.image}`} 
                                    width={300} 
                                    height={200} 
                                    alt="Category Preview" 
                                />
                            </div>
                            <div className="row mt-3 imageContainerPre" id="newImage" style={{display:"none"}}>
                            </div>
                            <div className="row mt-3">
                                <button 
                                    type="button" 
                                    className="btn btn-warning text-white"
                                    id="uploadBtn"
                                    onClick={() => document.getElementById("categoryImage").click()}
                                >
                                    <i className="bi bi-upload me-2"></i>Upload New Image
                                </button>
                            </div>
                            <div className="row" style={{display:"none"}}>
                                <input 
                                    type="file" 
                                    name="categoryImage" 
                                    id="categoryImage" 
                                    onChange={handleImage} 
                                />
                            </div>
                            <div className="row mt-3">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={btn}
                                >
                                    {btn ? 'Updating...' : 'Update Category'}
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