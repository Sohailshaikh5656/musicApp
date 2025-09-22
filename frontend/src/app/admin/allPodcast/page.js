"use client"
import { useState, useEffect } from "react"
// import { getCategory, updateCategory } from "@/app/utils/apiHandler"
import { getAllPodCast, updatedPodCast } from "@/app/utils/adminApi"
import { useSession } from "next-auth/react"
import Layout from "../common/layout"
import { deleteCategory } from "@/app/utils/adminApi"
import { useRef } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { deletePodCast } from "@/app/utils/adminApi"


const AllFeaturedPlayList = () => {
    const { data: session } = useSession()
    const [podcast, setPodcast] = useState()
    const [oldPodcast, setOldPodcast] = useState()
    const timeOutRef = useRef(null)
    const [viewMoreBtn, setViewMoreBtn] = useState(false);
    const [viewMoreData, setViewMoreData] = useState([])
    const router = useRouter()
    const fetchData = async () => {
        const res = await getAllPodCast({ jwtToken: session?.user?.jwtToken })
        console.log("This is Response : ", res)
        if (res.code == 1) {
            if (!Array.isArray(res.data)) {
                let arr = []
                arr.push(res.data)
                setPodcast(arr)
                setOldPodcast(arr)
            } else {
                setPodcast(res.data)
                setOldPodcast(res.data)
            }
        }
    }
    useEffect(() => {
        if (session?.user?.jwtToken && (!podcast || podcast.length === 0)) {
            fetchData()
        }
    }, [session])
    const editTemplate = (rowData) => {
        return <Link href={""} icon="pi pi-bookmark" className="p-button-text" onClick={(e) => { e.preventDefault(); editButton(rowData) }} ><i className="bi bi-pencil adminEditBtn"></i></Link>
    }
    const editButton = (rowData) => {
        router.push(`/admin/editPodcast/${rowData.id}`)
    }
    const viewMoreTemplate = (rowData) => {
        return <a href={'/admin/userViewMore'} icon="pi pi-bookmark" className="p-button-text" onClick={(e) => { e.preventDefault(); viewMoreFunc(rowData) }} ><i className="bi bi-eye adminEyeBtn"></i></a>
    }
    const viewMoreFunc = (rowData) => {
        setViewMoreBtn(true)
        setViewMoreData(rowData)
    }
    const blockTemplate = (rowData) => {
        if (rowData.is_active) {
            return <a icon="pi pi-bookmark" className="p-button-text" onClick={(e) => { e.preventDefault(); if (window.confirm('Are you sure you want to block this PodCast?')) { blockButton(rowData) } }} ><i className="bi bi-check-circle adminUnblockBtn"></i></a>
        } else {
            return <a icon="pi pi-bookmark" className="p-button-text" onClick={(e) => { e.preventDefault(); if (window.confirm('Are you sure you want to unblock this PodCast?')) { blockButton(rowData) } }} ><i className="bi bi-lock-fill adminBlockBtn"></i></a>
        }
    }
    const blockButton = async (rowData) => {
        console.log("this is Blocked Data : ", rowData)
        let res = await updatedPodCast({ jwtToken: session?.user?.jwtToken, id: rowData.id, is_active: rowData.is_active, state: 1 })
        if (res.code == 1) {
            rowData.is_active ? notify(<div><i className="bi bi-check-circle-fill text-success"></i> PodCast Blocked Successfully!</div>) : notify(<div><i className="bi bi-check-circle-fill text-success"></i> PodCast Unblocked Successfully!</div>)
        } else {
            rowData.is_active ? notify(<div><i className="bi bi-x-circle-fill text-danger"></i>Error in Blocking PodCast!</div>) : notify(<div><i className="bi bi-x-circle-fill text-danger"></i> Error in Unblocking PodCast!</div>)
        }

        const play = podcast.map((item) => {
            if (item.id === rowData.id) {
                return {
                    ...item,
                    is_active: item.is_active ? 0 : 1
                };
            }
            return item;
        });

        setPodcast(play)
        setOldPodcast(play)

    }
    const deleteTemplate = (rowData) => {
        return <a className="p-button-text" onClick={(e) => { e.preventDefault(); if (window.confirm('Are you sure you want to delete this PodCast?')) { deleteButton(rowData) } }} ><i className="bi bi-trash adminDeletebtn"></i></a>
    }
    const deleteButton = async (rowData) => {
        console.log("This is Deleted Data : ", rowData)
        // Use functional update to ensure state updates correctly
        setPodcast(prevData => {
            const newData = prevData.filter(item => rowData.id != item.id);
            return newData;
        });

        setOldPodcast(prevData => {
            const newData = prevData.filter(item => rowData.id != item.id);
            return newData
        })
        const res = await deletePodCast({ jwtToken: session?.user?.jwtToken, id: rowData.id })
        if (res?.code == 1) {
            notify(<div><i className="bi bi-check-circle-fill text-success"></i> PodCast Deleted Successfully !</div>)
        } else {
            notify(<div><i className="bi bi-x-circle-fill text-danger"></i> Error in Deleting PodCast !</div>)
        }
    }
    const ImageTemplate = (row) => {
        return (<><img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${row.thumbnail}`} height={70} width={70} style={{ borderEndEndRadius: "6px", borderRadius: "50%" }} /></>)
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
                setPodcast(oldPodcast); // Reset to original data if search is cleared
            } else {
                const filteredData = oldPlayList.filter(item =>
                    (item.title.toLowerCase().includes(searchValue) || item.taken_by.toLowerCase().includes(searchValue) || item.description.toLowerCase().includes(searchValue))
                );
                setPodcast(filteredData);
            }
        }, 500);
    };

    const descriptionTemplate = (rowData) => {
        let item = rowData.description.slice(0, 70);
        if (rowData.description.length > 70) {
            item += " ..."
        }

        return <>{item}</>
    }
    return (
        <Layout>
            <ToastContainer />
            {viewMoreBtn ? <>
                <div className="container">
                    <div className="card shadow-md p-4 bg-white rounded-lg adminForm">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">PodCast</h2>
                        <div className="row">
                            <div className="col-6 mb-3">
                                <div className="font-weight-bold h5 text-primary">Title:</div>
                                <div className="h4 text-secondary">{viewMoreData?.title || "N/A"}</div>
                            </div>
                            <div className="col-6 mb-3">
                                <div className="font-weight-bold h5 text-primary">Description:</div>
                                <div className="h4 text-secondary">{viewMoreData?.description || "N/A"}</div>
                            </div>
                            <div className="col-6 mb-3">
                                <div className="font-weight-bold h5 text-primary">Thumbnail:</div>
                                {viewMoreData?.thumbnail ?
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${viewMoreData.thumbnail}`}
                                        alt="thumbnail"
                                        className="h4 text-secondary"
                                        style={{ maxWidth: '350px', height: 'auto', borderRadius:"6%" }}
                                    /> :
                                    <div className="h4 text-secondary">N/A</div>
                                }
                            </div>
                            <div className="col-6 mb-3">
                                <div className="font-weight-bold h5 text-primary">Podcast:</div>

                                {viewMoreData?.video ? <>
                                    <div className="ratio ratio-16x9">
                                        <video
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${viewMoreData.video}`}
                                            alt="video"
                                            className="h4 text-secondary"
                                            controls
                                            style={{ maxWidth: '350px', height: 'auto', borderRadius:"4%" }}
                                        />
                                    </div>
                                </>
                                    :
                                    <div className="h4 text-secondary">N/A</div>
                                }
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
                                Back to PodCast List
                            </button>
                        </div>
                    </div>
                </div>
            </> :
                <>
                    <div className="card shadow-md p-4 bg-white rounded-lg adminForm p-5">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">All PlayList By Admin</h2>
                        <div className="mb-3">
                            <input
                                ref={timeOutRef}
                                type="text"
                                className="form-control"
                                placeholder="Search by name..."
                                onChange={(e) => {
                                    handleSearch(e.target.value.toLowerCase());
                                }}
                            />
                        </div>
                        <DataTable
                            value={podcast}
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            tableStyle={{
                                minWidth: '50rem',
                                textAlign: "center",
                                padding: '1rem',
                                margin: '1rem 0'
                            }}
                            className="p-datatable-striped p-datatable-gridlines"
                        >
                            <Column field="id" header="ID" style={{ width: '15%', padding: '0.5rem' }}></Column>
                            <Column field="thumbnail" header="Thumbnail" style={{ width: '25%', padding: '0.5rem' }} body={ImageTemplate}></Column>
                            <Column field="taken_by" header="Taken By" style={{ width: '25%', padding: '0.5rem' }}></Column>
                            <Column header="Description" style={{ width: '25%', padding: '0.5rem' }} body={descriptionTemplate}></Column>
                            <Column header={<span style={{ fontSize: '24px' }}><i className="bi bi-lock-fill userIcons"></i></span>} body={blockTemplate} style={{ width: '15%', padding: '0.5rem' }}></Column>
                            <Column header={<span style={{ fontSize: '24px' }}><i className="bi bi-pencil-square userIcons"></i></span>} body={editTemplate} style={{ width: '15%', padding: '0.5rem' }}></Column>
                            <Column header={<span style={{ fontSize: '24px' }}><i className="bi bi-eye-fill userIcons"></i></span>} body={viewMoreTemplate} style={{ width: '15%', padding: '0.5rem' }}></Column>
                            <Column header={<span style={{ fontSize: '24px' }}><i className="bi bi-trash-fill userIcons"></i></span>} body={deleteTemplate} style={{ width: '15%', padding: '0.5rem' }}></Column>
                        </DataTable>
                    </div>
                </>
            }
        </Layout>
    )
}
export default AllFeaturedPlayList