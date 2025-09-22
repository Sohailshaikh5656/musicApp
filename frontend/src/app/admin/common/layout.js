"use client"
import SideNavBar from "./sideNavBar";
import NavBar from "./navBar";
import '@/app/styles/admin/style.css';
import { LineWave } from "react-loader-spinner";
import { useEffect, useState } from "react";

const Layout = ({ children }) => {
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        setLoader(true);
        const timer = setTimeout(() => {
            setLoader(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loader ? (
                <div className="container d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
                    <div className="loader">
                        <LineWave
                            visible={true}
                            height="200"
                            width="200"
                            color="#4fa94d"
                            ariaLabel="line-wave-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            firstLineColor=""
                            middleLineColor=""
                            lastLineColor=""
                        />
                    </div>
                </div>
            ) : (
                <div className="container-fluid min-vh-100">
                    <div className="row sideNavClass min-vh-100">
                        {/* Sidebar */}
                        <SideNavBar />

                        {/* Main Content */}
                        <div className="col-lg-10 col-sm-9 col-md-9 col-9">
                            <div className="row">
                                {/* Top Navbar */}
                                <NavBar />

                                {/* Page Content */}
                                <div className="col-12 p-3 mainContent">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Layout;
