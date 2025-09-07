"use client"
import { useState, useEffect, use } from "react"
import { getCategory } from "@/app/utils/apiHandler"
import { updateSong } from "@/app/utils/apiHandler"
import { useSession } from "next-auth/react"
import Layout from "../common/layout"
import { deleteCategory } from "@/app/utils/apiHandler"
import { useRef } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { getSong } from "@/app/utils/apiHandler"
import { fetchAllSong } from "@/store/slice/allSlicer"
import { useSelector } from "react-redux"
import Loader from "../common/loader"


const AllSong = () => {
    const {data:session}= useSession()
    const dispatcher = useDispatch([])
    const [song, setSong]=useState([])
    const [oldSong, setOldSong] = useState()
    const timeOutRef = useRef(null)
    const [viewMoreBtn,setViewMoreBtn] = useState(false);
    const [viewMoreData,setViewMoreData]=useState([])
    const router = useRouter()
    let { allSong, status, error } = useSelector((state) => state.allSlicer)
    // Fetch songs when session is available and song data is empty
    useEffect(() => {
        if (session?.user?.jwtToken && (!song || song.length === 0)) {
            dispatcher(fetchAllSong(session?.user?.jwtToken));
        }
    }, [dispatcher, session]);
    const showLoader = () =>{
        return <Loader></Loader>
    }

    // Handle loading and data setting based on fetch status
    useEffect(() => {
        if (status === "loading") {
            showLoader()
        }
        if (status === "succeeded" && allSong) {
            allSong = allSong.map((item)=>{
                const min = parseInt(item.duration/60)
                const sec = parseInt(item.duration%60)
                return{
                    ...item,
                    duration: `${min} min/ ${sec} sec`
                }
            })
            setSong(allSong);
            setOldSong(allSong);
        }
    }, [status]);
    const editTemplate = (rowData) => {
        return <Link href={""} icon="pi pi-bookmark" className="p-button-text" onClick={(e)=>{e.preventDefault();editButton(rowData)}} ><i className="bi bi-pencil adminEditBtn"></i></Link>
    }
    const editButton = (rowData)=>{
        router.push(`/admin/editSong/${rowData.id}`)
    }
    const viewMoreTemplate = (rowData) => {
        return <a href={'/admin/userViewMore'} icon="pi pi-bookmark" className="p-button-text" onClick={(e)=>{e.preventDefault(); viewMoreFunc(rowData)}} ><i className="bi bi-eye adminEyeBtn"></i></a>
    }
    const viewMoreFunc = (rowData)=>{
        setViewMoreBtn(true)
        setViewMoreData(rowData)
    }
    const blockTemplate = (rowData) => {
        if(rowData.is_active){
            return <a icon="pi pi-bookmark" className="p-button-text" onClick={(e)=>{e.preventDefault();if(window.confirm('Are you sure you want to block this Song?')){blockButton(rowData)}}} ><i className="bi bi-check-circle adminUnblockBtn"></i></a>
        }else{
            return <a icon="pi pi-bookmark" className="p-button-text" onClick={(e)=>{e.preventDefault();if(window.confirm('Are you sure you want to unblock this Song?')){blockButton(rowData)}}} ><i className="bi bi-lock-fill adminBlockBtn"></i></a>
        }
    }
    const blockButton = async(rowData)=>{
        console.log("this is Blocked Data : ",rowData)
            let res = await updateSong({jwtToken:session?.user?.jwtToken, id:rowData.id, is_active:rowData.is_active})
            if(res.code == 1){
                rowData.is_active ? notify(<div><i className="bi bi-check-circle-fill text-success"></i> Category Blocked Successfully!</div>) : notify(<div><i className="bi bi-check-circle-fill text-success"></i> User Unblocked Successfully!</div>)
            }else{
                rowData.is_active ? notify(<div><i className="bi bi-x-circle-fill text-danger"></i>Error in Blocking Category!</div>) : notify(<div><i className="bi bi-x-circle-fill text-danger"></i> Error in Unblocking User!</div>)
            }

            const s = song.map((item) => {
                if (item.id === rowData.id) {
                    return {
                        ...item,
                        is_active: item.is_active ? 0 : 1
                    };
                }
                return item;
            });

            setSong(s)
            setOldSong(s)

    }
    const deleteTemplate = (rowData) => {
        return <a className="p-button-text" onClick={(e)=>{e.preventDefault();if(window.confirm('Are you sure you want to delete this category?')){deleteButton(rowData)}}} ><i className="bi bi-trash adminDeletebtn"></i></a>
    }
    const deleteButton = async(rowData)=>{
        console.log("This is Deleted Data : ",rowData)
        // Use functional update to ensure state updates correctly
        setSong(prevData => {
            const newData = prevData.filter(item => rowData.id != item.id);
            return newData;
        });

        setOldSong(prevData => {
            const newData = prevData.filter(item => rowData.id != item.id);
            return newData
        })
        const res = await deleteCategory({jwtToken : session?.user?.jwtToken, id:rowData.id})
        if(res?.code == 1){
            notify(<div><i className="bi bi-check-circle-fill text-success"></i> User Deleted Successfully !</div>)
        }else{
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
        if(timeOutRef.current){
            clearTimeout(timeOutRef.current)
        }
        timeOutRef.current = setTimeout(() => {
            if (searchValue === "") {
                setSong(oldSong); // Reset to original data if search is cleared
            } else {
                const filteredData = oldSong.filter(item => 
                    (
                        item.title.toLowerCase().includes(searchValue) ||
                        item.album_name.toLowerCase().includes(searchValue)
                    )
                );
                setSong(filteredData);
            }
        }, 500);
    };

    const coverImageTemplate = (rowData) => {
        console.log("Data ============: ",rowData)
        console.log("Image ============: ",`${process.env.NEXT_PUBLIC_IMAGE_URL}${rowData.song}`)
        return (
                <img 
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${rowData.cover_image}`} 
                    style={{ height: "50px", width: "50px", borderRadius: "50%" }} 
                />
            );

    }
    return (
        <Layout>
            <ToastContainer />
            {viewMoreBtn?<>
                <div className="container">
                <div className="card shadow-md p-4 bg-white rounded-lg adminForm">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Category</h2>
                    <div className="row">
                        <div className="col-6 mb-3">
                            <div className="font-weight-bold h5 text-primary">Name:</div>
                            <div className="h4 text-secondary">{viewMoreData?.name || "N/A"}</div>
                        </div>
                        <div className="col-6 mb-3">
                            <div className="font-weight-bold h5 text-primary">Image:</div>
                            {viewMoreData?.image ? 
                                <img 
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${viewMoreData.image}`} 
                                    alt="Category" 
                                    className="h4 text-secondary"
                                    style={{maxWidth: '200px', height: 'auto'}}
                                /> : 
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
                            Back to User List
                        </button>
                    </div>
                </div>
            </div>
            </>:
                <>
                 <div className="card shadow-md p-4 bg-white rounded-lg adminForm p-5">
                 <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">All Category</h2>
                 <div className="mb-3">
                     <input 
                     ref={timeOutRef}
                         type="text" 
                         className="form-control" 
                         placeholder="Search by title..."
                         onChange={(e) => {
                             handleSearch(e.target.value.toLowerCase());
                         }}
                     />
                 </div>
                 <DataTable 
                     value={song} 
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
                     <Column field="id" header="ID" style={{ width: '10%', padding: '0.5rem' }}></Column>
                     <Column field="title" header="Title" style={{ width: '20%', padding: '0.5rem' }}></Column>
                     <Column 
                            header="Cover" 
                            body={coverImageTemplate} 
                            style={{ width: '15%', padding: '0.5rem' }} 
                        />
                    <Column field="album_name" header="Album Name" style={{ width: '20%', padding: '0.5rem' }}></Column>
                     <Column field="duration" header="Duration" style={{ width: '15%', padding: '0.5rem' }}></Column>
                     <Column field="release_date" header="Release Date" style={{ width: '15%', padding: '0.5rem' }}></Column>
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
export default AllSong