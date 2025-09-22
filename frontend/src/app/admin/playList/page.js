"use client"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { getAllUserPlayList } from '@/app/utils/adminApi';
import { ToastContainer, toast } from 'react-toastify';

import Layout from '@/app/admin/common/layout';
import Link from 'next/link';

const PlayList = () =>{
    const {data:session} = useSession()
    const [playList, setPlayList] = useState()
    const timeOutRef = useRef(null)
    const fetchPlayList = async() => {
        try{
            const res = await getAllUserPlayList({jwtToken : session?.user?.jwtToken})
            if(res.code == 1){
                setPlayList(res.data)
            }
        }catch(error){
            notify("Error in fetching")
            console.error(`Error : ${error}`)
        }
    }

    useEffect(()=>{
        if(session?.user?.jwtToken &&  !playList) fetchPlayList()
    },[session?.user?.jwtToken])

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
    const blockTemplate = (rowData) =>{
        if (rowData.is_active) {
            return <a icon="pi pi-bookmark" className="p-button-text" onClick={(e) => { e.preventDefault(); if (window.confirm('Are you sure you want to block this user?')) { /*blockButton(rowData)*/ } }} ><i className="bi bi-check-circle adminUnblockBtn"></i></a>
        } else {
            return <a icon="pi pi-bookmark" className="p-button-text" onClick={(e) => { e.preventDefault(); if (window.confirm('Are you sure you want to unblock this user?')) { /*blockButton(rowData)*/ } }} ><i className="bi bi-lock-fill adminBlockBtn"></i></a>
        }
    }
    const editTemplate = (rowData) =>{
         return <Link href={""} icon="pi pi-bookmark" className="p-button-text" onClick={(e) => { e.preventDefault(); /*editButton(rowData)*/ }} ><i className="bi bi-pencil adminEditBtn"></i></Link>
    }
    const viewMoreTemplate = (rowData) =>{
        return <Link href={`/admin/singlePlayList/${rowData.id}`} icon="pi pi-bookmark" className="p-button-text" ><i className="bi bi-eye adminEyeBtn"></i></Link>
    }
    const deleteTemplate = (rowData) =>{
        return <a className="p-button-text" onClick={(e) => { e.preventDefault(); if (window.confirm('Are you sure you want to delete this user?')) { /*deleteButton(rowData)*/ } }} ><i className="bi bi-trash adminDeletebtn"></i></a>
    }
    return (
       <Layout>
         <ToastContainer />
            {playList && playList.length>0 ? <>
                <div className="card shadow-md p-4 bg-white rounded-lg adminForm p-5">
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
                        value={playList}
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
                        <Column field="username" header="Name" style={{ width: '25%', padding: '0.5rem' }}></Column>
                        <Column field="title" header="Email" style={{ width: '25%', padding: '0.5rem' }}></Column>
                        <Column field="total_songs" header="User Name" style={{ width: '25%', padding: '0.5rem' }}></Column>
                        <Column header={<span style={{ fontSize: '24px' }}><i className="bi bi-lock-fill userIcons"></i></span>} body={blockTemplate} style={{ width: '15%', padding: '0.5rem' }}></Column>
                        <Column header={<span style={{ fontSize: '24px' }}><i className="bi bi-pencil-square userIcons"></i></span>} body={editTemplate} style={{ width: '15%', padding: '0.5rem' }}></Column>
                        <Column header={<span style={{ fontSize: '24px' }}><i className="bi bi-eye-fill userIcons"></i></span>} body={viewMoreTemplate} style={{ width: '15%', padding: '0.5rem' }}></Column>
                        <Column header={<span style={{ fontSize: '24px' }}><i className="bi bi-trash-fill userIcons"></i></span>} body={deleteTemplate} style={{ width: '15%', padding: '0.5rem' }}></Column>
                    </DataTable>
                </div>
                
            </> : <>
                <h1 className='text-secondary'>There is no PlayList</h1>
            </>}
       </Layout>
    )
}

export default PlayList