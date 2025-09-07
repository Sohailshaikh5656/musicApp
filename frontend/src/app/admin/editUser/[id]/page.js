"use client"
import { useParams } from "next/navigation"
import { useFormik } from "formik"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import * as Yup from 'yup';
import Layout from "../../common/layout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { editUser, updateUser } from "@/app/utils/apiHandler"
import { useRouter } from "next/navigation";
import Loader from "../../common/loader";
import { Audio } from 'react-loader-spinner';

const EditUser = () => {
    const params = useParams()
    const id = params.id
    const { data: session } = useSession()
    const [user, setUser] = useState(null)
    const [loader, setLoader] = useState(true)
    const [btn, setBtn] = useState(false)
    const router = useRouter()
    
    const initalState = {
        name: "",
        username: "",
        email: "",
    }
    const validationScehma = Yup.object({
        email: Yup.string().email().required(),
        name: Yup.string().min(3).required(),
        username: Yup.string().required()
    })
    const formik = useFormik({
        initialValues: initalState,
        validationSchema: validationScehma,
        onSubmit: async (values, { resetForm }) => {
            try{
                setBtn(true)
                values.jwtToken = session?.user?.jwtToken
                let res = await updateUser(values);
                if(res.code == 1){
                    notify("User Updated Successfully !");
                    setTimeout(()=>{
                        router.push("/admin/allUser")
                    },2000)
                }
            }catch(error){
                notify(error)
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
    const fetchData = async () => {
        if (session?.user?.jwtToken) {
            const res = await editUser({ jwtToken: session?.user?.jwtToken, id: id })
            if (res.code == 1) {
                setUser(res.data)
                setLoader(false);
                formik.setValues({
                    name : res.data.name,
                    email : res.data.email,
                    username : res.data.username
                })
            }
        } else {
            notify("Error in Fetching Data !");
            setTimeout(() => {
                router.push("/admin/allUser")
            }, 1000)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    return loader ? (
        <Loader />
    ) : (
        <Layout>
             <div className="col-10 col-sm-10 col-md-7 col-lg-7 mx-auto mt-3 mb-4 adminForm p-5">
                <h1 className="text-2xl font-bold mb-4">Edit User</h1>
                <form onSubmit={formik.handleSubmit} noValidate className="w-full">
                   <div className="row m-2">
                   <input
                            type="text"
                            id="name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="mt-1 p-2 w-full border rounded-md"
                            placeholder = "Enter Name..."
                        />
                        {formik.touched.name && formik.errors.name ? (
                            <div className="text-red-500 text-sm">{formik.errors.name}</div>
                        ) : null}
                   
                   </div>
                   <div className="row m-2">
                   <input
                            type="text"
                            id="username"
                            name="username"
                            value={ formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="mt-1 p-2 w-full border rounded-md"
                            placeholder="Enter User Name..."
                        />
                        {formik.touched.username && formik.errors.username ? (
                            <div className="text-red-500 text-sm">{formik.errors.username}</div>
                        ) : null}
                   </div>
                   <div className="row m-2">
                   <input
                            type="email"
                            id="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="mt-1 p-2 w-full border rounded-md"
                            placeholder="Enter Email..."
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-sm">{formik.errors.email}</div>
                        ) : null}
                   </div>
                   
                    <button type="submit" className="btn btn-primary w-full" disabled={btn} style={{ opacity: btn ? 0.5 : 1 }}>{btn ? <>
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
                    </> : "Update"}</button>
                </form>
                <ToastContainer />
            </div>
        </Layout>
    )
}

export default EditUser