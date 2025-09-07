"use client"
import { useState, useEffect } from "react"
import { getCategory, updateCategory } from "@/app/utils/apiHandler"
import { useSession } from "next-auth/react"
import Layout from "../common/layout"
import { deleteCategory } from "@/app/utils/apiHandler"
import { useRef } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import { useRouter } from "next/navigation"


const AllCategory = () => {
    const {data:session}= useSession()
    const [category, setCategory]=useState()
    const [oldCategory, setOldCategory] = useState()
    const timeOutRef = useRef(null)
    const [viewMoreBtn,setViewMoreBtn] = useState(false);
    const [viewMoreData,setViewMoreData]=useState([])
    const router = useRouter()
    const fetchCategory = async()=>{
        const res = await getCategory({jwtToken:session?.user?.jwtToken})
        console.log("This is Response : ",res)
        if(res.code == 1){
            setCategory(res.data)
            setOldCategory(res.data)
        }
    }
    useEffect(()=>{
        if(session?.user?.jwtToken && (!category || category.length === 0)){
            fetchCategory()
        }
    },[session])
    const editTemplate = (rowData) => {
        return <Link href={""} icon="pi pi-bookmark" className="p-button-text" onClick={(e)=>{e.preventDefault();editButton(rowData)}} ><i className="bi bi-pencil adminEditBtn"></i></Link>
    }
    const editButton = (rowData)=>{
        router.push(`/admin/editCategory/${rowData.id}`)
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
            return <a icon="pi pi-bookmark" className="p-button-text" onClick={(e)=>{e.preventDefault();if(window.confirm('Are you sure you want to block this category?')){blockButton(rowData)}}} ><i className="bi bi-check-circle adminUnblockBtn"></i></a>
        }else{
            return <a icon="pi pi-bookmark" className="p-button-text" onClick={(e)=>{e.preventDefault();if(window.confirm('Are you sure you want to unblock this category?')){blockButton(rowData)}}} ><i className="bi bi-lock-fill adminBlockBtn"></i></a>
        }
    }
    const blockButton = async(rowData)=>{
        console.log("this is Blocked Data : ",rowData)
            let res = await updateCategory({jwtToken:session?.user?.jwtToken, id:rowData.id, is_active:rowData.is_active})
            if(res.code == 1){
                rowData.is_active ? notify(<div><i className="bi bi-check-circle-fill text-success"></i> Category Blocked Successfully!</div>) : notify(<div><i className="bi bi-check-circle-fill text-success"></i> User Unblocked Successfully!</div>)
            }else{
                rowData.is_active ? notify(<div><i className="bi bi-x-circle-fill text-danger"></i>Error in Blocking Category!</div>) : notify(<div><i className="bi bi-x-circle-fill text-danger"></i> Error in Unblocking User!</div>)
            }

            const cat = category.map((item) => {
                if (item.id === rowData.id) {
                    return {
                        ...item,
                        is_active: item.is_active ? 0 : 1
                    };
                }
                return item;
            });

            setCategory(cat)
            setOldCategory(cat)

    }
    const deleteTemplate = (rowData) => {
        return <a className="p-button-text" onClick={(e)=>{e.preventDefault();if(window.confirm('Are you sure you want to delete this category?')){deleteButton(rowData)}}} ><i className="bi bi-trash adminDeletebtn"></i></a>
    }
    const deleteButton = async(rowData)=>{
        console.log("This is Deleted Data : ",rowData)
        // Use functional update to ensure state updates correctly
        setCategory(prevData => {
            const newData = prevData.filter(item => rowData.id != item.id);
            return newData;
        });

        setOldCategory(prevData => {
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
                setCategory(oldCategory); // Reset to original data if search is cleared
            } else {
                const filteredData = oldCategory.filter(item => 
                    (item.name.toLowerCase().includes(searchValue))
                );
                setCategory(filteredData);
            }
        }, 500);
    };
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
                         placeholder="Search by name..."
                         onChange={(e) => {
                             handleSearch(e.target.value.toLowerCase());
                         }}
                     />
                 </div>
                 <DataTable 
                     value={category} 
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
                     <Column field="name" header="Name" style={{ width: '25%', padding: '0.5rem' }}></Column>
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
export default AllCategory