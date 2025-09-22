"use client"
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStory } from "@/store/slice/userSlicer";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "../common/layout";
import { Audio } from "react-loader-spinner";
import { AiOutlineEye, AiFillHeart } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs";

export default function AllStory() {
    const dispatch = useDispatch()
    const { data: session, status: authStatus } = useSession()   // ✅ next-auth status rename
    const router = useRouter();

    // ✅ redux slice
    const { allStory, status: storyStatus, error } = useSelector(
        (state) => state.userAllSlicer
    );

    const [story, setStory] = useState(null)
    const [loading, setLoading] = useState(false)
    const [oldStory, setOldStory] = useState(null)
    const timeOutRef = useRef(null)

    // ✅ API dispatch only after login
    useEffect(() => {
        if (authStatus === "authenticated" && !story) {
            console.log("JWT Token:", session?.user?.jwtToken);
            dispatch(fetchAllStory(session.user.jwtToken));
        }
    }, [authStatus, session, story, dispatch]);


    // ✅ Handle redux slice status
    useEffect(() => {
        if (storyStatus === "succeeded") {
            setStory(allStory);
            setOldStory(allStory);
            setLoading(false);
        }
    }, [storyStatus, allStory]);

    if (loading) {
        return (
            <Layout>
                <div
                    className="container d-flex justify-content-center align-items-center"
                    style={{ height: "100vh" }}
                >
                    <Audio />
                </div>
            </Layout>
        );
    }
    if (storyStatus === "failed") {
        return (
            <Layout>
                <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <h3 className="text-danger">Error: {error}</h3>
                </div>
            </Layout>
        );
    }

    const handleSearch = (searchValue) => {
        searchValue = searchValue.toLowerCase()
        if (timeOutRef.current) {
            clearTimeout(timeOutRef.current)
        }
        timeOutRef.current = setTimeout(() => {
            if (searchValue === "") {
                setStory(oldStory);
            } else {
                const filteredData = oldStory.filter(item =>
                    (item.title.toLowerCase().includes(searchValue)) ||
                    (item.star_name.toLowerCase().includes(searchValue)) ||
                    (item.description.toLowerCase().includes(searchValue))
                );
                setStory(filteredData);
            }
        }, 500);
    };
    return (
        story && (
            <Layout>
                <div className="container mt-3">
                    <div className="row">
                        <div className="col-8 mx-auto">
                            <input
                                className="form-control"
                                style={{
                                    height: "70px",
                                    minHeight: "50px",
                                    borderRadius: "50px",   // ✅ circular edges
                                    paddingLeft: "20px"     // thoda spacing for text
                                }}
                                placeholder="Enter Keyword to Search..."
                                onChange={(e) => {
                                    handleSearch(e.target.value)
                                }}
                            />

                        </div>
                    </div>
                </div><hr />
                <div className="container mt-2 mb-5">
                    <div className="row">
                        {story.map((item, index) => (
                            <div key={index} className="col-sm-6 col-md-4 col-xl-4 col-lg-4 mb-4">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{item.title}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">
                                            {item.star_name}
                                        </h6>
                                        <p className="card-text flex-grow-1">
                                            {item.description.length > 64
                                                ? item.description.substring(0, 64) + "..."
                                                : item.description}
                                        </p>

                                        {/* ✅ Dummy Meta Info */}
                                        <div className="mt-2 mb-3">
                                            <div className="d-flex justify-content-between">
                                                <small className="text-muted d-flex align-items-center">
                                                    <AiOutlineEye className="me-1" /> {Math.floor(Math.random() * 1000)} views
                                                </small>
                                                <small className="text-muted d-flex align-items-center">
                                                    <AiFillHeart className="me-1 text-danger" /> {Math.floor(Math.random() * 500)} likes
                                                </small>
                                            </div>
                                            <small className="text-muted d-flex align-items-center mt-1">
                                                <BsCalendarDate className="me-1" /> {new Date().toLocaleDateString()}
                                            </small>
                                        </div>


                                        <button
                                            className="btn btn-primary mt-auto"
                                            style={{ zIndex: "2" }}
                                            onClick={() => console.log("Read More:", item.id)}
                                        >
                                            Read More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </Layout >
        )
    );

}
