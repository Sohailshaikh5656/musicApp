"use client"
import Navbar from "../common/navbar";
import Link from "next/link";
import * as Yup from 'yup'
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import apiClient from "@/app/utils/apiClient";
import { encrypt } from "@/app/utils/encription";
import { SignUp } from "@/app/utils/apiHandler";
import { useState } from "react";
import { Audio } from "react-loader-spinner";
import { getToken } from 'next-auth/jwt';
import { signIn } from "next-auth/react";
import Layout from "../common/layout";

const Signup = () => {
    const [btn,setBtn] = useState(false)
    const [passwordString, setPasswordString] = useState()
    const route = useRouter()
    const initalState = {
        name : "",
        email: "",
        password: "",
        confirmPassword: "",
        termAndConditions: ""
    }
    const validationSchema = Yup.object({
        name : Yup.string().required("Name Required"),
        email: Yup.string().email("Valid Email Required").required("Email Required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
            termAndConditions: Yup.boolean()
            .oneOf([true], 'You must accept the terms and conditions')
            .required('You must accept the terms and conditions'),
    })

    const formik = useFormik({
        initialValues: initalState,
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setBtn(true)
            console.log(values)
            try{
                const data = {
                    name:values.name,
                    email : values.email,
                    password : values.password,
                    loginType : "S"
                }
                const res = await SignUp(data)
                if(res.code == 1){
                    await signIn("credentials",{
                        email:values.email,
                        password : values.password,
                        loginType : "S",
                        role:"user",
                        redirect:false
                    })
                    notify("🎉 Register Successfully & Logged In ! 🎉")
                    resetForm()
                    setTimeout(()=>{
                        setBtn(false)
                        setPasswordString("")
                        route.push("/")
                    },2000)
                }else{
                    if(res.code == 0 && res.keyword == "Email Already Exits"){
                        notify("📧 Email Already Registered! | 🚪 Try To Login!")
                        resetForm()
                    } else{
                        notify("❌ Something Went Wrong! ❌")
                        console.log(res)
                    }
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
    const checker = (str) => {
        let counter = 0;
        if(/[a-z]/.test(str)){
            counter++
        }
        if(/[A-Z]/.test(str)){
            counter++
        }
        if(/[0-9]/.test(str)){
            counter++
        }
        if(/[@#$%^&*+-]/.test(str)){
            counter++
        }
        return counter
    }
    const strength = (str) => {
        // Ensure we're working with the value property if it's an event target
        const password = str.value ? str.value : str;
        
        if(password.length >= 8 && checker(password) === 4){
            setPasswordString("strong")
        }else if(checker(password) > 2){
            setPasswordString("medium")
        }else{
            setPasswordString("weak")
        }
    }
    const style = {
        boxShadow: '0 4px 6px -1px #f50909, 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
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
                <div className="container mb-5">
                    <div className="row justify-content-center mb-4">
                        <div className="col-md-8 mt-5 rounded overflow-hidden" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                            <div className="row g-0 align-items-stretch" style={{ minHeight: '400px' }}>
                                {/* Left Image */}
                                <div className="col-md-7 col-lg-7 col-sm-4 p-0">
                                    <img
                                        src="/assets/user/images/signUp_image.png"
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
                                <div className="col-md-5 col-lg-5 col-sm-8 p-4 d-flex align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
                                    <form className="w-100" onSubmit={formik.handleSubmit} noValidate>
                                        <h2 className="mb-4 ml-1 text-primary">Sign Up</h2>
                                        <div className="form-group mb-3">
                                            <input type="text" className="form-control" placeholder="Enter Name" style={{ borderBottom: "1px solid blue" }} name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                            {formik.errors.name && formik.touched.name && <div className="text-danger" style={{ fontSize: "13px" }}>{formik.errors.name}</div>}
                                        </div>
                                        <div className="form-group mb-3">
                                            <input type="text" className="form-control" placeholder="Enter Email" style={{ borderBottom: "1px solid blue" }} name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                            {formik.errors.email && formik.touched.email && <div className="text-danger" style={{ fontSize: "13px" }}>{formik.errors.email}</div>}
                                        </div>
                                        <div className="form-group mb-3">
                                            <input type="password" className="form-control" placeholder="Enter Password" style={{ borderBottom: "1px solid blue" }} name="password" value={formik.values.password} onChange={(e)=>{formik.handleChange(e); strength(e.target)}} onBlur={formik.handleBlur} />
                                            {formik.errors.password && formik.touched.password && <div className="text-danger" style={{ fontSize: "13px" }}>{formik.errors.password}</div>}
                                        </div>
                                        <div className="form-group mb-3">
                                            <input type="password" className="form-control" placeholder="Confirm Password" style={{ borderBottom: "1px solid blue" }} name="confirmPassword" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                            {formik.errors.confirmPassword && formik.touched.confirmPassword && <div className="text-danger" style={{ fontSize: "13px" }}>{formik.errors.confirmPassword}</div>}
                                        </div>
                                        {passwordString && <small className="mb-1 ml-1" style={{textTransform:"capitalize"}}>{passwordString}</small>}
                                        {passwordString && 
                                            <div className="d-flex gap-1 mb-2">
                                                <div 
                                                    className={`${passwordString === 'weak' ? 'bg-danger' : passwordString === 'medium' ? 'bg-warning' : 'bg-success'}`} 
                                                    style={{height:"10px", width:"80px"}}
                                                ></div>
                                                <div 
                                                    className={`${passwordString === 'weak' ? 'bg-transparent' : passwordString === 'medium' ? 'bg-warning' : 'bg-success'}`} 
                                                    style={{height:"10px", width:"80px"}}
                                                ></div>
                                                <div 
                                                    className={`${passwordString === 'weak' || passwordString === 'medium' ? 'bg-transparent' : 'bg-success'}`} 
                                                    style={{height:"10px", width:"80px"}}
                                                ></div>
                                            </div>
                                        }
                                        <div className="row mb-2">
                                            <div className="form-group">
                                                <input 
                                                    type="checkbox" 
                                                    name="termAndConditions" 
                                                    checked={Boolean(formik.values.termAndConditions)} 
                                                    onBlur={formik.handleBlur} 
                                                    onChange={(e) => formik.setFieldValue('termAndConditions', e.target.checked)}
                                                />&nbsp;
                                                <label className="text-dark termAndConditions" style={{fontSize:"11px"}}>
                                                    I agree to the <b className="text-primary"><Link href="#">Term and Conditions </Link></b>
                                                </label>
                                            </div>
                                            {formik.errors.termAndConditions && formik.touched.termAndConditions && (
                                                <div className="text-danger display-block">
                                                    {formik.errors.termAndConditions}
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group mb-3">
                                            <Link href="/user/signin" className="text-primary" style={{ textDecoration: "none", fontSize: "12px" }}>Have an account ?</Link>
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
                                        </>:"Sign Up"}</button>

                                        <div className="d-flex align-items-center my-3">
                                            <hr className="flex-grow-1" />
                                            <span className="mx-2 text-muted">or</span>
                                            <hr className="flex-grow-1" />
                                        </div>
                                        <button type="button" className="btn btn-dark mb-4 w-100 mt-1 d-flex justify-content-center align-items-center" onClick={(e)=>{
                                            e.preventDefault();
                                            signIn('google',{
                                                callbackUrl:"/"
                                            })
                                        }}>{btn ? <>
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
                                        </>:<><i className="bi bi-google" style={{marginRight: '8px', opacity: 0.6}}></i>Sign Up In with Google&nbsp;</>}</button>
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

export default Signup;
