"use client"
import { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { ForgetPassword } from "@/app/utils/apiHandler"
import Layout from "../common/layout"
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link"
import { Audio } from "react-loader-spinner"

const ForgetPasswordPage = () =>{
    const [btn, setBtn] = useState(false)
    const initalState = {
        emailOrUsername : ""
    }
    const validationSchema = Yup.object({
        emailOrUsername : Yup.string().required("Email or Username Required !")
    })

    const formik = useFormik({
        initialValues : initalState,
        validationSchema : validationSchema,
        onSubmit : async(values,{resetForm})=>{
            try{
                setBtn(true)
                const data ={
                    emailOrUsername : values.emailOrUsername
                }
                let res = await ForgetPassword(data)
                if(res.code == 1){
                    notify("Email Sent !")
                }else if(res.code == 2){
                    notify("Email or Username not found")
                }else if(res.code == 12){
                    notify(`${res.data}`)
                }else{
                    notify("Something Went Wrong 2")
                }
            }catch(error){
                notify("Something Went Wrong !")
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

    return (
        <div>
            <ToastContainer />
            <div
                style={{
                    backgroundImage: "url('/assets/user/images/backImage.png')",
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    width: '100%',
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >

                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 mt-5 rounded overflow-hidden" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                            <div className="row g-0 align-items-stretch" style={{ minHeight: '400px' }}>
                                {/* Left Image */}
                                <div className="col-lg-7 col-md-7 col-sm-4 p-0">
                                    <img
                                        src="/assets/user/images/sigin_image.png"
                                        alt="Image"
                                        style={{

                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '10px 0 0 10px',
                                            objectFit: 'cover',
                                            background: 'linear-gradient(to bottom right, rgba(128, 0, 128, 0.6), rgba(0, 0, 255, 0.6))',
                                            backdropFilter: 'blur(10px)',
                                            WebkitBackdropFilter: 'blur(10px)',
                                        }}
                                    />
                                </div>

                                {/* Right Form */}
                                <div className="col-lg-5 col-md-5 col-sm-8 p-4 d-flex align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
                                    <form className="w-100" onSubmit={formik.handleSubmit} noValidate>
                                        <h2 className="mb-4 ml-1 text-primary">Forget Passsword ?</h2>
                                        <div className="form-group mb-3">
                                            <input type="text" className="form-control" placeholder="Enter Email" style={{ borderBottom: "1px solid blue" }} name="emailOrUsername" value={formik.values.emailOrUsername} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                            {formik.errors.emailOrUsername && formik.touched.emailOrUsername && <div className="text-danger" style={{ fontSize: "13px" }}>{formik.errors.emailOrUsername}</div>}
                                        </div>
                                        

                                        <div className="form-group mb-3">
                                            <Link href="signin" className="text-primary" style={{ textDecoration: "none", fontSize: "13px" }}>Login ?</Link>
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100" disabled={btn} style={{opacity: btn ? 0.5 : 1}}>{btn ? <>
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
                                        </>:"Submit"}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgetPasswordPage