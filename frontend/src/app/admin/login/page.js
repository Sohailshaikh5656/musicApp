"use client"
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { Audio } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { adminSignIn } from '@/app/utils/apiHandler';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession,signOut, signIn } from "next-auth/react"


const AdminLogin = () => {
    const route = useRouter()
    const [btn, setBtn] = useState(false)
    const initalState = {
        email: "",
        password: "",
    }

    const validationSchema = Yup.object({
        email: Yup.string().email().required("Email Required !"),
        password: Yup.string().required("Password Required !")
    })

    const formik = useFormik({
        initialValues: initalState,
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setBtn(true)
            try{

                const res = await signIn("credentials",{
                    email: values.email,
                    password: values.password,
                    role:"admin",
                    redirect: false
                })
                if (!res?.error) {
                    // Successful sign in
                    route.push("/admin/dashboard");
                } else {
                    // Handle error
                    notify(res.error);
                }
                // const res = await adminSignIn(values);
                // if(res.code == 1){
                //     // Set admin token in cookies for authentication
                //     const token = res.data.jwtToken;
                //     Cookies.set("admin_token",token,{
                //         expires: 1,          // 1 day
                //         secure: true,        // for HTTPS (remove if in localhost dev)
                //         sameSite: 'Strict',
                //         path: '/',
                //     })
                //     // Show success toast notification
                //     notify("🎉 Login Successfully ! 🎉")
                //     resetForm()
                //     // Wait 2 seconds then redirect to dashboard
                //     setTimeout(()=>{
                //         setBtn(false)
                //         route.push("/admin/dashboard")
                //     },2000)
                // } 
                // else if(res.code == 0 && res.keyword == "email not found"){
                //     // Show email not found toast
                //     notify("📧 Email Not Found ! | 🚪 Try To Register or SignUp!")
                //     resetForm()
                //     setBtn(false)
                // }
                // else{
                //     // Show password wrong toast
                //     notify("❌ password wrong ! ❌")
                //     console.log(res)
                //     setBtn(false)
                // }
            }catch(error){
                // Show error toast
                notify(error);
                resetForm()
                setBtn(false)
            }finally{
                setBtn(false)
            }
        }
    })

    // Toast notification function
    const notify = (msg) => {
        toast(msg, {
            position: "top-right",  // Position at top right
            autoClose: 5000,        // Auto close after 5 seconds
            hideProgressBar: false, // Show progress bar
            closeOnClick: true,     // Close on click
            pauseOnHover: true,     // Pause on hover
            draggable: true,        // Allow dragging
            progress: undefined,    // Default progress
            theme: "light",         // Light theme
        });
    }

    return (
        <div style={{
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
        }}>
            <ToastContainer />
            <div className='container d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                <div className='row justify-content-center'>
                    <div className='col-md-8 col-lg-6'>
                        <div className='card shadow-lg'>
                            <div className='row g-0'>
                                <div className='col-md-6 d-none d-md-block'>
                                    <img
                                        src="/assets/user/images/admin_login.jpg"
                                        alt="Image"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            background: 'linear-gradient(to bottom right, rgba(128, 0, 128, 0.6), rgba(0, 0, 255, 0.6))',
                                            backdropFilter: 'blur(10px)',
                                            WebkitBackdropFilter: 'blur(10px)',
                                        }}
                                    />
                                </div>
                                <div className='col-md-6 p-4'>
                                    <form noValidate onSubmit={formik.handleSubmit}>
                                        <h2 className='h2 text-secondary mb-4 text-center'>Admin Login</h2>
                                        <div className='mb-3'>
                                            <input type='text' className='form-control' name='email' value={formik.values.email} onBlur={formik.handleBlur} onChange={formik.handleChange} placeholder="Email" />
                                            {formik.touched.email && formik.errors.email && <div className='text-danger small mt-1'>{formik.errors.email}</div>}
                                        </div>
                                        <div className='mb-3'>
                                            <input type='password' className='form-control' name='password' value={formik.values.password} onBlur={formik.handleBlur} onChange={formik.handleChange} placeholder="Password" />
                                            {formik.touched.password && formik.errors.password && <div className='text-danger small mt-1'>{formik.errors.password}</div>}
                                        </div>
                                        <div className='d-grid'>
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
                                        </>:"LogIn"}</button>
                                        </div>
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

export default AdminLogin;