"use client"
import Navbar from "../common/navbar";
import Link from "next/link";
import * as Yup from 'yup'
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignIn } from "@/app/utils/apiHandler";
import { Audio } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import Cookies from 'js-cookie';
import { useSession,signOut, signIn } from "next-auth/react"
import Layout from "../common/layout";
const Signin = () => {
    
    const route = useRouter()
    const initalState = {
        name : "",
        email: "",
        password: ""
    }

    const validationSchema = Yup.object({
        email: Yup.string().email("Valid Email Required").required("Email Required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
            .required("Password is required"),
    })
    const [btn, setBtn] = useState(false)
    const formik = useFormik({
        initialValues: initalState,
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setBtn(true)
            console.log(values)
            try{
                const data = {
                    email : values.email,
                    password : values.password
                }
                const res = await signIn("credentials",{
                    email: values.email,
                    password: values.password,
                    loginType: "S",
                    role:"user",
                    redirect: false // Set redirect to false to handle it manually
                });

                if (!res?.error) {
                    // Successful sign in
                    route.push("/");
                } else {
                    // Handle error
                    notify(res.error);
                }
                
            }catch(error){
                notify(`Error ! ${error}`)
            }finally{
                setTimeout(()=>{
                    setBtn(false)
                },2000)
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
                                <div className="col-md-8 mt-5 rounded overflow-hidden" style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', transition: 'transform 0.3s' }}>
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
                                                    transition: 'transform 0.3s',
                                                }}
                                            />
                                        </div>

                                        {/* Right Form */}
                                        <div className="col-lg-5 col-md-5 col-sm-8 p-4 d-flex align-items-center" style={{ backgroundColor: '#ffffff', borderRadius: '0 10px 10px 0', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                                            <form className="w-100" onSubmit={formik.handleSubmit} noValidate>
                                                <h2 className="mb-4 text-primary">Sign In</h2>
                                                <div className="form-group mb-3">
                                                    <input type="text" className="form-control" placeholder="Enter Email" style={{ borderBottom: "2px solid blue", transition: 'border-color 0.3s' }} name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                    {formik.errors.email && formik.touched.email && <div className="text-danger" style={{ fontSize: "13px" }}>{formik.errors.email}</div>}
                                                </div>
                                                <div className="form-group mb-3">
                                                    <input type="password" className="form-control" placeholder="Enter Password" style={{ borderBottom: "2px solid blue", transition: 'border-color 0.3s' }} name="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                    {formik.errors.password && formik.touched.password && <div className="text-danger" style={{ fontSize: "13px" }}>{formik.errors.password}</div>}
                                                </div>

                                                <div className="form-group mb-3">
                                                    <Link href="forgetPassword" className="text-primary" style={{ textDecoration: "none", fontSize: "13px" }}>Forget Password?</Link>
                                                </div>
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
                                                </> : "Sign In"}</button>
                                                {/* BEGIN: Link for account creation */}
                                                <div className="form-group mb-3" style={{ marginTop: '10px' }}>
                                                    <Link href="signup" className="text-primary" style={{ textDecoration: "underline", fontSize: "13px" }}>Don't have an account?</Link>
                                                    <Link href="signup" className="text-primary" style={{ textDecoration: "none", fontSize: "13px" }}>    Sign Up</Link>
                                                </div>
                                                {/* END: Link for account creation */}
                                        
                                        <div className="d-flex align-items-center my-3">
                                            <hr className="flex-grow-1" />
                                            <span className="mx-2 text-muted">or</span>
                                            <hr className="flex-grow-1" />
                                        </div>
                                        <button type="button" className="btn mb-4 w-100 mt-1 d-flex justify-content-center align-items-center" onClick={(e) => {
                                            e.preventDefault();
                                            signIn('google', {
                                                callbackUrl: "/"
                                            })
                                        }} style={{ backgroundColor: '#333333', color: '#ffffff', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', transition: 'background-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#555555'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#333333'}>
                                            <i className="bi bi-google" style={{ marginRight: '8px' }}></i>Sign In with Google
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Signin;
