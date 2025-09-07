"use client"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useCallback, useEffect, useState, useRef, useMemo } from "react"
import { Button } from 'primereact/button';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux"
import { fetchAllUser } from "@/store/slice/allSlicer"
import { useSession } from "next-auth/react"
import Layout from "../common/layout"
import { deleteUser, blockUser, unBlockUser, getUserPlayList } from "@/app/utils/apiHandler";
import { useRouter } from "next/navigation";
// Theme CSS (pick only ONE theme)
import 'primereact/resources/themes/lara-light-indigo/theme.css'
// Core PrimeReact styles
import 'primereact/resources/primereact.min.css'
// PrimeIcons (for icons like pagination arrows etc.)
import 'primeicons/primeicons.css'
import Link from "next/link";


const UserData = () => {
    const dispatch = useDispatch()
    const { data: session } = useSession();
    const router = useRouter();
    // console.log("Session : ",session)
    // console.log("Session Data:", session);
    // console.log("User Role:", session?.user?.role);
    // console.log("User Email:", session?.user?.email);
    // console.log("JWT Token:", session?.user?.jwtToken);
    const [userPlayList, setUserPlayList] = useState()
    let { allUser, status, error } = useSelector((state) => state.allSlicer)
    useEffect(() => {
        if (status === "authenticated") {
            console.log("JWT Token:", session.user?.jwtToken);
        } else if (status === "unauthenticated") {
            console.log("User is not authenticated");
        }
    }, [status]);
    const [userData, setUserData] = useState([])
    const [loading, setLoading] = useState(false)
    const [errorState, setErrorState] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [search, setSearch] = useState('')
    const [oldUserData, setOldUserData] = useState([])
    const timeOutRef = useRef(null)
    const [viewMoreBtn, setViewMoreBtn] = useState(false)
    const [viewMoreData, setViewMoreData] = useState({})

    useEffect(() => {
        dispatch(fetchAllUser(session?.user?.jwtToken))

    }, [session])

    const fetchPlayList = async (id) => {
        try {
            const res = await getUserPlayList({ jwtToken: session?.user?.jwtToken, id: id })
            if (res.code == 1) {
                setUserPlayList(res.data)
            }
        } catch (error) {
            console.error("Error : ", error)
        }
    }

    useEffect(() => {
        if (status === "loading") {
            setLoading(true)
        }
        if (status === "succeeded") {
            setUserData(allUser)
            setOldUserData(allUser);
            console.log("Old Data : ", oldUserData)
            setLoading(false)
        }
    }, [status])

    if (loading) {
        return <div>Loading...</div>
    }

    if (errorState) {
        return <div>Error : {errorState}</div>
    }
    const editTemplate = (rowData) => {
        return <Link href={""} icon="pi pi-bookmark" className="p-button-text" onClick={(e) => { e.preventDefault(); editButton(rowData) }} ><i className="bi bi-pencil adminEditBtn"></i></Link>
    }
    const editButton = (rowData) => {
        router.push(`/admin/editUser/${rowData.id}`)
    }
    const viewMoreTemplate = (rowData) => {
        return <a href={'/admin/userViewMore'} icon="pi pi-bookmark" className="p-button-text" onClick={(e) => { e.preventDefault(); viewMoreFunc(rowData) }} ><i className="bi bi-eye adminEyeBtn"></i></a>
    }
    const viewMoreFunc = (rowData) => {
        setViewMoreBtn(true)
        setViewMoreData(rowData)
        fetchPlayList(rowData.id)
    }
    const blockTemplate = (rowData) => {
        if (rowData.is_active) {
            return <a icon="pi pi-bookmark" className="p-button-text" onClick={(e) => { e.preventDefault(); if (window.confirm('Are you sure you want to block this user?')) { blockButton(rowData) } }} ><i className="bi bi-check-circle adminUnblockBtn"></i></a>
        } else {
            return <a icon="pi pi-bookmark" className="p-button-text" onClick={(e) => { e.preventDefault(); if (window.confirm('Are you sure you want to unblock this user?')) { blockButton(rowData) } }} ><i className="bi bi-lock-fill adminBlockBtn"></i></a>
        }
    }
    const blockButton = async (rowData) => {
        console.log("this is Blocked Data : ", rowData)
        let res = await blockUser({ jwtToken: session?.user?.jwtToken, id: rowData.id, is_active: rowData.is_active })
        if (res.code == 1) {
            rowData.is_active ? notify(<div><i className="bi bi-check-circle-fill text-success"></i> User Blocked Successfully!</div>) : notify(<div><i className="bi bi-check-circle-fill text-success"></i> User Unblocked Successfully!</div>)
        } else {
            rowData.is_active ? notify(<div><i className="bi bi-x-circle-fill text-danger"></i> Error in Blocking User!</div>) : notify(<div><i className="bi bi-x-circle-fill text-danger"></i> Error in Unblocking User!</div>)
        }

        const users = userData.map((user) => {
            if (user.id === rowData.id) {
                return {
                    ...user,
                    is_active: user.is_active ? 0 : 1
                };
            }
            return user;
        });

        setUserData(users)
        setOldUserData(users)

    }
    const deleteTemplate = (rowData) => {
        return <a className="p-button-text" onClick={(e) => { e.preventDefault(); if (window.confirm('Are you sure you want to delete this user?')) { deleteButton(rowData) } }} ><i className="bi bi-trash adminDeletebtn"></i></a>
    }
    const deleteButton = async (rowData) => {
        console.log("This is Deleted Data : ", rowData)
        // Use functional update to ensure state updates correctly
        setUserData(prevData => {
            const newData = prevData.filter(user => rowData.id != user.id);
            return newData;
        });

        setOldUserData(prevData => {
            const newData = prevData.filter(user => rowData.id != user.id);
            return newData
        })
        const res = await deleteUser({ jwtToken: session?.user?.jwtToken, id: rowData.id })
        if (res?.code == 1) {
            notify(<div><i className="bi bi-check-circle-fill text-success"></i> User Deleted Successfully !</div>)
        } else {
            notify(<div><i className="bi bi-x-circle-fill text-danger"></i> Error in Deleting User !</div>)
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
    const handleSearch = (searchValue) => {
        searchValue = searchValue.toLowerCase()
        if (timeOutRef.current) {
            clearTimeout(timeOutRef.current)
        }
        timeOutRef.current = setTimeout(() => {
            if (searchValue === "") {
                setUserData(oldUserData); // Reset to original data if search is cleared
            } else {
                const filteredData = oldUserData.filter(user =>
                    (user.name.toLowerCase().includes(searchValue)) ||
                    (user.email.toLowerCase().includes(searchValue)) ||
                    (user.username.toLowerCase().includes(searchValue))
                );
                setUserData(filteredData);
            }
        }, 500);
    };

    return (
        <Layout>
            <ToastContainer />
            {viewMoreBtn ? <>
                <div className="container">
                    <div className="card shadow-md p-4 bg-white rounded-lg adminForm">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">User Details</h2>
                        <div className="row">
                            <div className="col-6 mb-3">
                                <div className="font-weight-bold h5 text-primary">Name:</div>
                                <div className="h4 text-secondary">{viewMoreData?.name || "N/A"}</div>
                            </div>
                            <div className="col-6 mb-3">
                                <div className="font-weight-bold h5 text-primary">Username:</div>
                                <div className="h4 text-secondary">{viewMoreData?.username || "N/A"}</div>
                            </div>
                            <div className="col-6 mb-3">
                                <div className="font-weight-bold small">Email:</div>
                                <div className="small">{viewMoreData?.email || "N/A"}</div>
                            </div>
                            <div className="col-6 mb-3">
                                <div className="font-weight-bold small">Login: Type :</div>
                                <div className="small">{viewMoreData?.login_type == 'S' ? "Simple Login" : "Social Login"}</div>
                            </div>
                            <div className="col-6 mb-3">
                                <div className="font-weight-bold small">Created At:</div>
                                <div className="small">{viewMoreData?.created_at || "N/A"}</div>
                            </div>
                            <div className="col-6 mb-3">
                                <div className="font-weight-bold small">Updated At:</div>
                                <div className="small">{viewMoreData?.updated_at || "N/A"}</div>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <button
                                className="btn btn-primary"
                                onClick={() => setViewMoreBtn(false)}
                            >
                                Back to User List
                            </button>
                        </div>
                    </div>
                    {userPlayList && userPlayList.length > 0 && <>
                        <div className='container mt-4 adminForm'>
                            <div className='row'>
                                {userPlayList.map((item,index) => (
                                    // <div key={index} className='col-4 p-3 m-2 border rounded-1 bg-white'>
                                        <div key={index}  className="card m-2" style={{width: '18rem'}} onClick={()=>{router.push(`/admin/singlePlayList/${item.id}`)}}>
                                            <img className="card-img-top" src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`} alt="Card image cap" style={{height:"200px", width:"auto", backgroundSize:"cover"}} />
                                                <div className="card-body">
                                                    <h5 className="card-title">{item.title}</h5>
                                                    <p className="card-text">Total &nbsp;{item?.songs<=1 ? "Song" : "Songs"}&nbsp;&nbsp;{item?.songs}</p>
                                                    <p className="card-text">{item.created_at}</p>
                                                    <a href="#" className="btn btn-primary">See All Songs</a>
                                                </div>
                                        </div>
                                    // </div>
                                ))}
                            </div>
                        </div>
                    </>}
                </div>
            </> : <>
                <div className="shadow-md p-4 rounded-lg p-5 adminForm">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">All Users</h2>
                    <div className="mb-3">
                        <input
                            ref={timeOutRef}
                            type="text"
                            className="form-control"
                            placeholder="Search by name, email and username..."
                            onChange={(e) => {
                                handleSearch(e.target.value.toLowerCase());
                            }}
                        />
                    </div>
                    <DataTable
                        value={userData}
                        paginator
                        rows={5}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        tableStyle={{
                            minWidth: '50rem',
                            textAlign: "center",
                            padding: '1rem',
                            margin: '1rem 0'
                        }}
                        className="p-datatable-striped p-datatable-gridlines adminForm"
                    >
                        <Column field="id" header="ID" style={{ width: '15%', padding: '0.5rem' }}></Column>
                        <Column field="name" header="Name" style={{ width: '25%', padding: '0.5rem' }}></Column>
                        <Column field="email" header="Email" style={{ width: '25%', padding: '0.5rem' }}></Column>
                        <Column field="username" header="User Name" style={{ width: '25%', padding: '0.5rem' }}></Column>
                        <Column header={<span style={{ fontSize: '24px' }}><i className="bi bi-lock-fill userIcons"></i></span>} body={blockTemplate} style={{ width: '15%', padding: '0.5rem' }}></Column>
                        <Column header={<span style={{ fontSize: '24px' }}><i className="bi bi-pencil-square userIcons"></i></span>} body={editTemplate} style={{ width: '15%', padding: '0.5rem' }}></Column>
                        <Column header={<span style={{ fontSize: '24px' }}><i className="bi bi-eye-fill userIcons"></i></span>} body={viewMoreTemplate} style={{ width: '15%', padding: '0.5rem' }}></Column>
                        <Column header={<span style={{ fontSize: '24px' }}><i className="bi bi-trash-fill userIcons"></i></span>} body={deleteTemplate} style={{ width: '15%', padding: '0.5rem' }}></Column>
                    </DataTable>
                </div>
            </>}
        </Layout>

    )

}

export default UserData