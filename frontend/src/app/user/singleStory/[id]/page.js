"use client"
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleStory } from "@/store/slice/userSlicer";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "../../common/layout";
import { Audio } from "react-loader-spinner";
import { AiOutlineEye, AiFillHeart } from "react-icons/ai";
import { BsCalendarDate } from "react-icons/bs";
import { FaHeart, FaEye, FaShareAlt } from "react-icons/fa";

export default function SingleStory() {
    const params = useParams()
    const id = params.id
    console.log("This is ID at Page : ", id)
    const dispatch = useDispatch()
    const { data: session, status: authStatus } = useSession()   // ✅ next-auth status rename
    const router = useRouter();

    // ✅ redux slice
    const { singleStory, status: storyStatus, error } = useSelector(
        (state) => state.userAllSlicer
    );

    const [story, setStory] = useState(null)
    const [loading, setLoading] = useState(false)
    const [recommeded, setRecommded] = useState(null)
    const timeOutRef = useRef(null)

    // ✅ API dispatch only after login
    useEffect(() => {
        if (authStatus === "authenticated" && !story) {
            console.log("JWT Token:", session?.user?.jwtToken);
            dispatch(fetchSingleStory({ token: session.user.jwtToken, id: id }));
        }
    }, [authStatus, session, story, dispatch]);


    // ✅ Handle redux slice status
    useEffect(() => {
        if (storyStatus === "succeeded") {
            setStory(singleStory);
            setRecommded(singleStory?.recommeded)
            setLoading(false);
        }
    }, [storyStatus, singleStory]);

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

    // const handleSearch = (searchValue) => {
    //     searchValue = searchValue.toLowerCase()
    //     if (timeOutRef.current) {
    //         clearTimeout(timeOutRef.current)
    //     }
    //     timeOutRef.current = setTimeout(() => {
    //         if (searchValue === "") {
    //             setStory(oldStory);
    //         } else {
    //             const filteredData = oldStory.filter(item =>
    //                 (item.title.toLowerCase().includes(searchValue)) ||
    //                 (item.star_name.toLowerCase().includes(searchValue)) ||
    //                 (item.description.toLowerCase().includes(searchValue))
    //             );
    //             setStory(filteredData);
    //         }
    //     }, 500);
    // };
    return (
        <Layout>
            <div className="container mb-5 mt-4">
                <div className="row">
                    {story && <>
                        {/* Left: Main Story */}
                        <div className="col-md-8">
                            <div className="card shadow-sm p-3">
                                <div className="card-body">
                                    <h2 className="card-title">{story.title}</h2>
                                    <h6 className="text-muted mb-3">By {story.star_name}</h6>

                                    <p className="card-text">{story.description}</p>

                                    {/* Stats Row
                                    <div className="d-flex align-items-center gap-4 mt-4">
                                        <small className="text-muted d-flex align-items-center">
                                            <FaEye className="me-1" /> {story.views || Math.floor(Math.random() * 1000)}
                                        </small>
                                        <small className="text-muted d-flex align-items-center">
                                            <FaHeart className="me-1 text-danger" /> {story.likes || Math.floor(Math.random() * 500)}
                                        </small>
                                        <button className="btn btn-sm btn-link text-decoration-none text-muted d-flex align-items-center">
                                            <FaShareAlt className="me-1" /> Share
                                        </button>
                                    </div> */}

                                    {/* Dates */}
                                    <div className="mt-3">
                                        <small className="text-muted d-block">
                                            📅 Release: {new Date(story.created_at).toLocaleDateString()}
                                        </small>
                                        <small className="text-muted d-block">
                                            🔄 Updated: {new Date(story.updated_at).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Recommended Stories */}
                        <div className="col-md-4">
                            <h5 className="mb-3">Recommended Stories</h5>
                            {recommeded && Array.isArray(recommeded) ? (
                                recommeded.map((rec, i) => (
                                    <div key={i} className="card mb-3 shadow-sm" onClick={()=>{
                                        router.push(`/user/singleStory/${rec.id}`)
                                    }}>
                                        <div className="card-body p-2">
                                            <h6 className="card-title mb-1">{rec.title}</h6>
                                            <small className="text-muted">By {rec.star_name}</small>
                                            <p className="card-text small mt-1">
                                                {rec.description.length > 60
                                                    ? rec.description.substring(0, 60) + "..."
                                                    : rec.description}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No recommended stories available</p>
                            )}
                        </div>
                    </>}
                </div>
            </div>
        </Layout>
    );
}
