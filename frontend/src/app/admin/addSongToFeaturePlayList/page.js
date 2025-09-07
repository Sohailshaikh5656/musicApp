"use client"
import { useEffect, useState, useRef } from "react";
import { getAllFeaturedPlayList } from "@/app/utils/apiHandler";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Layout from "@/app/admin/common/layout";
import { ToastContainer, toast } from "react-toastify";
import { fetchAllSong } from "@/store/slice/allSlicer"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { addSongToFeaturedPlayList, deleteSongFromFeaturedPlayList, getAllFeaturedPlayListSongs } from "@/app/utils/apiHandler";

const AddSongToFeaturePlayList = () => {
    const [featuredPlayList, setFeaturedPlayList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error1, setError1] = useState(null);
    const { data: session } = useSession();
    const router = useRouter();
    const [isSelectedPlayList, setIsSelectedPlayList] = useState(false);
    const [selectedPlayList, setSelectedPlayList] = useState(null);
    const [song, setSong] = useState([]);
    const [oldSong, setOldSong] = useState([]);
    let { allSong, status, error } = useSelector((state) => state.allSlicer)
    const [songDiv, setSongDiv] = useState(false)
    const dispatcher = useDispatch();
    const timeOutRef = useRef(null);
    const timeOutRef2 = useRef(null);
    const [listedSong, setListedSong] = useState([])
    const [oldListedSong, setOldListedSong] = useState([])
    useEffect(() => {
        if (session?.user?.jwtToken && (!song || song.length === 0)) {
            dispatcher(fetchAllSong(session?.user?.jwtToken));
        }
    }, [dispatcher, session]);
    useEffect(() => {
        if (status === "loading") {
            showLoader()
        }
        if (status === "succeeded" && allSong) {
            allSong = allSong.map((item) => {
                const min = parseInt(item.duration / 60)
                const sec = parseInt(item.duration % 60)
                return {
                    ...item,
                    duration: `${min} min/ ${sec} sec`
                }
            })
            setSong(allSong);
            setOldSong(allSong);
        }
    }, [status]);
    const showLoader = () => {
        return <div className="text-center my-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>
    }

    // Fetch Featured PlayList
    const fetchFeaturedPlayList = async () => {
        try {
            setLoading(true)
            const res = await getAllFeaturedPlayList({ jwtToken: session?.user?.jwtToken })
            if (res.code == 1) {
                setFeaturedPlayList(res.data)
            } else {
                notify(res.message)
            }
            setLoading(false)
        } catch (error) {
            notify(error.message)
        }
    }
    const addSongToFeaturedListFunc = async (songId, playListId) => {
        try{
            const res = await addSongToFeaturedPlayList({jwtToken: session?.user?.jwtToken, song_id: songId, playList_id: playListId})
            if(res.code == 1){
                notify(res.message)
            }else if(res.code == 11){
                notify(res.data)
            }else{
                notify(res.message)
            }
        }
        catch(error){
            notify(error.message)
        }
    }

    const getFeaturedSongListFunc = async (playListId) => {
        try {
            const res = await getAllFeaturedPlayListSongs({jwtToken: session?.user?.jwtToken, id: playListId});
            if (res.code == 1) {
                if(res.data.song.length > 0){
                    // Format duration for each song
                await dispatcher(fetchAllSong(session?.user?.jwtToken));
                // Filter out songs that are already in the featured playlist
                const featuredSongs = res.data.song;
                setListedSong(featuredSongs);
                setOldListedSong(featuredSongs);
                
                // Filter out songs that are already in the featured playlist
                const featuredSongIds = new Set(featuredSongs.map(song => song.id));
                const availableSongs = song.filter(item => !featuredSongIds.has(item.id));
                
                setSong(availableSongs);
                setOldSong(availableSongs);
                } else {
                    setListedSong([]);
                    setOldListedSong([]);
                }
            } else {
                notify(res.message);
            }
        } catch (error) {
            notify(error.message);
        }
    }

    const deleteSongFromFeaturedListFunc = async (songId, playListId) => {
        try{
            const res = await deleteSongFromFeaturedPlayList({jwtToken: session?.user?.jwtToken, featured_id: playListId, song_id: songId,})
            if(res.code == 1){
                notify("🎵 Song successfully removed from the playlist! ✅")
            }else {
                notify("❌ Failed to remove song from playlist. Please try again.")
            }
        }
        catch(error){
            notify(error.message)
        }
    }
    useEffect(() => {
        if (session?.user?.jwtToken && (!featuredPlayList || featuredPlayList.length === 0)) {
            fetchFeaturedPlayList()
        }
    }, [session?.user?.jwtToken])
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
                setSong(oldSong); // Reset to original data if search is cleared
            } else {
                const filteredData = oldSong.filter(item =>
                (
                    item.title.toLowerCase().includes(searchValue) ||
                    item.album_name.toLowerCase().includes(searchValue)||
                    item.release_date.toLowerCase().includes(searchValue)
                )
                );
                setSong(filteredData);
            }
        }, 500);
    };
    const handleSearch2 = (searchValue) => {
        searchValue = searchValue.toLowerCase()
        if (timeOutRef2.current) {
            clearTimeout(timeOutRef2.current)
        }
        timeOutRef2.current = setTimeout(() => {
            if (searchValue === "") {
                setListedSong(oldListedSong); // Reset to original data if search is cleared
            } else {
                const filteredData = oldListedSong.filter(item =>
                (
                    item.title.toLowerCase().includes(searchValue) ||
                    item.album_name.toLowerCase().includes(searchValue) ||
                    item.release_date.toLowerCase().includes(searchValue)
                )
                );
                setListedSong(filteredData);
            }
        }, 500);
    };

    const coverImageTemplate = (rowData) => {
        return (
            <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${rowData.cover_image}`}
                style={{ height: "50px", width: "50px", borderRadius: "50%" }}
            />
        );

    }

    const arrayList = [];

    const addSongToFeaturedList = (rowData) => {
        return (
            <button className="btn btn-primary" onClick={() => { addSongFunc(rowData, selectedPlayList.id) }}>
                <i className="bi bi-plus-circle"></i>
            </button>
        );
    }

    const addSongFunc = (song, playListId) => {
        console.log("Add song to Song", song, "playList ID", playListId);
        // arrayList.push(songId);
        setListedSong((prev) => [...prev, song])
        setSong((prev) => prev.filter(item => item.id !== song.id));
        setOldSong((prev) => prev.filter(item => item.id !== song.id));
        setOldListedSong((prev) => [...prev, song])
        addSongToFeaturedListFunc(song.id, playListId)
    }
    const removeSongFromListedList = (rowData) => {
        return (
            <button className="btn btn-danger" onClick={() => { removeSongFromListedListFuc(rowData, selectedPlayList.id) }}>
                <i className="bi bi-trash-fill"></i>
            </button>
        );
    }

    const removeSongFromListedListFuc = (song, playListId) => {
        // arrayList.push(songId);
        console.log("Removed song to Song", song, "playList ID", playListId);
        setListedSong((prev) => prev.filter(item => item.id !== song.id))

        setSong((prev) => [...prev, song]);
        setOldSong((prev) => [...prev, song]);
        setOldListedSong((prev) => prev.filter(item => item.id !== song.id))
        deleteSongFromFeaturedListFunc(song.id, playListId) 
    }


    return (
        <Layout>
            <ToastContainer />
            <div className="container">
                <div className="row mt-5">
                    {!isSelectedPlayList && featuredPlayList.map((playlist, index) => (
                        <div
                            key={index}
                            className="col-md-4 mb-4 adminForm"
                            onClick={() => {
                                setSelectedPlayList(playlist);
                                setIsSelectedPlayList(true);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="h-100 shadow-lg border-0 rounded-4 overflow-hidden">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${playlist.image}`}
                                    className="card-img-top"
                                    alt={playlist.name}
                                    style={{ height: '250px', objectFit: 'cover' }}
                                />
                                <div className="card-body p-4">
                                    <h5 className="card-title fw-bold text-primary mb-3">{playlist.name}</h5>
                                    <p className="card-text text-black mb-4">{playlist.description.substring(0, 70)}{playlist.description.length > 70 ? "..." : ""}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="badge bg-info text-white p-2">
                                            {playlist.songs || 0} Songs
                                        </span>
                                        <small className="text-muted">
                                            <i className="bi bi-calendar me-1"></i>
                                            {new Date(playlist.created_at).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                                <div className="card-footer bg-transparent border-0 p-3">
                                    <button
                                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                        onClick={() => {
                                            setSelectedPlayList(playlist);
                                            setIsSelectedPlayList(true);
                                            setSongDiv(true)
                                            getFeaturedSongListFunc(playlist.id)
                                        }}
                                    >
                                        <i className="bi bi-plus-lg"></i>
                                        Add Songs
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {featuredPlayList.length == 0 && <>There no PlayList</>}
                {isSelectedPlayList && selectedPlayList && (
                    <>
                         <div className="adminForm p-4 my-4">
                        <button
                            className="btn btn-secondary mb-4"
                            onClick={() => {
                                fetchFeaturedPlayList();
                                setIsSelectedPlayList(false);
                                setSelectedPlayList(null);
                                setSongDiv(false);
                            }}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Back to Playlists
                        </button>
                        <h3 className="text-primary mb-4">Add Songs to "{selectedPlayList.name}" Playlist</h3>

                        {songDiv && (<>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by song title or album name..."
                                    onChange={(e) => handleSearch(e.target.value)}
                                    ref={timeOutRef}
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
                                <Column
                                    header="Cover"
                                    body={coverImageTemplate}
                                    style={{ width: '15%', padding: '0.5rem' }}
                                />
                                <Column field="title" header="Title" style={{ width: '20%', padding: '0.5rem' }}></Column>
                                <Column field="album_name" header="Album Name" style={{ width: '20%', padding: '0.5rem' }}></Column>
                                <Column field="duration" header="Duration" style={{ width: '15%', padding: '0.5rem' }}></Column>
                                <Column header={<span style={{ fontSize: '24px' }}><i className="bi bi-trash-fill userIcons"></i></span>} body={addSongToFeaturedList} style={{ width: '15%', padding: '0.5rem' }}></Column>

                            </DataTable>
                        </>
                        )}
                    </div>

                    <div className="adminForm p-4 my-4">
                        <button
                            className="btn btn-secondary mb-4"
                            onClick={() => {
                                fetchFeaturedPlayList();
                                setIsSelectedPlayList(false);
                                setSelectedPlayList(null);
                                setSongDiv(false);
                            }}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Back to Playlists
                        </button>
                        <h3 className="text-primary mb-4">Selected Songs to "{selectedPlayList.name}" Playlist</h3>

                        {listedSong && (<>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by song title or album name..."
                                    onChange={(e) => handleSearch2(e.target.value)}
                                    ref={timeOutRef2}
                                />
                            </div>
                            <DataTable
                                value={listedSong}
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
                                <Column
                                    header="Cover"
                                    body={coverImageTemplate}
                                    style={{ width: '15%', padding: '0.5rem' }}
                                />
                                <Column field="title" header="Title" style={{ width: '20%', padding: '0.5rem' }}></Column>
                                <Column field="album_name" header="Album Name" style={{ width: '20%', padding: '0.5rem' }}></Column>
                                <Column field="duration" header="Duration" style={{ width: '15%', padding: '0.5rem' }}></Column>
                                <Column header={<span style={{ fontSize: '24px' }}><i className="bi bi-trash-fill userIcons"></i></span>} body={removeSongFromListedList} style={{ width: '15%', padding: '0.5rem' }}></Column>

                            </DataTable>
                        </>
                        )}
                    </div>
                    </>

                )}
            </div>

        </Layout>
    )
}

export default AddSongToFeaturePlayList;